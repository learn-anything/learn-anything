import { Sidebar } from "@/components/custom/sidebar/sidebar"
import PublicHomeRoute from "@/components/routes/PublicHomeRoute"
import { CommandPalette } from "@/components/ui/CommandPalette"
import { useEffect, useState } from "react"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	// TODO: get it from jazz/clerk
	const loggedIn = true

	if (loggedIn) {
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
	return <PublicHomeRoute />
}
