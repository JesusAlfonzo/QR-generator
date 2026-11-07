export type ErrorCorrection = 'L' | 'M' | 'Q' | 'H'
export type QRFormat = 'png' | 'svg'

export interface QRState {
  // Content
  dataType: 'url' | 'text' | 'wifi'
  url: string
  text: string
  wifi: {
    ssid: string
    password: string
    encryption: 'WPA' | 'WEP' | 'nopass'
    hidden: boolean
  }

  // Visual Customization
  fillColor: string
  backColor: string
  boxSize: number
  border: number
  errorCorrection: ErrorCorrection
  logoScale: number
  format: QRFormat
  logoFile: File | null
  logoPreviewUrl: string | null
}

export interface QRPreviewResponse {
  image_base64: string
  mime_type: string
  width: number
  height: number
}
