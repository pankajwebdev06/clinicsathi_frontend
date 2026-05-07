"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// ------------------------------------------
// Sheet Context
// ------------------------------------------
interface SheetContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined)

function useSheet() {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error("Sheet components must be used within a Sheet")
  }
  return context
}

// ------------------------------------------
// Sheet Components
// ------------------------------------------
interface SheetProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Sheet({ open: controlledOpen, defaultOpen, onOpenChange, children }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen || false)
  
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback((value: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(value)
    }
    onOpenChange?.(value)
  }, [isControlled, onOpenChange])

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

// ------------------------------------------
// Sheet Trigger
// ------------------------------------------
interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = useSheet()
    
    return (
      <button
        ref={ref}
        onClick={(e) => {
          setOpen(true)
          onClick?.(e)
        }}
        {...props}
      />
    )
  }
)
SheetTrigger.displayName = "SheetTrigger"

// ------------------------------------------
// Sheet Close
// ------------------------------------------
interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ onClick, ...props }, ref) => {
    const { setOpen } = useSheet()
    
    return (
      <button
        ref={ref}
        onClick={(e) => {
          setOpen(false)
          onClick?.(e)
        }}
        {...props}
      />
    )
  }
)
SheetClose.displayName = "SheetClose"

// ------------------------------------------
// Sheet Content
// ------------------------------------------
interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right"
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, side = "right", ...props }, ref) => {
    const { open, setOpen } = useSheet()
    const contentRef = React.useRef<HTMLDivElement>(null)

    // Close on escape key
    React.useEffect(() => {
      function handleEscape(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener("keydown", handleEscape)
        document.body.style.overflow = "hidden"
      }

      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = ""
      }
    }, [open, setOpen])

    if (!open) return null

    const sideClasses = {
      top: "inset-x-0 top-0 h-auto border-b",
      bottom: "inset-x-0 bottom-0 h-auto border-t",
      left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
      right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    }

    return (
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={() => setOpen(false)}
        />
        
        {/* Content */}
        <div
          ref={(el) => {
            // Handle both forwarded ref and local ref
            if (typeof ref === "function") {
              ref(el)
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
            }
            (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = el
          }}
          className={cn(
            "fixed bg-white shadow-lg transition-transform duration-300 ease-out",
            sideClasses[side],
            className
          )}
          {...props}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          
          {children}
        </div>
      </div>
    )
  }
)
SheetContent.displayName = "SheetContent"

// ------------------------------------------
// Sheet Header
// ------------------------------------------
const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left p-6",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

// ------------------------------------------
// Sheet Footer
// ------------------------------------------
const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

// ------------------------------------------
// Sheet Title
// ------------------------------------------
const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-slate-900", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

// ------------------------------------------
// Sheet Description
// ------------------------------------------
const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
))
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
