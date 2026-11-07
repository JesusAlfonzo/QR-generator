FROM python:3.11-slim

# Instalar dependencias nativas del sistema para CairoSVG y Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    gdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY app ./app

# Exponer el puerto
EXPOSE 8000

# Comando para producción
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
