"use client"

import { Sidebar } from "@/components/custom/sidebar/sidebar"
import { CommandPalette } from "@/components/custom/command-palette/command-palette"
import { useAccountOrGuest } from "@/lib/providers/jazz-provider"
import SlidingMenu from "@/components/ui/sliding-menu"
import { LearnAnythingOnboarding } from "@/components/custom/learn-anything-onboarding"

export default function PageLayout({ children }: { children: React.ReactNode }) {
	const { me } = useAccountOrGuest()

	return (
		<div className="flex h-full min-h-full w-full flex-row items-stretch overflow-hidden">
			<Sidebar />
			<LearnAnythingOnboarding />

			{me._type !== "Anonymous" && <CommandPalette />}

			<div className="relative flex min-w-0 flex-1 flex-col">
				<SlidingMenu />
				<main className="relative flex flex-auto flex-col place-items-stretch overflow-auto lg:my-2 lg:mr-2 lg:rounded-md lg:border">
					{children}
				</main>
			</div>
		</div>
	)
}
