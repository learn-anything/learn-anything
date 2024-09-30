import type { Viewport } from "next"
import { Sidebar } from "@/components/custom/sidebar/sidebar"
import { CommandPalette } from "@/components/custom/command-palette/command-palette"
import { LearnAnythingOnboarding } from "@/components/custom/learn-anything-onboarding"
import { Shortcut } from "@/components/custom/shortcut/shortcut"
import { GlobalKeyboardHandler } from "@/components/custom/global-keyboard-handler"

export const viewport: Viewport = {
	width: "device-width, shrink-to-fit=no",
	maximumScale: 1,
	userScalable: false
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-full min-h-full w-full flex-row items-stretch overflow-hidden">
			<Sidebar />
			<LearnAnythingOnboarding />
			<GlobalKeyboardHandler />
			<CommandPalette />
			<Shortcut />

			<div className="relative flex min-w-0 flex-1 flex-col">
				<main className="relative flex flex-auto flex-col place-items-stretch overflow-auto lg:my-2 lg:mr-2 lg:rounded-md lg:border">
					{children}
				</main>
			</div>
		</div>
	)
}
