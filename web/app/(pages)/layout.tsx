"use client"

import { Sidebar } from "@/components/custom/sidebar/sidebar"
import { PublicHomeRoute } from "@/components/routes/PublicHomeRoute"
import { CommandPalette } from "@/components/ui/CommandPalette"
import { useAccountOrGuest } from "@/lib/providers/jazz-provider"
import { usePathname } from "next/navigation"

export default function PageLayout({ children }: { children: React.ReactNode }) {
	const { me } = useAccountOrGuest()
	const pathname = usePathname()

	if (me._type === "Anonymous" && pathname === "/") {
		return <PublicHomeRoute />
	}

	return (
		<div className="flex h-full min-h-full w-full flex-row items-stretch overflow-hidden">
			<Sidebar />
			<CommandPalette />

			<div className="flex min-w-0 flex-1 flex-col">
				<main className="relative flex flex-auto flex-col place-items-stretch overflow-auto lg:my-2 lg:mr-2 lg:rounded-md lg:border">
					{children}
				</main>
			</div>
		</div>
	)
}
