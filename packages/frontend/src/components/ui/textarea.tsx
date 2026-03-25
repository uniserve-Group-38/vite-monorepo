import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-2 border-black placeholder:text-muted-foreground focus-visible:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] focus-visible:-translate-y-0.5 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full bg-white px-3 py-2 text-base font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
