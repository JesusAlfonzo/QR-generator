import React from "react"
import { ExternalLink, Heart } from "lucide-react"

const CURRENT_YEAR = new Date().getFullYear()

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-neutral-400">
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="font-semibold text-slate-700 dark:text-neutral-300">QR Studio</span>
          <span className="text-slate-300 dark:text-neutral-700">•</span>
          <span>© {CURRENT_YEAR} Todos los derechos reservados.</span>
        </div>

        {/* Right: Author & Personal Website Link */}
        <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-neutral-400">
          <span>Desarrollado con</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30 shrink-0" />
          <span>por</span>
          <a
            href="https://jesusalfonzo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-white transition-colors underline decoration-slate-300 dark:decoration-neutral-700 hover:decoration-neutral-400 underline-offset-4 cursor-pointer"
          >
            <span>Jesús Alfonzo</span>
            <ExternalLink className="w-3 h-3 text-slate-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-white transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  )
}
