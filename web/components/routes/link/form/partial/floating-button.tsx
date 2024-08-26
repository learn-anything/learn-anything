import React, { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import { Button, ButtonProps } from "@/components/ui/button"

interface FloatingButtonProps extends ButtonProps {
	isOpen: boolean
}

export const FloatingButton = forwardRef<HTMLButtonElement, FloatingButtonProps>(
	({ isOpen, className, ...props }, ref) => (
		<Button
			ref={ref}
			className={cn(
				"absolute bottom-4 right-4 h-12 w-12 rounded-full bg-[#274079] p-0 text-white transition-transform hover:bg-[#274079]/90",
				{ "rotate-45 transform": isOpen },
				className
			)}
			{...props}
		>
			<LaIcon name="Plus" className="h-6 w-6" />
		</Button>
	)
)

FloatingButton.displayName = "FloatingButton"

export default FloatingButton
