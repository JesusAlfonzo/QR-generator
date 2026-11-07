import React, { useRef } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import type { QRState } from "@/types/qr"
import { Image as ImageIcon, UploadCloud, Trash2, CheckCircle2 } from "lucide-react"

interface LogoUploadProps {
  state: QRState
  onChange: (updates: Partial<QRState>) => void
}

export const LogoUpload: React.FC<LogoUploadProps> = ({ state, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onChange({
        logoFile: file,
        logoPreviewUrl: url,
        errorCorrection: "H", // Default to H for maximum legibility with logos
      })
    }
  }

  const handleRemoveLogo = () => {
    if (state.logoPreviewUrl) {
      URL.revokeObjectURL(state.logoPreviewUrl)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onChange({
      logoFile: null,
      logoPreviewUrl: null,
    })
  }

  const isSvg = state.logoFile?.name.toLowerCase().endsWith(".svg") || state.logoFile?.type === "image/svg+xml"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-neutral-200">
          <ImageIcon className="w-4 h-4 text-slate-600 dark:text-neutral-400" />
          <span>Logotipo Central (Opcional)</span>
        </div>
        {state.logoFile && (
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
            <CheckCircle2 className="w-3 h-3" />
            {isSvg ? "SVG Vectorial" : "Imagen Raster"}
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        onClick={(e) => {
          // Reset value on click so selecting the same file triggers onChange
          ;(e.target as HTMLInputElement).value = ""
        }}
        accept="image/png, image/jpeg, image/webp, image/svg+xml, .svg"
        className="hidden"
      />

      {!state.logoFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-slate-400 dark:border-neutral-800 dark:hover:border-neutral-600 bg-slate-50/50 hover:bg-slate-50 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/70 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="p-3 bg-white dark:bg-neutral-800 rounded-full shadow-sm text-slate-600 dark:text-neutral-300 border border-slate-100 dark:border-neutral-700 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-neutral-200">Sube una imagen o logo (SVG, PNG, WebP)</p>
            <p className="text-xs text-slate-400 dark:text-neutral-500">Soporta vectores SVG y transparencias con recorte automático</p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-50/80 dark:bg-neutral-900/60 rounded-2xl border border-slate-200/60 dark:border-neutral-800 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                title="Haz clic para cambiar el archivo"
                className="w-14 h-14 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-1.5 flex items-center justify-center overflow-hidden shadow-sm cursor-pointer hover:border-slate-400 dark:hover:border-neutral-600 transition-colors shrink-0"
              >
                <img
                  src={state.logoPreviewUrl!}
                  alt="Logo preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="truncate max-w-[170px] sm:max-w-[220px]">
                <p className="text-sm font-medium text-slate-900 dark:text-neutral-100 truncate">
                  {state.logoFile.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  {(state.logoFile.size / 1024).toFixed(1)} KB • {isSvg ? "Vector SVG" : state.logoFile.type}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveLogo}
              className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Quitar
            </Button>
          </div>

          {/* Logo Scale Slider */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-xs text-slate-600 dark:text-neutral-300">
                Escala del logotipo ({Math.round(state.logoScale * 100)}%)
              </Label>
              <span className="text-xs font-mono text-slate-500 dark:text-neutral-400">
                1 / {Math.round(1 / state.logoScale)}
              </span>
            </div>
            <Slider
              min={0.10}
              max={0.35}
              step={0.01}
              value={[state.logoScale]}
              onValueChange={([val]) => onChange({ logoScale: val })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
