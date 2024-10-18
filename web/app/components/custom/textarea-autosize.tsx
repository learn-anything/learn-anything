import * as React from "react"
import BaseTextareaAutosize from "react-textarea-autosize"
import { TextareaAutosizeProps as BaseTextareaAutosizeProps } from "react-textarea-autosize"
import { cn } from "@/lib/utils"

export interface TextareaProps extends Omit<BaseTextareaAutosizeProps, "ref"> {}

const TextareaAutosize = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseTextareaAutosize
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)

TextareaAutosize.displayName = "TextareaAutosize"

export { TextareaAutosize }
