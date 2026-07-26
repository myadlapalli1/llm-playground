import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  darkMode = true,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        `
        flex min-h-28 w-full resize-none rounded-xl

        border
        px-5 py-4
        text-sm
        leading-6

        shadow-lg

        transition-all duration-200 ease-out

        outline-none

        disabled:cursor-not-allowed
        disabled:opacity-50

        aria-invalid:border-red-500
        aria-invalid:ring-red-500/20
        `,
        darkMode
          ? `
            border-white/10
            bg-zinc-950/80
            text-zinc-100
            shadow-white/15
            placeholder:text-zinc-500
            hover:border-white/20
            focus-visible:border-zinc-400
            focus-visible:bg-zinc-950
            focus-visible:ring-4
            focus-visible:ring-white/10
            `
          : `
            border-slate-200
            bg-white
            text-slate-900
            shadow-slate-200/70
            placeholder:text-slate-400
            hover:border-slate-300
            focus-visible:border-slate-400
            focus-visible:bg-white
            focus-visible:ring-4
            focus-visible:ring-slate-200
            `,
        className
      )}
      {...props}
    />
  )
}

export { Textarea }