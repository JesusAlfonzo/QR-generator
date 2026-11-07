import React from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Lock, AlertTriangle, FileCode2, ExternalLink, X, Scale } from "lucide-react"

interface PolicyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideCloseButton className="p-0 overflow-hidden rounded-2xl max-w-lg w-[calc(100%-2rem)] max-h-[90vh] flex flex-col border border-slate-200/90 dark:border-neutral-800 shadow-2xl bg-white dark:bg-neutral-900 transition-colors">
        {/* macOS Window Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50/95 border-b border-slate-200/80 select-none shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-3 h-3 rounded-full bg-rose-400 hover:bg-rose-500 border border-rose-500/30 transition-colors cursor-pointer flex items-center justify-center group"
              title="Cerrar ventana"
            >
              <X className="w-2 h-2 text-rose-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <span className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500/20" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/80 border border-emerald-500/20" />
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-400">
            <span className="tracking-wider">NORMAS & POLÍTICAS</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200/90 text-slate-700 shadow-2xs text-[10px]">
              LEGAL
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
          {/* Header Title Section */}
          <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-neutral-800">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-neutral-800 flex items-center justify-center text-white shadow-md border border-slate-700/30 dark:border-neutral-700 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Términos y Directrices de Uso
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Privacidad de datos, marco legal y exención de responsabilidad.
              </p>
            </div>
          </div>

          {/* Section 1: Privacy & Stateless Architecture (Emerald Theme) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.02] to-slate-50/90 dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-950 border border-emerald-300/70 dark:border-neutral-800 text-xs shadow-xs space-y-2">
            <div className="font-bold text-emerald-950 dark:text-neutral-100 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 dark:bg-neutral-800 dark:border-neutral-700 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm">Privacidad Total (Arquitectura Stateless)</span>
            </div>
            <p className="text-slate-600 dark:text-neutral-300 pl-1 leading-relaxed">
              Esta aplicación <strong>no posee base de datos</strong> ni almacena historiales. Las URLs, textos, contraseñas de red Wi-Fi y logotipos se procesan exclusivamente en la memoria volátil del servidor para generar la imagen solicitada y se destruyen al instante. Ningún dato es persistido, compartido ni rastreado.
            </p>
          </div>

          {/* Section 2: Restrictions & Legal Disclaimer (Amber/Orange Theme) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/[0.08] via-amber-500/[0.02] to-slate-50/90 dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-950 border border-amber-300/70 dark:border-neutral-800 text-xs shadow-xs space-y-3">
            <div className="font-bold text-amber-950 dark:text-neutral-100 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 dark:bg-neutral-800 dark:border-neutral-700 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500/20" />
              </div>
              <span className="text-sm">Restricciones y Uso Responsable</span>
            </div>

            <p className="text-slate-600 dark:text-neutral-300 pl-1 leading-relaxed">
              Esta plataforma es un instrumento técnico de propósito general concebido exclusivamente para <strong>usos lícitos, informativos, comerciales y de productividad</strong>.
            </p>

            {/* Legal Limitation of Liability Clause */}
            <div className="p-3 bg-amber-50/90 dark:bg-neutral-950 rounded-xl border border-amber-200 dark:border-neutral-800 text-amber-900 dark:text-neutral-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wide text-amber-900 dark:text-neutral-200">
                <Scale className="w-3.5 h-3.5 text-amber-700 dark:text-neutral-400 shrink-0" />
                <span>Cláusula de Exención de Responsabilidad Legal</span>
              </div>
              <p className="text-[11px] text-amber-800/90 dark:text-neutral-400 leading-relaxed">
                Conforme a las normativas vigentes sobre la provisión de software y herramientas técnicas de propósito general, los autores y operadores de este servicio <strong>quedan expresamente exentos de toda responsabilidad civil, penal o administrativa</strong> derivada del uso indebido, fraudulento o ilícito que terceros puedan realizar con los códigos generados.
              </p>
              <p className="text-[11px] text-amber-800/90 dark:text-neutral-400 leading-relaxed">
                El usuario final es el <strong>único y exclusivo responsable legal</strong> sobre el contenido, la licitud y los efectos de las URLs, mensajes o imágenes que decida codificar y distribuir.
              </p>
            </div>

            <ul className="space-y-1.5 text-slate-600 dark:text-neutral-300 pl-1 leading-relaxed pt-1">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-neutral-400 mt-1.5 shrink-0" />
                <span><strong>Prohibición de Phishing:</strong> Queda terminantemente vetado su empleo en enlaces que suplanten identidades bancarias, institucionales o engaños a usuarios.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-neutral-400 mt-1.5 shrink-0" />
                <span><strong>Software Malicioso:</strong> Prohibida la difusión o descarga encubierta de malware, ransomware o virus.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-neutral-400 mt-1.5 shrink-0" />
                <span><strong>Propiedad Intelectual:</strong> Quien incorpore logotipos debe contar con los derechos o licencias de uso pertinentes.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Open Source License (Blue Theme) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/[0.08] via-indigo-500/[0.02] to-slate-50/90 dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-950 border border-blue-200/80 dark:border-neutral-800 text-xs shadow-xs space-y-2">
            <div className="font-bold text-blue-950 dark:text-neutral-100 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 dark:bg-neutral-800 dark:border-neutral-700 flex items-center justify-center text-blue-700 dark:text-neutral-300 shrink-0">
                <FileCode2 className="w-3.5 h-3.5 text-blue-600 dark:text-neutral-300" />
              </div>
              <span className="text-sm">Licencia y Uso Libre</span>
            </div>
            <p className="text-slate-600 dark:text-neutral-300 pl-1 leading-relaxed">
              El código fuente de este proyecto es abierto. Eres dueño absoluto de los códigos QR que produzcas, los cuales puedes imprimir, comercializar o difundir libremente sin marcas de agua ni regalías.
            </p>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="px-5 py-3.5 bg-slate-50/90 dark:bg-neutral-950 border-t border-slate-200/80 dark:border-neutral-800 flex items-center justify-between gap-3 shrink-0">
          <a
            href="https://github.com/JesusAlfonzo/QR-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200 transition-colors"
          >
            <span>Repositorio GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400 dark:text-neutral-500" />
          </a>

          <Button
            onClick={() => onOpenChange(false)}
            size="sm"
            className="h-9 px-5 rounded-xl font-semibold text-xs shadow-sm"
          >
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
