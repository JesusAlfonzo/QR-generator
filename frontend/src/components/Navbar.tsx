import React, { useEffect, useState, useCallback } from "react"
import { QrCode, ShieldCheck, RefreshCw, SunMedium, Moon } from "lucide-react"
import { PolicyModal } from "@/components/PolicyModal"
import { useTheme } from "@/hooks/useTheme"

type HealthStatus = "checking" | "online" | "offline"

const GITHUB_REPO_URL = "https://github.com/JesusAlfonzo/QR-generator"

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export const Navbar: React.FC = () => {
  const [status, setStatus] = useState<HealthStatus>("checking")
  const [isPolicyOpen, setIsPolicyOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const checkHealth = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const baseUrl = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, "") : ""
      const res = await fetch(`${baseUrl}/api/v1/health`, { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        if (data.status === "ok") {
          setStatus("online")
        } else {
          setStatus("offline")
        }
      } else {
        setStatus("offline")
      }
    } catch {
      setStatus("offline")
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    checkHealth()
    // Periodic check every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [checkHealth])

  const actionButtonStyles =
    "h-9 w-9 sm:w-auto sm:px-3 rounded-xl border border-slate-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 hover:bg-slate-50 dark:hover:bg-neutral-800 flex items-center justify-center gap-2 text-slate-700 dark:text-neutral-200 shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-neutral-800 transition-colors w-full">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center text-white shadow-md border border-slate-700/30 dark:border-neutral-700 shrink-0">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-slate-100" />
            </div>
            <div className="truncate">
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none truncate">
                QR Studio
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400 hidden sm:block mt-0.5 truncate">
                Generador de Códigos QR Avanzado
              </p>
            </div>
          </div>

          {/* Unified Action Navigation */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 1. Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className={actionButtonStyles}
            >
              {theme === "dark" ? (
                <SunMedium className="w-4 h-4 text-neutral-200 shrink-0 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 shrink-0 transition-transform hover:-rotate-12" />
              )}
              <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-neutral-200">
                {theme === "dark" ? "Claro" : "Oscuro"}
              </span>
            </button>

            {/* 2. Health Status Indicator Button */}
            <button
              type="button"
              onClick={checkHealth}
              disabled={isRefreshing}
              title={
                status === "online"
                  ? "Servicio Operativo (Haz clic para refrescar)"
                  : status === "offline"
                  ? "Servicio Desconectado (Haz clic para reintentar)"
                  : "Verificando conexión..."
              }
              className={actionButtonStyles}
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                {status === "online" && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    status === "online"
                      ? "bg-emerald-500"
                      : status === "offline"
                      ? "bg-rose-500"
                      : "bg-amber-500"
                  }`}
                />
              </span>
              <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-neutral-200">
                {status === "online"
                  ? "Operativo"
                  : status === "offline"
                  ? "Offline"
                  : "Conectando"}
              </span>
              {isRefreshing && (
                <RefreshCw className="w-3 h-3 animate-spin text-slate-400 shrink-0" />
              )}
            </button>

            {/* 3. Normas y Políticas Modal Button */}
            <button
              type="button"
              onClick={() => setIsPolicyOpen(true)}
              title="Normas y Políticas de Uso"
              className={actionButtonStyles}
            >
              <ShieldCheck className="w-4 h-4 text-slate-600 dark:text-neutral-300 shrink-0" />
              <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-neutral-200">
                Normas
              </span>
            </button>

            {/* 4. GitHub Repository Link */}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Ver código fuente en GitHub"
              className={actionButtonStyles}
            >
              <GithubIcon className="w-4 h-4 text-slate-800 dark:text-neutral-200 shrink-0" />
              <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-neutral-200">
                GitHub
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Policies & Guidelines Dialog */}
      <PolicyModal open={isPolicyOpen} onOpenChange={setIsPolicyOpen} />
    </>
  )
}
