import { SignedInClient } from "@/components/custom/clerk/signed-in-client"
import { Sidebar } from "@/components/custom/sidebar/sidebar"
import { PublicHomeRoute } from "@/components/routes/PublicHomeRoute"
import { CommandPalette } from "@/components/ui/CommandPalette"
import { JazzClerkAuth, JazzProvider } from "@/lib/providers/jazz-provider"
import { currentUser } from "@clerk/nextjs/server"

export default async function PageLayout({ children }: { children: React.ReactNode }) {
	const user = await currentUser()

	if (!user) {
		return <PublicHomeRoute />
	}

	return (
		<JazzClerkAuth>
			<SignedInClient>
				<JazzProvider>
					<div className="flex h-full min-h-full w-full flex-row items-stretch overflow-hidden">
						<Sidebar />
						<CommandPalette />

						<div className="flex min-w-0 flex-1 flex-col">
							<main className="relative flex flex-auto flex-col place-items-stretch overflow-auto lg:my-2 lg:mr-2 lg:rounded-md lg:border">
								{children}
							</main>
						</div>
					</div>
				</JazzProvider>
			</SignedInClient>
		</JazzClerkAuth>
	)
}
