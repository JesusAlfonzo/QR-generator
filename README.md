# QR Studio (FastAPI + React Vite SPA)

Aplicación web moderna y Single Page Application (SPA) para la generación, personalización e inserción de logotipos en códigos QR en alta resolución, sin necesidad de base de datos (arquitectura completamente *stateless* e in-memory).

---

## 🛠️ Stack Tecnológico

- **Backend**:
  - [Python 3](https://www.python.org/) + [FastAPI](https://fastapi.tiangolo.com/)
  - [python-qrcode[pil]](https://github.com/lincolnloop/python-qrcode) (Licencia BSD-3-Clause)
  - [Pillow (PIL)](https://python-pillow.org/) para redimensionamiento con filtro LANCZOS y transparencia de logos (RGBA).
  - Pydantic v2 para validación estricta de esquemas.

- **Frontend**:
  - [Vite](https://vite.dev/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Radix UI Primitives](https://www.radix-ui.com/) (estilo shadcn/ui): Sliders, Tabs, Labels, Popovers.
  - [Lucide React](https://lucide.dev/) para iconografía moderna.

---

## 📁 Estructura del Proyecto

```text
QR-generator/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── endpoints/
│   │   │   │   └── qr.py          # Endpoints /preview y /download
│   │   │   └── router.py          # Enrutador de la API
│   │   ├── core/
│   │   │   └── config.py          # Configuración y CORS
│   │   ├── schemas/
│   │   │   └── qr.py              # Esquemas Pydantic
│   │   ├── services/
│   │   │   └── qr_service.py      # Servicio generador de QR con Pillow
│   │   └── main.py                # Entrada principal FastAPI
│   ├── requirements.txt
│   └── .venv/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # Componentes base estilo shadcn (Radix UI)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   └── tabs.tsx
│   │   │   ├── ContentTab.tsx     # Selector de tipo (URL, Texto, WiFi)
│   │   │   ├── CustomizationControls.tsx # Paleta de colores, sliders y nivel de error
│   │   │   ├── LogoUpload.tsx     # Carga y escala del logotipo central
│   │   │   └── QRPreviewCard.tsx  # Vista previa interactiva y descargas
│   │   ├── lib/
│   │   │   └── utils.ts           # Helper cn (clsx + tailwind-merge)
│   │   ├── services/
│   │   │   └── qrApi.ts           # Cliente HTTP con FastAPI
│   │   ├── types/
│   │   │   └── qr.ts              # Tipos TypeScript
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── create_advance_qr.py           # Script original de referencia
└── README.md
```

---

## 🚀 Cómo ejecutar el proyecto en desarrollo

### 1. Iniciar el Backend (FastAPI)

En una terminal:

```bash
cd backend
# Activar el entorno virtual existente
source .venv/bin/activate

# Iniciar servidor uvicorn con recarga automática
uvicorn app.main:app --reload --port 8000
```

> La API estará disponible en `http://localhost:8000`. Puedes consultar la documentación Swagger interactiva en `http://localhost:8000/docs`.

### 2. Iniciar el Frontend (Vite)

En otra terminal:

```bash
cd frontend
npm run dev
```

> Abre tu navegador en `http://localhost:5173`. Vite está configurado con un proxy automático hacia `http://localhost:8000` para las llamadas `/api`.

---

## 🎯 Características Implementadas

- **Tipos de Contenido**: Redirección URL, texto plano y credenciales de red WiFi (SSID, contraseña, tipo de cifrado).
- **Personalización de Diseño**:
  - Color de módulos y fondo con selector interactivo y paletas predefinidas.
  - Control de resolución en píxeles y márgenes exteriores.
  - Corrección de error configurable (L, M, Q, H).
  - Modo Oscuro nativo con paleta neutra e inversión de alto contraste.
- **Incrustación de Logotipos**: Carga de imagen con cálculo proporcional y preservación de canal alfa/transparencia.
- **Vista Previa en Tiempo Real**: Renderizado con *debounce* para rendimiento óptimo.
- **Descargas**: Exportación en formato PNG de alta resolución y SVG vectorial fiel con fondo adaptable.
- **Copia Rápida**: Botón para copiar la imagen directamente al portapapeles.

---

## ☁️ Guía de Despliegue en Producción

Debido a que el backend procesa imágenes y gráficos vectoriales mediante librerías nativas de C (`libcairo2` / Pillow), la arquitectura recomendada es **desacoplada**:

### 1. Despliegue del Frontend en Vercel
1. Conecta tu repositorio de GitHub en [Vercel](https://vercel.com).
2. En la configuración del proyecto:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Agrega la variable de entorno:
   - `VITE_API_URL`: `https://tu-backend.up.railway.app` (URL de tu backend en producción).
4. El archivo [`frontend/vercel.json`](file:///home/snowy/Proyectos/QR-generator/frontend/vercel.json) ya configurado se encarga de los rewrites SPA y cabeceras de caché.

### 2. Despliegue del Backend (Railway / Render / Fly.io / Docker)
El backend incluye un [`backend/Dockerfile`](file:///home/snowy/Proyectos/QR-generator/backend/Dockerfile) listo para producción con las librerías de sistema necesarias:
1. En **Railway** o **Render**, crea un nuevo servicio apuntando a la carpeta `backend` o al `Dockerfile`.
2. Asigna el comando de inicio o deja que Docker ejecute:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
3. Copia la URL pública generada y colócala en `VITE_API_URL` en tu proyecto de Vercel.
