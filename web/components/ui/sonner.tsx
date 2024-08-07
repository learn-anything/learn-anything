"use client"

import { CheckIcon, CircleXIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme()

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			expand
			position="top-right"
			duration={5000}
			icons={{
				success: <CheckIcon size={16} className="text-green-500" />,
				error: <CircleXIcon size={16} className="text-red-500" />
			}}
			toastOptions={{
				closeButton: true,
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
					closeButton:
						"group-[.toast]:hover:bg-primary-foreground group-[.toast]:absolute group-[.toast]:border-0  group-[.toast]:top-4 group-[.toast]:right-0.5 group-[.toast]:left-auto group-[.toast]:[&>svg]:size-3.5"
				}
			}}
			{...props}
		/>
	)
}

export { Toaster }
