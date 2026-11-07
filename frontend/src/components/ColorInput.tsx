import React, { useState } from "react"
import { motion } from "motion/react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  type ColorMode,
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hslToHex,
} from "@/lib/colors"
import { Check } from "lucide-react"

interface ColorInputProps {
  label: string
  color: string // Current HEX color (#RRGGBB)
  onChange: (hexColor: string) => void
  presets: string[]
}

const MODES: { id: ColorMode; label: string }[] = [
  { id: "hex", label: "HEX" },
  { id: "rgb", label: "RGB" },
  { id: "hsl", label: "HSL" },
]

export const ColorInput: React.FC<ColorInputProps> = ({
  label,
  color,
  onChange,
  presets,
}) => {
  const [mode, setMode] = useState<ColorMode>("hex")

  const rgb = hexToRgb(color)
  const hsl = hexToHsl(color)

  const handleRgbChange = (channel: "r" | "g" | "b", val: string) => {
    const cleanDigits = val.replace(/\D/g, "")
    const num = Math.max(0, Math.min(255, parseInt(cleanDigits, 10) || 0))
    const updated = { ...rgb, [channel]: num }
    onChange(rgbToHex(updated.r, updated.g, updated.b))
  }

  const handleHslChange = (channel: "h" | "s" | "l", val: string) => {
    const cleanDigits = val.replace(/\D/g, "")
    const max = channel === "h" ? 360 : 100
    const num = Math.max(0, Math.min(max, parseInt(cleanDigits, 10) || 0))
    const updated = { ...hsl, [channel]: num }
    onChange(hslToHex(updated.h, updated.s, updated.l))
  }

  return (
    <div className="space-y-3 p-3.5 bg-slate-50/90 dark:bg-neutral-900/60 rounded-2xl border border-slate-200/60 dark:border-neutral-800 transition-colors">
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs font-bold text-slate-800 dark:text-neutral-200">{label}</Label>

        {/* Mini Mode Switcher */}
        <div className="relative flex p-0.5 bg-slate-200/70 dark:bg-neutral-800 rounded-lg text-[10px] border border-transparent dark:border-neutral-700/60">
          {MODES.map((m) => {
            const isSelected = mode === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className="relative z-10 px-2 py-0.5 font-semibold rounded cursor-pointer select-none transition-colors"
              >
                {isSelected && (
                  <motion.div
                    layoutId={`modePill-${label}`}
                    className="absolute inset-0 bg-white dark:bg-neutral-900 rounded shadow-xs border border-slate-200/50 dark:border-neutral-700"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isSelected ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200"
                  }`}
                >
                  {m.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Input Area with Swatch */}
      <div className="flex items-center gap-2">
        {/* Interactive Swatch opens native color picker */}
        <label
          className="relative w-10 h-10 rounded-xl cursor-pointer shrink-0 transition-transform hover:scale-105 active:scale-95 shadow-xs overflow-hidden flex items-center justify-center [transform:translateZ(0)]"
          style={{
            backgroundColor: color,
            boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
          title="Abrir paleta de color del sistema"
        >
          <input
            type="color"
            value={color.startsWith("#") ? color : "#000000"}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="sr-only"
          />
        </label>

        {/* Dynamic Controls depending on mode */}
        {mode === "hex" && (
          <div className="flex-1 flex items-center bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 px-3 py-1 shadow-xs focus-within:ring-2 focus-within:ring-slate-400 dark:focus-within:ring-neutral-500 focus-within:border-transparent transition-all">
            <span className="text-xs font-mono text-slate-400 dark:text-neutral-500 select-none mr-1">#</span>
            <Input
              value={color.replace("#", "")}
              onChange={(e) => onChange(`#${e.target.value.toUpperCase()}`)}
              className="h-8 border-0 shadow-none font-mono text-xs uppercase p-0 text-slate-900 dark:text-neutral-100 focus-visible:ring-0 bg-transparent dark:bg-transparent"
              maxLength={6}
              placeholder="000000"
            />
          </div>
        )}

        {/* RGB Mode: Clean text inputs without obstructive stepper arrows */}
        {mode === "rgb" && (
          <div className="flex-1 grid grid-cols-3 gap-1.5">
            <div className="flex items-center bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 px-2 py-1 shadow-xs focus-within:ring-1 focus-within:ring-slate-400 dark:focus-within:ring-neutral-500">
              <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 mr-1 select-none">R</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={3}
                value={rgb.r}
                onChange={(e) => handleRgbChange("r", e.target.value)}
                className="w-full text-xs font-mono font-medium text-slate-900 dark:text-neutral-100 bg-transparent focus:outline-none p-0 text-right pr-0.5"
              />
            </div>
            <div className="flex items-center bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 px-2 py-1 shadow-xs focus-within:ring-1 focus-within:ring-slate-400 dark:focus-within:ring-neutral-500">
              <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 mr-1 select-none">G</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={3}
                value={rgb.g}
                onChange={(e) => handleRgbChange("g", e.target.value)}
                className="w-full text-xs font-mono font-medium text-slate-900 dark:text-neutral-100 bg-transparent focus:outline-none p-0 text-right pr-0.5"
              />
            </div>
            <div className="flex items-center bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 px-2 py-1 shadow-xs focus-within:ring-1 focus-within:ring-slate-400 dark:focus-within:ring-neutral-500">
              <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 mr-1 select-none">B</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={3}
                value={rgb.b}
                onChange={(e) => handleRgbChange("b", e.target.value)}
                className="w-full text-xs font-mono font-medium text-slate-900 dark:text-neutral-100 bg-transparent focus:outline-none p-0 text-right pr-0.5"
              />
            </div>
          </div>
        )}

        {/* HSL Mode: Clean text inputs without obstructive stepper arrows */}
        {mode === "hsl" && (
          <div className="flex-1 grid grid-cols-3 gap-1.5">
            <div className="flex items-center bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 px-2 py-1 shadow-xs focus-within:ring-1 focus-within:ring-slate-400 dark:focus-within:ring-neutral-500" title="Matiz (Hue 0-360°)">
              <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 mr-1 select-none">H</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={3}
                value={hsl.h}
                onChange={(e) => handleHslChange("h", e.target.value)}
                className="w-full text-xs font-mono font-medium text-slate-900 dark:text-neutral-100 bg-transparent focus:outline-none p-0 text-right"
              />
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 ml-0.5 select-none">°</span>
            </div>
            <div className="flex items-center bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 px-2 py-1 shadow-xs focus-within:ring-1 focus-within:ring-slate-400 dark:focus-within:ring-neutral-500" title="Saturación (0-100%)">
              <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 mr-1 select-none">S</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={3}
                value={hsl.s}
                onChange={(e) => handleHslChange("s", e.target.value)}
                className="w-full text-xs font-mono font-medium text-slate-900 dark:text-neutral-100 bg-transparent focus:outline-none p-0 text-right"
              />
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 ml-0.5 select-none">%</span>
            </div>
            <div className="flex items-center bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 px-2 py-1 shadow-xs focus-within:ring-1 focus-within:ring-slate-400 dark:focus-within:ring-neutral-500" title="Luminosidad (0-100%)">
              <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 mr-1 select-none">L</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={3}
                value={hsl.l}
                onChange={(e) => handleHslChange("l", e.target.value)}
                className="w-full text-xs font-mono font-medium text-slate-900 dark:text-neutral-100 bg-transparent focus:outline-none p-0 text-right"
              />
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 ml-0.5 select-none">%</span>
            </div>
          </div>
        )}
      </div>

      {/* Preset Swatches: Anti-aliased without jagged edges (picos de sierra) */}
      <div className="flex items-center gap-2 pt-1.5 border-t border-slate-200/60 dark:border-neutral-800">
        <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-400 mr-1 select-none">Rápidos:</span>
        <div className="flex items-center gap-2">
          {presets.map((pColor) => {
            const isSelected = color.toLowerCase() === pColor.toLowerCase()
            return (
              <button
                key={pColor}
                type="button"
                onClick={() => onChange(pColor.toUpperCase())}
                style={{
                  backgroundColor: pColor,
                  boxShadow: isSelected
                    ? "inset 0 0 0 1px rgba(0, 0, 0, 0.2)"
                    : "inset 0 0 0 1px rgba(0, 0, 0, 0.12)",
                }}
                className={`w-6 h-6 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center [transform:translateZ(0)] ${
                  isSelected
                    ? "scale-110 shadow-sm ring-2 ring-slate-400 dark:ring-neutral-400 ring-offset-2 dark:ring-offset-neutral-900"
                    : "hover:scale-110 opacity-85 hover:opacity-100 shadow-xs"
                }`}
                title={pColor}
              >
                {isSelected && (
                  <Check
                    strokeWidth={2.5}
                    className={`w-3.5 h-3.5 drop-shadow-xs ${
                      pColor === "#FFFFFF" || pColor.toLowerCase() === "#ffffff"
                        ? "text-slate-900"
                        : "text-white"
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
