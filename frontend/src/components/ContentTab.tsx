import React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { QRState } from "@/types/qr"
import { Globe, FileText, Wifi, Eye, EyeOff } from "lucide-react"

interface ContentTabProps {
  state: QRState
  onChange: (updates: Partial<QRState>) => void
}

const TABS = [
  { id: "url", label: "Enlace URL", icon: Globe },
  { id: "text", label: "Texto", icon: FileText },
  { id: "wifi", label: "Red Wi-Fi", icon: Wifi },
] as const

type TabType = (typeof TABS)[number]["id"]

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 25 : -25,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -25 : 25,
    opacity: 0,
  }),
}

export const ContentTab: React.FC<ContentTabProps> = ({ state, onChange }) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const activeIndex = TABS.findIndex((t) => t.id === state.dataType)
  const [prevActiveIndex, setPrevActiveIndex] = React.useState(activeIndex)
  const [direction, setDirection] = React.useState(1)

  if (prevActiveIndex !== activeIndex) {
    setDirection(activeIndex >= prevActiveIndex ? 1 : -1)
    setPrevActiveIndex(activeIndex)
  }

  const handleSelectTab = (tabId: TabType) => {
    onChange({ dataType: tabId })
  }

  return (
    <div className="space-y-4">
      {/* Sliding Segmented Tab Bar */}
      <div className="relative grid grid-cols-3 w-full bg-slate-100/90 dark:bg-neutral-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-neutral-700/60 transition-colors">
        {TABS.map((tab) => {
          const isActive = state.dataType === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectTab(tab.id)}
              className="relative z-10 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg cursor-pointer select-none transition-colors duration-200"
            >
              {/* Sliding Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-slate-200/50 dark:border-neutral-700"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 34,
                  }}
                />
              )}

              {/* Icon & Label */}
              <span
                className={`relative z-10 flex items-center gap-2 transition-colors duration-200 ${
                  isActive
                    ? "text-slate-900 dark:text-white font-semibold"
                    : "text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? "scale-110 text-slate-950 dark:text-white" : "text-slate-500 dark:text-neutral-400"
                  }`}
                />
                <span>{tab.label}</span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Direction-Aware Sliding Tab Content */}
      <div className="relative overflow-hidden -mx-1.5 px-1.5 py-1">
        <AnimatePresence mode="wait" custom={direction}>
          {state.dataType === "url" && (
            <motion.div
              key="tab-url"
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 px-0.5"
            >
              <Label htmlFor="qr-url">URL de destino</Label>
              <Input
                id="qr-url"
                placeholder="https://ejemplo.com"
                value={state.url}
                onChange={(e) => onChange({ url: e.target.value })}
                autoComplete="off"
              />
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Ingresa el enlace web completo (incluyendo https://) al que redirigirá el código.
              </p>
            </motion.div>
          )}

          {state.dataType === "text" && (
            <motion.div
              key="tab-text"
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 px-0.5"
            >
              <Label htmlFor="qr-text">Texto o Mensaje</Label>
              <textarea
                id="qr-text"
                rows={3}
                className="flex w-full rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 text-sm text-slate-900 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 hover:border-slate-300 dark:hover:border-neutral-700 focus:outline-none focus:border-slate-400 dark:focus:border-neutral-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-neutral-500 transition-all resize-none shadow-sm"
                placeholder="Escribe el texto libre, nota o mensaje que deseas codificar..."
                value={state.text}
                onChange={(e) => onChange({ text: e.target.value })}
              />
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Cualquier texto plano para leer directamente desde la cámara del smartphone.
              </p>
            </motion.div>
          )}

          {state.dataType === "wifi" && (
            <motion.div
              key="tab-wifi"
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 px-0.5"
            >
              <div>
                <Label htmlFor="wifi-ssid">Nombre de la Red (SSID)</Label>
                <Input
                  id="wifi-ssid"
                  placeholder="MiRedWiFi"
                  value={state.wifi.ssid}
                  onChange={(e) =>
                    onChange({
                      wifi: { ...state.wifi, ssid: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="wifi-password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="wifi-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña del router"
                    value={state.wifi.password}
                    onChange={(e) =>
                      onChange({
                        wifi: { ...state.wifi, password: e.target.value },
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <Label className="block mb-1.5">Seguridad</Label>
                  <select
                    className="w-full h-10 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 text-sm text-slate-900 dark:text-neutral-100 shadow-sm hover:border-slate-300 dark:hover:border-neutral-700 focus:outline-none focus:border-slate-400 dark:focus:border-neutral-500 focus:ring-1 focus:ring-slate-400 dark:focus:ring-neutral-500 cursor-pointer transition-all"
                    value={state.wifi.encryption}
                    onChange={(e) =>
                      onChange({
                        wifi: {
                          ...state.wifi,
                          encryption: e.target.value as any,
                        },
                      })
                    }
                  >
                    <option value="WPA" className="dark:bg-neutral-900 dark:text-neutral-100">WPA / WPA2 / WPA3</option>
                    <option value="WEP" className="dark:bg-neutral-900 dark:text-neutral-100">WEP</option>
                    <option value="nopass" className="dark:bg-neutral-900 dark:text-neutral-100">Sin Contraseña</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="wifi-hidden"
                    type="checkbox"
                    checked={state.wifi.hidden}
                    onChange={(e) =>
                      onChange({
                        wifi: { ...state.wifi, hidden: e.target.checked },
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 dark:border-neutral-700 text-slate-900 dark:text-white focus:ring-slate-900 dark:focus:ring-neutral-400 dark:bg-neutral-800 cursor-pointer transition-transform active:scale-95"
                  />
                  <Label htmlFor="wifi-hidden" className="cursor-pointer text-xs select-none">
                    Red Oculta
                  </Label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
