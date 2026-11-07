import React, { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { QRState, QRPreviewResponse } from "@/types/qr"
import { Download, Copy, Check, Loader2, Sparkles, AlertCircle, Info } from "lucide-react"

interface QRPreviewCardProps {
  state: QRState
  preview: QRPreviewResponse | null
  isLoading: boolean
  error: string | null
  onDownload: () => void
  onChangeFormat: (format: QRState["format"]) => void
}

const FORMAT_OPTIONS: { id: QRState["format"]; label: string; desc: string }[] = [
  { id: "png", label: "PNG", desc: "Ráster / Con Logo" },
  { id: "svg", label: "SVG", desc: "Vectorial" },
]

export const QRPreviewCard: React.FC<QRPreviewCardProps> = ({
  state,
  preview,
  isLoading,
  error,
  onDownload,
  onChangeFormat,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!preview?.image_base64) return
    try {
      const res = await fetch(preview.image_base64)
      const blob = await res.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <Card className="border border-slate-200/80 dark:border-neutral-800 shadow-lg shadow-slate-200/40 dark:shadow-none overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl transition-colors">
      {/* macOS Window Header */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50/90 border-b border-slate-100 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 border border-rose-500/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 border border-amber-500/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 border border-emerald-500/20" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-400">
          <span className="tracking-wider">PREVIEW</span>
          {preview && (
            <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200/90 text-slate-700 shadow-2xs text-[10px]">
              {preview.width} × {preview.height} px
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-6 flex flex-col items-center">
        {/* QR Display Canvas */}
        <div className="relative w-full aspect-square max-w-[320px] rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/60 dark:border-neutral-800 p-5 flex items-center justify-center shadow-inner overflow-hidden transition-colors">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/85 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2 transition-all">
              <Loader2 className="w-7 h-7 text-slate-700 dark:text-neutral-200 animate-spin" />
              <span className="text-xs text-slate-600 dark:text-neutral-300 font-medium">Actualizando...</span>
            </div>
          )}

          {error ? (
            <div className="text-center p-4 text-rose-500 dark:text-rose-400 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8" />
              <p className="text-xs font-medium">{error}</p>
            </div>
          ) : preview?.image_base64 ? (
            <img
              src={preview.image_base64}
              alt="QR Code"
              className="w-full h-full max-h-full max-w-full object-contain rounded-lg shadow-sm"
            />
          ) : (
            <div className="text-center text-slate-400 dark:text-neutral-500 text-sm">
              Generando código...
            </div>
          )}
        </div>

        {/* Format Selector with Sliding Pill */}
        <div className="w-full mt-5 space-y-3">
          <div className="relative grid grid-cols-2 w-full bg-slate-100/90 dark:bg-neutral-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-neutral-700/60 transition-colors">
            {FORMAT_OPTIONS.map((opt) => {
              const isActive = state.format === opt.id
              const isDisabled = opt.id === "svg" && !!state.logoFile

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onChangeFormat(opt.id)}
                  className={`relative z-10 flex flex-col items-center justify-center py-2 px-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer select-none ${
                    isDisabled ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                >
                  {/* Sliding Pill Indicator */}
                  {isActive && !isDisabled && (
                    <motion.div
                      layoutId="formatPill"
                      className="absolute inset-0 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-slate-200/60 dark:border-neutral-700"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 34,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 font-bold transition-colors ${
                      isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={`relative z-10 text-[10px] font-normal transition-colors ${
                      isActive ? "text-slate-500 dark:text-neutral-400" : "text-slate-400 dark:text-neutral-500"
                    }`}
                  >
                    {opt.desc}
                  </span>
                </button>
              )
            })}
          </div>

          {state.logoFile && state.format === "svg" && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Con logotipo central se genera en formato raster PNG de alta calidad.</span>
            </p>
          )}

          {/* Action Buttons: Clean & Modern */}
          <div className="grid grid-cols-5 gap-2 pt-1">
            <Button
              className="col-span-4 h-11 text-sm font-semibold flex items-center justify-center gap-2"
              onClick={onDownload}
              disabled={isLoading || !preview}
            >
              <Download className="w-4 h-4" />
              <span>Descargar {state.format.toUpperCase()}</span>
            </Button>

            <Button
              variant="outline"
              className="col-span-1 h-11 border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-neutral-800"
              onClick={handleCopy}
              disabled={!preview?.image_base64}
              title="Copiar imagen al portapapeles"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-600 dark:text-neutral-300" />}
            </Button>
          </div>

          <p className="text-[11px] text-center text-slate-400 dark:text-neutral-500 pt-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-slate-400 dark:text-neutral-500" />
            <span>Generación 100% libre, local y sin marcas de agua</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
