import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonParamVariants = cva(
  `
  inline-flex
  items-center
  justify-center

  border-0
  bg-transparent

  font-semibold
  whitespace-nowrap

  cursor-pointer
  outline-none
  select-none

  transition-[transform,color,text-shadow]
  duration-200
  ease-out

  disabled:pointer-events-none
  disabled:opacity-50

  [&_svg]:pointer-events-none
  [&_svg]:shrink-0
  `,
  {
    variants: {
      variant: {
        default: `
          text-zinc-300

          hover:scale-105
          hover:text-white
          hover:[text-shadow:0_0_12px_rgba(255,255,255,0.5)]

          active:scale-100
          active:text-zinc-200

          focus-visible:text-white
          focus-visible:[text-shadow:0_0_12px_rgba(255,255,255,0.5)]
        `,

        subtle: `
          text-zinc-500

          hover:scale-105
          hover:text-zinc-200
          hover:[text-shadow:0_0_10px_rgba(255,255,255,0.3)]

          active:scale-100
          active:text-zinc-400
        `,

        destructive: `
          text-red-400

          hover:scale-105
          hover:text-red-300
          hover:[text-shadow:0_0_12px_rgba(248,113,113,0.45)]

          active:scale-100
          active:text-red-500
        `,
      },

      size: {
        sm: "px-2 py-1 text-[16px]",
        default: "px-3 py-2 text-[20px]",
        lg: "px-4 py-2 text-[24px]",
        icon: "p-2",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function ButtonParam({
  className,
  variant = "default",
  size = "default",
  style,
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button-param"
      className={cn(
        buttonParamVariants({
          variant,
          size,
        }),
        className
      )}
      style={{
        transition: "color 0.2s ease, text-shadow 0.2s ease, transform 0.2s ease",
        ...style,
      }}
      {...props}
    />
  )
}

export { ButtonParam, buttonParamVariants }