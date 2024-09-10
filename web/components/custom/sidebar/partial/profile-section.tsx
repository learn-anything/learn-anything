import { LaIcon } from "@/components/custom/la-icon"
import { useState } from "react"
import { SignInButton, useAuth, useUser } from "@clerk/nextjs"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Feedback } from "./feedback"

export const ProfileSection: React.FC = () => {
	const { user, isSignedIn } = useUser()
	const { signOut } = useAuth()
	const [menuOpen, setMenuOpen] = useState(false)
	const pathname = usePathname()

	if (!isSignedIn) {
		return (
			<div className="flex flex-col gap-px border-t border-transparent px-3 py-2 pb-3 pt-1.5">
				<SignInButton mode="modal" forceRedirectUrl={pathname}>
					<Button variant="outline" className="flex w-full items-center gap-2">
						<LaIcon name="LogIn" />
						Sign in
					</Button>
				</SignInButton>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-px border-t border-transparent px-3 py-2 pb-3 pt-1.5">
			<div className="flex h-10 min-w-full items-center">
				<div className="flex min-w-0">
					<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								aria-label="Profile"
								className="hover:bg-accent focus-visible:ring-ring hover:text-accent-foreground flex h-auto items-center gap-1.5 truncate rounded py-1 pl-1 pr-1.5 focus-visible:outline-none focus-visible:ring-1"
							>
								<Avatar className="size-6">
									<AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
								</Avatar>
								<span className="truncate text-left text-sm font-medium -tracking-wider">{user.fullName}</span>
								<LaIcon
									name="ChevronDown"
									className={cn("size-4 shrink-0 transition-transform duration-300", {
										"rotate-180": menuOpen
									})}
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="start" side="top">
							<DropdownMenuItem asChild>
								<Link href="/profile">
									<div className="relative flex flex-1 items-center gap-2">
										<LaIcon name="CircleUser" />
										<span className="line-clamp-1 flex-1">My profile</span>
									</div>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/onboarding">
									<div className="relative flex flex-1 items-center gap-2">
										<LaIcon name="LayoutList" />
										<span className="line-clamp-1 flex-1">Onboarding</span>
									</div>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => signOut()}>
								<div className="relative flex flex-1 items-center gap-2">
									<LaIcon name="LogOut" />
									<span className="line-clamp-1 flex-1">Log out</span>
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Feedback />
			</div>
		</div>
	)
}
