import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  `
  group/button

  inline-flex
  shrink-0
  items-center
  justify-center

  border

  font-['Cormorant_Garamond']
  font-semibold
  tracking-wide
  whitespace-nowrap

  cursor-pointer
  outline-none
  select-none

  transition-[transform,background-color,color,border-color,box-shadow]
  duration-200
  ease-out

  hover:translate-y-0.5

  active:translate-y-1
  active:scale-[0.98]

  focus-visible:ring-2
  focus-visible:ring-offset-2

  disabled:pointer-events-none
  disabled:opacity-40
  disabled:hover:translate-y-0
  disabled:hover:scale-100

  [&_svg]:pointer-events-none
  [&_svg]:shrink-0
  [&_svg:not([class*='size-'])]:size-4
  `,
  {
    variants: {
      variant: {
        default: "",

        outline: "",

        secondary: "",

        ghost: `
          border-transparent
          bg-transparent
          shadow-none
        `,

        destructive: `
          border-red-400/30
          bg-red-500/10
          text-red-300

          hover:border-red-400/50
          hover:bg-red-500/15
          hover:text-red-200
        `,

        link: `
          min-w-0
          border-transparent
          bg-transparent
          p-0

          underline-offset-4
          shadow-none

          hover:underline
        `,
      },

      size: {
        default: `
          min-w-[140px]
          h-11

          gap-2

          rounded-xl

          px-12
          py-2

          text-[18px]
        `,

        xs: `
          min-w-[86px]
          h-8

          gap-1

          rounded-lg

          px-6
          py-1

          text-[14px]

          [&_svg:not([class*='size-'])]:size-3
        `,

        sm: `
          min-w-[110px]
          h-10

          gap-1.5

          rounded-xl

          px-9
          py-1.5

          text-[16px]
        `,

        lg: `
          min-w-[160px]
          h-12

          gap-2

          rounded-xl

          px-14
          py-2.5

          text-[20px]
        `,

        sqr: `
          size-11
          min-w-0

          rounded-xl

          p-0

          text-[20px]
        `,

        icon: `
          size-10
          min-w-0

          rounded-xl

          p-0
        `,

        "icon-xs": `
          size-8
          min-w-0

          rounded-lg

          p-0

          [&_svg:not([class*='size-'])]:size-3
        `,

        "icon-sm": `
          size-9
          min-w-0

          rounded-xl

          p-0
        `,

        "icon-lg": `
          size-12
          min-w-0

          rounded-xl

          p-0
        `,
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  selected = false,
  darkMode = true,
  children,
  style,
  ...props
}) {
  return (
    <>
      <style>{`
        @keyframes selectedGlowDark {
          0%,
          100% {
            box-shadow:
              0 0 0 1px rgba(255,255,255,0.22),
              0 5px 16px rgba(0,0,0,0.28),
              0 0 10px rgba(255,255,255,0.11);
          }

          50% {
            box-shadow:
              0 0 0 1px rgba(255,255,255,0.34),
              0 6px 19px rgba(0,0,0,0.32),
              0 0 15px rgba(255,255,255,0.2);
          }
        }

        @keyframes selectedGlowLight {
          0%,
          100% {
            box-shadow:
              0 0 0 1px rgba(15,23,42,0.2),
              0 5px 16px rgba(15,23,42,0.16),
              0 0 9px rgba(15,23,42,0.1);
          }

          50% {
            box-shadow:
              0 0 0 1px rgba(15,23,42,0.3),
              0 6px 19px rgba(15,23,42,0.2),
              0 0 14px rgba(15,23,42,0.18);
          }
        }
      `}</style>

      <ButtonPrimitive
        data-slot="button"
        data-selected={selected}
        aria-pressed={selected}
        className={cn(
          buttonVariants({
            variant,
            size,
          }),

          // Dark mode — unselected
          !selected &&
            darkMode &&
            variant === "default" &&
            `
            border-zinc-500/45
            bg-zinc-950
            text-zinc-200

            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.015),0_4px_16px_rgba(0,0,0,0.18)]

            hover:border-zinc-400/70
            hover:bg-zinc-800
            hover:text-white

            hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025),0_7px_22px_rgba(0,0,0,0.28)]

            focus-visible:ring-zinc-400/35
            focus-visible:ring-offset-[#15161c]
          `,

          // Light mode — unselected
          !selected &&
            !darkMode &&
            variant === "default" &&
            `
            border-zinc-400/50
            bg-white
            text-slate-800

            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),0_4px_16px_rgba(15,23,42,0.07)]

            hover:border-zinc-500/70
            hover:bg-zinc-100
            hover:text-slate-950

            hover:shadow-[0_7px_22px_rgba(15,23,42,0.12)]

            focus-visible:ring-zinc-500/30
            focus-visible:ring-offset-zinc-100
          `,

          // Dark mode — selected
          selected &&
            darkMode &&
            `
            !border-zinc-100
            !bg-zinc-100
            !text-zinc-950

            ring-1
            ring-white/50
            ring-offset-2
            ring-offset-[#15161c]

            animate-[selectedGlowDark_1.8s_ease-in-out_infinite]

            hover:!border-white
            hover:!bg-white
            hover:!text-black

            focus-visible:ring-white/70
          `,

          // Light mode — selected
          selected &&
            !darkMode &&
            `
            !border-zinc-950
            !bg-zinc-950
            !text-white

            ring-1
            ring-zinc-950/45
            ring-offset-2
            ring-offset-zinc-100

            animate-[selectedGlowLight_1.8s_ease-in-out_infinite]

            hover:!border-black
            hover:!bg-black
            hover:!text-white

            focus-visible:ring-zinc-950/60
          `,

          // Outline — dark mode
          !selected &&
            variant === "outline" &&
            darkMode &&
            `
            border-zinc-500/45
            bg-transparent
            text-zinc-300

            shadow-none

            hover:border-zinc-300/70
            hover:bg-white/5
            hover:text-white
          `,

          // Outline — light mode
          !selected &&
            variant === "outline" &&
            !darkMode &&
            `
            border-zinc-400/50
            bg-transparent
            text-zinc-700

            shadow-none

            hover:border-zinc-600/60
            hover:bg-zinc-900/5
            hover:text-zinc-950
          `,

          // Ghost — dark mode
          !selected &&
            variant === "ghost" &&
            darkMode &&
            `
            text-zinc-300

            hover:bg-white/7
            hover:text-white
          `,

          // Ghost — light mode
          !selected &&
            variant === "ghost" &&
            !darkMode &&
            `
            text-slate-700

            hover:bg-black/5
            hover:text-slate-950
          `,

          // Secondary — dark mode
          !selected &&
            variant === "secondary" &&
            darkMode &&
            `
            border-slate-500/30
            bg-slate-800/55
            text-zinc-200

            hover:border-slate-400/50
            hover:bg-slate-700/60
            hover:text-white
          `,

          // Secondary — light mode
          !selected &&
            variant === "secondary" &&
            !darkMode &&
            `
            border-slate-300
            bg-slate-200/70
            text-slate-800

            hover:border-slate-400
            hover:bg-slate-300/75
            hover:text-slate-950
          `,

          // Link — dark mode
          variant === "link" &&
            darkMode &&
            `
            text-zinc-300

            hover:text-white
          `,

          // Link — light mode
          variant === "link" &&
            !darkMode &&
            `
            text-slate-700

            hover:text-slate-950
          `,

          className
        )}
        style={style}
        {...props}
      >
        {children}
      </ButtonPrimitive>
    </>
  )
}

export { Button, buttonVariants }