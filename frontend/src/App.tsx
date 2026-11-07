import { useState, useEffect, useRef } from "react"
import type { QRState, QRPreviewResponse } from "@/types/qr"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ContentTab } from "@/components/ContentTab"
import { CustomizationControls } from "@/components/CustomizationControls"
import { LogoUpload } from "@/components/LogoUpload"
import { QRPreviewCard } from "@/components/QRPreviewCard"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { fetchQRPreview, downloadQRCode } from "@/services/qrApi"
import { Lightbulb } from "lucide-react"

const INITIAL_STATE: QRState = {
  dataType: "url",
  url: "",
  text: "",
  wifi: {
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  },
  fillColor: "#000000",
  backColor: "#ffffff",
  boxSize: 10,
  border: 4,
  errorCorrection: "H",
  logoScale: 0.25,
  format: "png",
  logoFile: null,
  logoPreviewUrl: null,
}

export function App() {
  const [state, setState] = useState<QRState>(INITIAL_STATE)
  const [preview, setPreview] = useState<QRPreviewResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimeout = useRef<number | null>(null)

  const handleStateChange = (updates: Partial<QRState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  // Trigger preview fetch on state change with debounce
  useEffect(() => {
    if (debounceTimeout.current) {
      window.clearTimeout(debounceTimeout.current)
    }

    setIsLoading(true)
    setError(null)

    debounceTimeout.current = window.setTimeout(async () => {
      try {
        const result = await fetchQRPreview(state)
        setPreview(result)
      } catch (err: any) {
        setError(err.message || "Error al generar vista previa")
      } finally {
        setIsLoading(false)
      }
    }, 200)

    return () => {
      if (debounceTimeout.current) {
        window.clearTimeout(debounceTimeout.current)
      }
    }
  }, [state])

  const handleDownload = async () => {
    try {
      await downloadQRCode(state)
    } catch (err: any) {
      alert("Error al descargar el código QR: " + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0a0a0a] flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 pt-8 pb-20 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Content */}
            <Card className="overflow-hidden border border-slate-200/80 dark:border-neutral-800 shadow-xs rounded-2xl bg-white dark:bg-neutral-900">
              {/* macOS Window Header */}
              <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50/90 border-b border-slate-100 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 border border-rose-500/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 border border-amber-500/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 border border-emerald-500/20" />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-400">
                  <span className="tracking-wider">PASO</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200/90 text-slate-800 shadow-2xs font-extrabold text-[10px]">
                    01
                  </span>
                </div>
              </div>

              <CardHeader className="pt-4 pb-3">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Contenido del Código</CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-neutral-400">
                  Elige qué tipo de información quieres codificar en tu QR.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentTab state={state} onChange={handleStateChange} />
              </CardContent>
            </Card>

            {/* Step 2: Customization */}
            <Card className="overflow-hidden border border-slate-200/80 dark:border-neutral-800 shadow-xs rounded-2xl bg-white dark:bg-neutral-900">
              {/* macOS Window Header */}
              <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50/90 border-b border-slate-100 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 border border-rose-500/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 border border-amber-500/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 border border-emerald-500/20" />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-400">
                  <span className="tracking-wider">PASO</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200/90 text-slate-800 shadow-2xs font-extrabold text-[10px]">
                    02
                  </span>
                </div>
              </div>

              <CardHeader className="pt-4 pb-3">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Diseño y Estilo</CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-neutral-400">
                  Ajusta la paleta de colores, resolución y tolerancia a errores.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomizationControls state={state} onChange={handleStateChange} />
              </CardContent>
            </Card>

            {/* Step 3: Logo */}
            <Card className="overflow-hidden border border-slate-200/80 dark:border-neutral-800 shadow-xs rounded-2xl bg-white dark:bg-neutral-900">
              {/* macOS Window Header */}
              <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50/90 border-b border-slate-100 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 border border-rose-500/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 border border-amber-500/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 border border-emerald-500/20" />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-400">
                  <span className="tracking-wider">PASO</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200/90 text-slate-800 shadow-2xs font-extrabold text-[10px]">
                    03
                  </span>
                </div>
              </div>

              <CardHeader className="pt-4 pb-3">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Branding & Logotipo</CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-neutral-400">
                  Incrusta el logo de tu marca o empresa centrado en el QR sin perder legibilidad.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LogoUpload state={state} onChange={handleStateChange} />
              </CardContent>
            </Card>
          </div>

          {/* Preview & Action Column (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-5">
            <QRPreviewCard
              state={state}
              preview={preview}
              isLoading={isLoading}
              error={error}
              onDownload={handleDownload}
              onChangeFormat={(format) => handleStateChange({ format })}
            />

            {/* Information Tips: Eye-catching and static relative to preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/[0.08] via-indigo-500/[0.03] to-slate-50/90 dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-950 border border-blue-200/80 dark:border-neutral-800 text-xs shadow-xs space-y-2.5 transition-colors">
              <div className="font-bold text-blue-950 dark:text-neutral-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 dark:bg-neutral-800 dark:border-neutral-700 flex items-center justify-center text-blue-700 dark:text-neutral-200 shrink-0">
                  <Lightbulb className="w-3.5 h-3.5 text-blue-600 dark:text-neutral-200 fill-blue-500/20 dark:fill-neutral-400/20" />
                </div>
                <span className="text-sm">Consejos de Escaneo Profesional</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 dark:text-neutral-300 pl-1 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-neutral-400 mt-1.5 shrink-0" />
                  <span><strong>Alto contraste:</strong> Asegura colores oscuros sobre fondos claros para óptima detección de cámara.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-neutral-400 mt-1.5 shrink-0" />
                  <span><strong>Con Logotipo:</strong> El nivel <strong>H (30%)</strong> previene pérdidas de lectura ante el área del logo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-neutral-400 mt-1.5 shrink-0" />
                  <span><strong>Formato:</strong> Usa <strong>PNG</strong> para redes/pantallas y <strong>SVG</strong> para impresiones físicas nítidas.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
