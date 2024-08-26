import * as React from "react"
import BaseTextareaAutosize from "react-textarea-autosize"
import { TextareaAutosizeProps as BaseTextareaAutosizeProps } from "react-textarea-autosize"
import { cn } from "@/lib/utils"

export interface TextareaProps extends Omit<BaseTextareaAutosizeProps, "ref"> {}

const TextareaAutosize = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, style, ...props }, ref) => {
	return (
		<BaseTextareaAutosize
			className={cn(
				"border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			ref={ref}
			{...props}
		/>
	)
})

TextareaAutosize.displayName = "TextareaAutosize"

export { TextareaAutosize }
