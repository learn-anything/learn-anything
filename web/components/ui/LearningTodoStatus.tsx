"use client"

import * as React from "react"
import { Button } from "./button"
import { PieChartIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const LearningTodoStatus = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		statusOptions: Array<{
			text: string
			icon: React.ReactElement
			color: string
		}>
		selectedStatus: string | null
		setSelectedStatus: (status: string) => void
	}
>(({ className, statusOptions, selectedStatus, setSelectedStatus, ...props }, ref) => {
	const [showStatusOptions, setShowStatusOptions] = React.useState(false)

	return (
		<div ref={ref} className={cn("relative", className)} {...props}>
			<Button
				size="icon"
				type="button"
				variant="ghost"
				className="size-7 gap-x-2 text-sm"
				onClick={() => setShowStatusOptions(!showStatusOptions)}
			>
				{selectedStatus ? (
					(() => {
						const option = statusOptions.find(opt => opt.text === selectedStatus)
						return option
							? React.cloneElement(option.icon, {
									size: 16,
									className: option.color
								})
							: null
					})()
				) : (
					<PieChartIcon size={16} className="text-primary/60" />
				)}
			</Button>
			{showStatusOptions && (
				<div className="absolute right-0 mt-1 w-40 rounded-md bg-neutral-800 shadow-lg">
					{statusOptions.map(option => (
						<Button
							key={option.text}
							onClick={() => {
								setSelectedStatus(option.text)
								setShowStatusOptions(false)
							}}
							className={`flex w-full items-center justify-start space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-700 ${option.color} bg-inherit`}
						>
							{React.cloneElement(option.icon, {
								size: 16,
								className: option.color
							})}
							<span>{option.text}</span>
						</Button>
					))}
				</div>
			)}
		</div>
	)
})
LearningTodoStatus.displayName = "LearningTodo"

export { LearningTodoStatus }
