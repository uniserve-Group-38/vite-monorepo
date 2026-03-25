import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center border-2 border-black px-3 py-1 text-xs font-black w-fit whitespace-normal [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase leading-tight",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a&]:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
        destructive:
          "bg-destructive text-white [a&]:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
        outline:
          "bg-background text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
