import * as React from "react"
import { cn } from "@/lib/utils"

export type PopoverWrapperProps = React.HTMLProps<HTMLDivElement>

export const PopoverWrapper = React.forwardRef<HTMLDivElement, PopoverWrapperProps>(
	({ children, className, ...props }, ref) => {
		return (
			<div
				className={cn("bg-popover text-popover-foreground rounded-lg border shadow-sm", className)}
				{...props}
				ref={ref}
			>
				{children}
			</div>
		)
	}
)

PopoverWrapper.displayName = "PopoverWrapper"
