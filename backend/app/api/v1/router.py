from fastapi import APIRouter
from app.api.v1.endpoints import qr

api_router = APIRouter()
api_router.include_router(qr.router, prefix="/qr", tags=["QR Generator"])
