import type { QRState, QRPreviewResponse } from "@/types/qr"

const BASE_URL = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, "") : ""
const API_BASE = `${BASE_URL}/api/v1/qr`

export function resolveQRData(state: QRState): string {
  switch (state.dataType) {
    case "url":
      return state.url.trim() || "https://ejemplo.com"
    case "text":
      return state.text.trim() || "Hola Mundo"
    case "wifi": {
      const { ssid, password, encryption, hidden } = state.wifi
      return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? "true" : "false"};;`
    }
    default:
      return "https://ejemplo.com"
  }
}

function createFormData(state: QRState): FormData {
  const formData = new FormData()
  formData.append("data", resolveQRData(state))
  formData.append("fill_color", state.fillColor)
  formData.append("back_color", state.backColor)
  formData.append("box_size", state.boxSize.toString())
  formData.append("border", state.border.toString())
  formData.append("error_correction", state.errorCorrection)
  formData.append("logo_scale", state.logoScale.toString())
  formData.append("format", state.format)

  if (state.logoFile) {
    formData.append("logo", state.logoFile)
  }

  return formData
}

export async function fetchQRPreview(state: QRState): Promise<QRPreviewResponse> {
  const formData = createFormData(state)
  const response = await fetch(`${API_BASE}/preview`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Error al generar el QR" }))
    throw new Error(errorData.detail || "Error al procesar la solicitud")
  }

  return response.json()
}

export async function downloadQRCode(state: QRState): Promise<void> {
  const formData = createFormData(state)
  const response = await fetch(`${API_BASE}/download`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Error al descargar el código QR")
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `qr-code.${state.format}`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
