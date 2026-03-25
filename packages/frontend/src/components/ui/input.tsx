import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-2 border-black h-10 w-full min-w-0 bg-white px-3 py-1 text-base font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus-visible:-translate-y-0.5",
        "aria-invalid:border-destructive aria-invalid:shadow-[3px_3px_0px_0px_rgba(239,68,68,1)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
