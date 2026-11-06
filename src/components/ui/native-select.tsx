import * as React from "react"
import { cn } from "@/lib/utils"


interface NativeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  error?: boolean
}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full items-center",
            "rounded-[10px] border border-border bg-background",
            "px-3 py-2 text-sm text-foreground",
            "shadow-[0_1px_2px_0_rgb(0_0_0/0.04)]",
            "cursor-pointer",
            "transition duration-200 ease-out",
            "[@media(hover:hover)_and_(pointer:fine)]:hover:border-foreground/30",
            "focus:outline-none focus:border-foreground focus:shadow-[0_0_0_3px_rgb(0_0_0/0.06)]",
            "disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-70",
            "[&>option]:bg-background [&>option]:text-foreground",
            error && [
              "border-destructive",
              "focus:border-destructive focus:shadow-[0_0_0_3px_hsl(var(--destructive)/0.12)]",
            ],
            className
          )}
          {...props}
        >
          {children}
        </select>

      </div>
    )
  }
)
NativeSelect.displayName = "NativeSelect"

export { NativeSelect }
export type { NativeSelectProps }
