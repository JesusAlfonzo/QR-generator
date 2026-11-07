import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Slider } from "@/components/ui/slider"
import { ColorInput } from "@/components/ColorInput"
import type { QRState, ErrorCorrection } from "@/types/qr"
import { Palette, Maximize, ShieldAlert, Sparkles, Sliders } from "lucide-react"

interface CustomizationControlsProps {
  state: QRState
  onChange: (updates: Partial<QRState>) => void
}

const PRESET_FILL_COLORS = ["#000000", "#1E293B", "#2563EB", "#059669", "#7C3AED", "#E11D48"]
const PRESET_BACK_COLORS = ["#FFFFFF", "#F8FAFC", "#FEF3C7", "#ECFDF5", "#F1F5F9"]

const SUB_TABS = [
  { id: "colors", label: "Colores", icon: Palette },
  { id: "dimensions", label: "Tamaño", icon: Maximize },
  { id: "correction", label: "Tolerancia", icon: ShieldAlert },
] as const

type SubTabId = (typeof SUB_TABS)[number]["id"]

const CORRECTION_OPTIONS: { level: ErrorCorrection; label: string; desc: string; detail: string }[] = [
  { level: "L", label: "7%", desc: "Bajo", detail: "Ideal para textos muy largos o baja resolución." },
  { level: "M", label: "15%", desc: "Medio", detail: "Estándar recomendado para códigos cotidianos." },
  { level: "Q", label: "25%", desc: "Alto", detail: "Buena resistencia a desgaste o impresiones." },
  { level: "H", label: "30%", desc: "Máximo", detail: "Obligatorio para incrustar logotipos sin fallos." },
]

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -20 : 20,
    opacity: 0,
  }),
}

export const CustomizationControls: React.FC<CustomizationControlsProps> = ({
  state,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<SubTabId>("colors")

  const activeIndex = SUB_TABS.findIndex((t) => t.id === activeTab)
  const [prevActiveIndex, setPrevActiveIndex] = useState(activeIndex)
  const [direction, setDirection] = useState(1)

  if (prevActiveIndex !== activeIndex) {
    setDirection(activeIndex >= prevActiveIndex ? 1 : -1)
    setPrevActiveIndex(activeIndex)
  }

  return (
    <div className="space-y-4">
      {/* Sub-Tab Navigation Header with Sliding Pill */}
      <div className="relative grid grid-cols-3 w-full bg-slate-100/90 dark:bg-neutral-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-neutral-700/60 transition-colors">
        {SUB_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative z-10 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-lg cursor-pointer select-none transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="customizationTabPill"
                  className="absolute inset-0 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-slate-200/50 dark:border-neutral-700"
                  transition={{ type: "spring", stiffness: 450, damping: 34 }}
                />
              )}
              <span
                className={`relative z-10 flex items-center gap-1.5 transition-colors ${
                  isActive ? "text-slate-900 dark:text-white font-bold" : "text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-neutral-400"}`} />
                <span>{tab.label}</span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Sub-Tab Content with Directional Sliding */}
      <div className="relative overflow-hidden -mx-1.5 px-1.5 py-1">
        <AnimatePresence mode="wait" custom={direction}>
          {/* TAB 1: COLORES */}
          {activeTab === "colors" && (
            <motion.div
              key="subtab-colors"
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <ColorInput
                  label="Color del QR"
                  color={state.fillColor}
                  onChange={(val) => onChange({ fillColor: val })}
                  presets={PRESET_FILL_COLORS}
                />
                <ColorInput
                  label="Color de Fondo"
                  color={state.backColor}
                  onChange={(val) => onChange({ backColor: val })}
                  presets={PRESET_BACK_COLORS}
                />
              </div>
            </motion.div>
          )}

          {/* TAB 2: DIMENSIONES */}
          {activeTab === "dimensions" && (
            <motion.div
              key="subtab-dimensions"
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 p-4 bg-slate-50/90 dark:bg-neutral-900/60 rounded-2xl border border-slate-200/60 dark:border-neutral-800 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-300">
                    <Sliders className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
                    <span>Resolución por módulo</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-slate-200 dark:border-neutral-700">
                    {state.boxSize} px ({state.boxSize * 33}px aprox)
                  </span>
                </div>
                <Slider
                  min={4}
                  max={25}
                  step={1}
                  value={[state.boxSize]}
                  onValueChange={([val]) => onChange({ boxSize: val })}
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-neutral-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-300">
                    <Maximize className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
                    <span>Margen exterior de seguridad</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-slate-200 dark:border-neutral-700">
                    {state.border} bloques
                  </span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[state.border]}
                  onValueChange={([val]) => onChange({ border: val })}
                />
              </div>
            </motion.div>
          )}

          {/* TAB 3: CORRECCIÓN DE ERROR */}
          {activeTab === "correction" && (
            <motion.div
              key="subtab-correction"
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5"
            >
              <div className="relative grid grid-cols-4 w-full bg-slate-100/90 dark:bg-neutral-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-neutral-700/60 transition-colors">
                {CORRECTION_OPTIONS.map((item) => {
                  const isActive = state.errorCorrection === item.level

                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => onChange({ errorCorrection: item.level })}
                      className="relative z-10 flex flex-col items-center justify-center py-2.5 px-2 rounded-lg cursor-pointer select-none transition-colors"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="ecSubTabPill"
                          className="absolute inset-0 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-slate-200/60 dark:border-neutral-700"
                          transition={{ type: "spring", stiffness: 450, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10 block text-center">
                        <div
                          className={`text-sm font-bold transition-colors ${
                            isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200"
                          }`}
                        >
                          {item.level}
                        </div>
                        <div
                          className={`text-[11px] transition-colors ${
                            isActive ? "text-slate-600 dark:text-neutral-300 font-medium" : "text-slate-400 dark:text-neutral-500"
                          }`}
                        >
                          {item.label}
                        </div>
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Level description detail */}
              <div className="p-3 bg-slate-50/90 dark:bg-neutral-900/60 rounded-xl border border-slate-200/60 dark:border-neutral-800 text-xs text-slate-600 dark:text-neutral-300 transition-colors">
                {CORRECTION_OPTIONS.find((c) => c.level === state.errorCorrection)?.detail}
              </div>

              {state.logoFile && state.errorCorrection !== "H" && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 pt-1">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Se recomienda usar el nivel <strong>H (30%)</strong> cuando se añade un logotipo central.</span>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
