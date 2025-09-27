import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, variant = "default", ...props }: 
  React.ComponentProps<"input"> & { variant?: "default" | "underline" }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        variant === "default" &&
          "rounded-md border border-input shadow-xs focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[2px]",
        variant === "underline" &&
          "rounded-none border-x-0 border-t-0 border-b border-input shadow-none focus-visible:ring-0 focus:border-b-2 focus:border-primary",
        className
      )}
      {...props}
    />
  )
}


export { Input }
