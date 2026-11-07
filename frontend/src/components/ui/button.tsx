import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]"

    const variants = {
      default:
        "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white hover:from-slate-800 hover:to-slate-700 shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-slate-900/20 border border-slate-700/30 dark:from-white dark:via-neutral-100 dark:to-white dark:text-neutral-950 dark:hover:from-neutral-100 dark:hover:to-neutral-200 dark:border-neutral-200/40 dark:shadow-sm",
      primary:
        "bg-gradient-to-r from-neutral-900 to-neutral-800 text-white hover:from-neutral-800 hover:to-neutral-700 shadow-md dark:from-white dark:to-neutral-100 dark:text-neutral-950 dark:hover:from-neutral-100 dark:hover:to-neutral-200",
      destructive:
        "bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-600/20 dark:bg-rose-600 dark:hover:bg-rose-700",
      outline:
        "border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:border-neutral-700",
      secondary:
        "bg-slate-100/90 text-slate-800 hover:bg-slate-200/90 border border-slate-200/60 shadow-none dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-700",
      ghost:
        "hover:bg-slate-100 text-slate-700 shadow-none dark:hover:bg-neutral-800 dark:text-neutral-300 dark:hover:text-white",
      link:
        "text-slate-900 underline-offset-4 hover:underline shadow-none dark:text-neutral-100",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-11 rounded-xl px-6 text-sm",
      icon: "h-10 w-10 p-0",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
