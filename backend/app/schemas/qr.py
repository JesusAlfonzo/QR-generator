from enum import Enum
from typing import Optional, Tuple
from pydantic import BaseModel, Field


class ErrorCorrectionLevel(str, Enum):
    L = "L"  # ~7% error recovery
    M = "M"  # ~15% error recovery
    Q = "Q"  # ~25% error recovery
    H = "H"  # ~30% error recovery (recommended for logos)


class OutputFormat(str, Enum):
    PNG = "png"
    SVG = "svg"


class QRGenerateParams(BaseModel):
    data: str = Field(..., min_length=1, description="Data to encode in the QR code (URL, text, etc.)")
    fill_color: str = Field("#000000", description="Color of QR code modules (hex or CSS color name)")
    back_color: str = Field("#ffffff", description="Background color of QR code")
    box_size: int = Field(10, ge=1, le=50, description="Size of each box in pixels")
    border: int = Field(4, ge=0, le=20, description="Thickness of the border in boxes")
    error_correction: ErrorCorrectionLevel = Field(
        ErrorCorrectionLevel.H,
        description="Error correction level: L (7%), M (15%), Q (25%), H (30%)"
    )
    logo_scale: float = Field(0.25, ge=0.05, le=0.45, description="Scale of the logo relative to the QR size")
    format: OutputFormat = Field(OutputFormat.PNG, description="Output image format")


class QRPreviewResponse(BaseModel):
    image_base64: str
    mime_type: str
    width: int
    height: int
