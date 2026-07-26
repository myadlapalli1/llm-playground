import * as React from "react"

import { cn } from "@/lib/utils"

function MainPrompt({
  className,
  children,
  onFocus,
  onBlur,
  darkMode = true,
  ...props
}) {
  const [focused, setFocused] = React.useState(false)

  function handleFocus(event) {
    setFocused(true)
    onFocus?.(event)
  }

  function handleBlur(event) {
    setFocused(false)
    onBlur?.(event)
  }

  return (
    <>
      <style>{`
        .main-prompt-textarea {
          scrollbar-width: none;
          scrollbar-color: rgba(161, 161, 170, 0.72) transparent;
          scrollbar-background-color: transparent
        }

        .main-prompt-textarea::-webkit-scrollbar {
          width: 0px;
          height: 0px;
          background: transparent;
          opacity: 0;
        }

        .main-prompt-textarea::-webkit-scrollbar-track {
          background: transparent;
          box-shadow: none;
        }

        .main-prompt-textarea::-webkit-scrollbar-thumb {
          background-color: rgba(161, 161, 170, 0.72);
          border: 2px solid transparent;
          border-radius: 999px;
          background-clip: padding-box;
        }

        .main-prompt-textarea::-webkit-scrollbar-thumb:hover {
          background-color: rgba(20, 20, 20, 0.9);
        }

        .main-prompt-textarea::-webkit-scrollbar-corner {
          background: transparent;
        }

        .main-prompt-textarea::placeholder {
          font-size: lg;
          opacity: 1;
        }
      `}</style>

      <div
        className="
          group
          relative
          isolate
          w-full
          min-w-0
          overflow-visible
        "
      >
        {/* Large fluid aura */}
        <div
          aria-hidden="true"
          className={cn(
            `
            pointer-events-none
            absolute
            -inset-x-10
            -inset-y-12
            -z-30
            overflow-visible

            transition-[opacity,filter,transform]
            duration-700
            ease-out
            `,
            focused
              ? `
                scale-[1.04]
                opacity-100
                blur-[34px]
                `
              : `
                scale-100
                opacity-55
                blur-[28px]
                `
          )}
        >
          {/* Main irregular aura mass */}
          <div
            className={cn(
              `
              absolute
              inset-[8%]

              mix-blend-screen
              will-change-transform
              `,
              darkMode
                ? "bg-white/35"
                : "bg-slate-950/20",
              focused
                ? "animate-prompt-blob-primary-active"
                : "animate-prompt-blob-primary-idle"
            )}
          />

          {/* Secondary stretched mass */}
          <div
            className={cn(
              `
              absolute
              left-[2%]
              top-[18%]

              h-[72%]
              w-[96%]

              mix-blend-screen
              will-change-transform
              `,
              darkMode
                ? "bg-white/20"
                : "bg-slate-950/12",
              focused
                ? "animate-prompt-blob-secondary-active"
                : "animate-prompt-blob-secondary-idle"
            )}
          />

          {/* Bright moving hotspot */}
          <div
            className={cn(
              `
              absolute
              left-[8%]
              top-[5%]

              h-[70%]
              w-[42%]

              will-change-transform
              `,
              darkMode
                ? "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.28)_38%,transparent_72%)]"
                : "bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.75)_0%,rgba(15,23,42,0.18)_38%,transparent_72%)]",
              focused
                ? "animate-prompt-hotspot-active"
                : "animate-prompt-hotspot-idle"
            )}
          />

          {/* Opposite-side faint hotspot */}
          <div
            className={cn(
              `
              absolute
              bottom-[3%]
              right-[4%]

              h-[58%]
              w-[46%]

              will-change-transform
              `,
              darkMode
                ? "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.16)_42%,transparent_74%)]"
                : "bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.45)_0%,rgba(15,23,42,0.1)_42%,transparent_74%)]",
              focused
                ? "animate-prompt-hotspot-two-active"
                : "animate-prompt-hotspot-two-idle"
            )}
          />
        </div>

        {/* Close soft glow */}
        <div
          aria-hidden="true"
          className={cn(
            `
            pointer-events-none
            absolute
            -inset-[5px]
            -z-20

            rounded-[1.65rem]
            blur-lg

            transition-all
            duration-500
            ease-out
            `,
            darkMode ? "bg-white/25" : "bg-slate-950/15",
            focused
              ? `
                scale-[1.012]
                opacity-90
                `
              : `
                scale-100
                opacity-40
                `
          )}
        />

        {/* Textarea */}
        <textarea
          data-slot="mainPrompt"
          maxLength={5000}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            `
            main-prompt-textarea

            relative
            z-10
            block

            box-border
            h-[200px]
            w-full
            max-w-full
            min-w-0

            resize-none
            appearance-none

            overflow-y-auto
            overflow-x-hidden

            rounded-[1.35rem]
            border-0

            !pl-8
            !pr-36
            !pt-6
            !pb-24

            [text-indent:0]

            text-lg
            leading-6

            outline-none
            ring-0
            ring-offset-0

            transition-[background-color,box-shadow]
            duration-500
            ease-out

            placeholder:opacity-100

            disabled:cursor-not-allowed
            disabled:opacity-50
            `,
            darkMode
              ? `
                bg-zinc-950
                text-zinc-100
                shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09),0_18px_45px_rgba(0,0,0,0.55)]
                placeholder:text-zinc-500
                hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),0_18px_45px_rgba(0,0,0,0.55)]
                `
              : `
                bg-white
                text-slate-900
                shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08),0_18px_40px_rgba(15,23,42,0.12)]
                placeholder:text-slate-400
                hover:shadow-[inset_0_0_0_1px_rgba(15,23,42,0.12),0_18px_42px_rgba(15,23,42,0.16)]
                `,
            focused &&
              (darkMode
                ? `
                  shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16),0_22px_60px_rgba(0,0,0,0.65)]
                  `
                : `
                  shadow-[inset_0_0_0_1px_rgba(15,23,42,0.14),0_22px_50px_rgba(15,23,42,0.16)]
                  `),
            className
          )}
          {...props}
        />

        {/* Embedded bottom-right button */}
        {children && (
          <div className="absolute bottom-5 right-5 z-50">
            {children}
          </div>
        )}
      </div>
    </>
  )
}

export { MainPrompt }