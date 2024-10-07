import React from "react"
import { cn } from "@/lib/utils"

interface ColumnWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: { [key: string]: string }
}

interface ColumnTextProps extends React.HTMLAttributes<HTMLSpanElement> {}

const ColumnWrapper = React.forwardRef<HTMLDivElement, ColumnWrapperProps>(
  ({ children, className, style, ...props }, ref) => (
    <div
      className={cn("flex grow flex-row items-center justify-start", className)}
      style={{
        width: "var(--width)",
        minWidth: "var(--min-width, min-content)",
        maxWidth: "min(var(--width), var(--max-width))",
        flexBasis: "var(--width)",
        ...style,
      }}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
)

ColumnWrapper.displayName = "ColumnWrapper"

const ColumnText = React.forwardRef<HTMLSpanElement, ColumnTextProps>(
  ({ children, className, ...props }, ref) => (
    <span className={cn("text-left text-xs", className)} ref={ref} {...props}>
      {children}
    </span>
  ),
)

ColumnText.displayName = "ColumnText"

export const Column = {
  Wrapper: ColumnWrapper,
  Text: ColumnText,
}
