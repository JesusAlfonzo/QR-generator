from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile, Response, HTTPException
from app.schemas.qr import ErrorCorrectionLevel, OutputFormat, QRGenerateParams, QRPreviewResponse
from app.services.qr_service import QRService

router = APIRouter()


@router.post("/preview", response_model=QRPreviewResponse)
async def preview_qr(
    data: str = Form(..., description="Data or URL to encode"),
    fill_color: str = Form("#000000"),
    back_color: str = Form("#ffffff"),
    box_size: int = Form(10),
    border: int = Form(4),
    error_correction: ErrorCorrectionLevel = Form(ErrorCorrectionLevel.H),
    logo_scale: float = Form(0.25),
    format: OutputFormat = Form(OutputFormat.PNG),
    logo: Optional[UploadFile] = File(None),
):
    """
    Generate QR preview in base64 format for immediate SPA rendering.
    """
    if not data.strip():
        raise HTTPException(status_code=400, detail="El contenido para el QR no puede estar vacío.")

    logo_bytes = None
    if logo and logo.filename:
        logo_bytes = await logo.read()

    params = QRGenerateParams(
        data=data,
        fill_color=fill_color,
        back_color=back_color,
        box_size=box_size,
        border=border,
        error_correction=error_correction,
        logo_scale=logo_scale,
        format=format,
    )

    data_uri, mime_type, width, height = QRService.generate_preview_base64(params, logo_bytes)

    return QRPreviewResponse(
        image_base64=data_uri,
        mime_type=mime_type,
        width=width,
        height=height,
    )


@router.post("/download")
async def download_qr(
    data: str = Form(..., description="Data or URL to encode"),
    fill_color: str = Form("#000000"),
    back_color: str = Form("#ffffff"),
    box_size: int = Form(10),
    border: int = Form(4),
    error_correction: ErrorCorrectionLevel = Form(ErrorCorrectionLevel.H),
    logo_scale: float = Form(0.25),
    format: OutputFormat = Form(OutputFormat.PNG),
    logo: Optional[UploadFile] = File(None),
):
    """
    Generate and download QR image file (PNG or SVG).
    """
    if not data.strip():
        raise HTTPException(status_code=400, detail="El contenido para el QR no puede estar vacío.")

    logo_bytes = None
    if logo and logo.filename:
        logo_bytes = await logo.read()

    params = QRGenerateParams(
        data=data,
        fill_color=fill_color,
        back_color=back_color,
        box_size=box_size,
        border=border,
        error_correction=error_correction,
        logo_scale=logo_scale,
        format=format,
    )

    raw_bytes, mime_type, _ = QRService.generate_qr_bytes(params, logo_bytes)
    ext = "svg" if format == OutputFormat.SVG and not logo_bytes else "png"
    filename = f"qrcode.{ext}"

    return Response(
        content=raw_bytes,
        media_type=mime_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )
