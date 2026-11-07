import io
import base64
import logging
from typing import Optional, Tuple
import qrcode
from qrcode.constants import (
    ERROR_CORRECT_L,
    ERROR_CORRECT_M,
    ERROR_CORRECT_Q,
    ERROR_CORRECT_H,
)
from qrcode.image.svg import SvgPathImage
from PIL import Image, ImageDraw, ImageColor

from app.schemas.qr import ErrorCorrectionLevel, OutputFormat, QRGenerateParams

logger = logging.getLogger(__name__)

CORRECTION_MAP = {
    ErrorCorrectionLevel.L: ERROR_CORRECT_L,
    ErrorCorrectionLevel.M: ERROR_CORRECT_M,
    ErrorCorrectionLevel.Q: ERROR_CORRECT_Q,
    ErrorCorrectionLevel.H: ERROR_CORRECT_H,
}


class SvgQRImage(SvgPathImage):
    """
    High-fidelity SVG builder that:
    1. Uses pixel units (px) matching PNG dimensions so it renders at full resolution
       instead of shrinking to a few millimeters.
    2. Draws a background <rect> with back_color (unless transparent), preventing
       the QR code from disappearing against dark backgrounds in dark mode.
    3. Respects custom fill_color on the vector path.
    """
    def __init__(self, *args, **kwargs):
        back = kwargs.get("back_color", "#ffffff")
        if back and str(back).lower() != "transparent":
            self.background = str(back)
        else:
            self.background = None

        fill = kwargs.get("fill_color", "#000000")
        self.QR_PATH_STYLE = dict(self.QR_PATH_STYLE)
        self.QR_PATH_STYLE["fill"] = str(fill)
        super().__init__(*args, **kwargs)

    def units(self, pixels, text=True):
        if not text:
            return pixels
        return f"{pixels}px"


class QRService:
    @staticmethod
    def _prepare_logo_image(logo_bytes: bytes) -> Optional[Image.Image]:
        """
        Loads an image from bytes, supporting PNG, JPEG, WEBP, and SVG (via cairosvg).
        Returns an RGBA PIL Image.
        """
        try:
            # Check if bytes represent an SVG
            is_svg = (
                logo_bytes.strip().startswith(b"<")
                or b"<svg" in logo_bytes[:500].lower()
            )
            
            if is_svg:
                try:
                    import cairosvg
                    # Rasterize vector SVG at 800x800 for high quality
                    png_bytes = cairosvg.svg2png(bytestring=logo_bytes, output_width=800, output_height=800)
                    return Image.open(io.BytesIO(png_bytes)).convert("RGBA")
                except Exception as svg_err:
                    logger.error(f"Failed to rasterize SVG logo with cairosvg: {svg_err}")

            # Standard raster image (PNG, JPEG, WEBP)
            return Image.open(io.BytesIO(logo_bytes)).convert("RGBA")
        except Exception as e:
            logger.error(f"Error loading logo image: {e}")
            return None

    @classmethod
    def generate_qr_bytes(
        cls,
        params: QRGenerateParams,
        logo_bytes: Optional[bytes] = None,
    ) -> Tuple[bytes, str, Tuple[int, int]]:
        """
        Generates QR code binary bytes and returns (bytes, mime_type, (width, height)).
        Entirely stateless and in-memory.
        """
        # When a logo is present, ensure at least Level Q or H for reliability
        ec_level = CORRECTION_MAP.get(params.error_correction, ERROR_CORRECT_H)
        if logo_bytes and ec_level in (ERROR_CORRECT_L, ERROR_CORRECT_M):
            ec_level = ERROR_CORRECT_H

        qr = qrcode.QRCode(
            version=None,
            error_correction=ec_level,
            box_size=params.box_size,
            border=params.border,
        )
        qr.add_data(params.data)
        qr.make(fit=True)

        # SVG format (only if no logo)
        if params.format == OutputFormat.SVG and not logo_bytes:
            svg_buffer = io.BytesIO()
            img_svg = qr.make_image(
                image_factory=SvgQRImage,
                fill_color=params.fill_color,
                back_color=params.back_color,
            )
            img_svg.save(svg_buffer)
            svg_bytes = svg_buffer.getvalue()
            matrix_size = len(qr.get_matrix()) + (params.border * 2)
            px_size = matrix_size * params.box_size
            return svg_bytes, "image/svg+xml", (px_size, px_size)

        # Generate base QR Image
        is_transparent = params.back_color.lower() == "transparent"
        img_qr = qr.make_image(
            fill_color=params.fill_color,
            back_color=params.back_color,
        ).convert("RGBA")

        qr_width, qr_height = img_qr.size

        # Embed Logo if provided
        if logo_bytes:
            logo = cls._prepare_logo_image(logo_bytes)
            if logo:
                try:
                    logo_w, logo_h = logo.size
                    max_logo_dim = int(min(qr_width, qr_height) * params.logo_scale)
                    aspect_ratio = logo_w / max(1, logo_h)

                    if aspect_ratio >= 1:
                        new_w = max_logo_dim
                        new_h = max(1, int(max_logo_dim / aspect_ratio))
                    else:
                        new_h = max_logo_dim
                        new_w = max(1, int(max_logo_dim * aspect_ratio))

                    logo_resized = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)

                    # Build a clean rounded badge behind the logo for contrast and scannability
                    padding = max(6, int(max_logo_dim * 0.12))
                    badge_w = new_w + padding * 2
                    badge_h = new_h + padding * 2
                    corner_radius = max(4, int(min(badge_w, badge_h) * 0.20))

                    badge = Image.new("RGBA", (badge_w, badge_h), (0, 0, 0, 0))

                    # Badge background mask (rounded rectangle)
                    mask = Image.new("L", (badge_w, badge_h), 0)
                    draw_mask = ImageDraw.Draw(mask)
                    draw_mask.rounded_rectangle(
                        [(0, 0), (badge_w - 1, badge_h - 1)],
                        radius=corner_radius,
                        fill=255,
                    )

                    # Determine badge background color: default to white or back_color
                    try:
                        bg_color = ImageColor.getrgb(params.back_color) if not is_transparent else (255, 255, 255)
                    except Exception:
                        bg_color = (255, 255, 255)

                    bg_layer = Image.new("RGBA", (badge_w, badge_h), (*bg_color, 255))
                    badge.paste(bg_layer, (0, 0), mask)

                    # Paste resized logo into center of the badge
                    badge.paste(logo_resized, (padding, padding), logo_resized)

                    # Paste badge onto center of QR
                    pos_x = (qr_width - badge_w) // 2
                    pos_y = (qr_height - badge_h) // 2
                    img_qr.paste(badge, (pos_x, pos_y), badge)
                except Exception as e:
                    logger.error(f"Error embedding logo onto QR: {e}")

        # Final conversion
        if not is_transparent:
            final_img = Image.new("RGB", img_qr.size, (255, 255, 255))
            final_img.paste(img_qr, (0, 0), img_qr)
        else:
            final_img = img_qr

        output_buffer = io.BytesIO()
        final_img.save(output_buffer, format="PNG")
        output_bytes = output_buffer.getvalue()

        return output_bytes, "image/png", (qr_width, qr_height)

    @classmethod
    def generate_preview_base64(
        cls,
        params: QRGenerateParams,
        logo_bytes: Optional[bytes] = None,
    ) -> Tuple[str, str, int, int]:
        """
        Generates QR code and returns base64 data URL string, mime_type, width, height.
        """
        raw_bytes, mime_type, (width, height) = cls.generate_qr_bytes(params, logo_bytes)
        encoded = base64.b64encode(raw_bytes).decode("utf-8")
        data_uri = f"data:{mime_type};base64,{encoded}"
        return data_uri, mime_type, width, height
