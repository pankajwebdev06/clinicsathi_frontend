import * as React from "react"
import { cn } from "@/lib/utils/cn"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "destructive" | "outline" }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-teal-600 text-white border-transparent",
    secondary: "bg-gray-100 text-gray-900 border-transparent",
    destructive: "bg-red-500 text-white border-transparent",
    outline: "text-foreground border-gray-200",
  }
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
