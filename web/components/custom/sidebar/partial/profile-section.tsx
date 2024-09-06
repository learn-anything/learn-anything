import { useAccount } from "@/lib/providers/jazz-provider"
import { LaIcon } from "../../la-icon"
import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const MenuItem = ({
	icon,
	text,
	href,
	onClick,
	onClose
}: {
	icon: string
	text: string
	href?: string
	onClick?: () => void
	onClose: () => void
}) => {
	const handleClick = () => {
		onClose()
		if (onClick) {
			onClick()
		}
	}

	return (
		<div className="relative flex flex-1 items-center gap-2">
			<LaIcon name={icon as any} />
			{href ? (
				<Link href={href} onClick={onClose}>
					<span className="line-clamp-1 flex-1">{text}</span>
				</Link>
			) : (
				<span className="line-clamp-1 flex-1" onClick={handleClick}>
					{text}
				</span>
			)}
		</div>
	)
}
export const ProfileSection: React.FC = () => {
	const { me } = useAccount({
		profile: true
	})
	const { signOut, isSignedIn } = useAuth()
	const [menuOpen, setMenuOpen] = useState(false)

	const closeMenu = () => setMenuOpen(false)

	return (
		<div className="visible absolute inset-x-0 bottom-0 z-10 flex gap-8 p-2.5">
			<div className="flex h-10 min-w-full items-center">
				<div className="flex min-w-0">
					<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
						<DropdownMenuTrigger asChild>
							<button
								aria-label="Profile"
								className="hover:bg-accent focus-visible:ring-ring hover:text-accent-foreground flex items-center gap-1.5 truncate rounded pl-1 pr-1.5 focus-visible:outline-none focus-visible:ring-1"
							>
								{isSignedIn ? (
									<Avatar className="size-6">
										<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
									</Avatar>
								) : (
									<LaIcon name="User" />
								)}
								<span className="truncate text-left text-sm font-medium -tracking-wider">
									{isSignedIn ? me?.profile?.name : "guest"}
								</span>
								<LaIcon
									name="ChevronDown"
									className={`size-4 shrink-0 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
								/>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="start" side="top">
							{isSignedIn ? (
								<>
									<DropdownMenuItem>
										<MenuItem icon="CircleUser" text="My profile" href="/profile" onClose={closeMenu} />
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<MenuItem icon="LogOut" text="Log out" onClick={signOut} onClose={closeMenu} />
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<MenuItem icon="CircleUser" text="Tauri" href="/tauri" onClose={closeMenu} />
									</DropdownMenuItem>
								</>
							) : (
								<DropdownMenuItem>
									<MenuItem icon="LogIn" text="Sign in" href="/sign-in" onClose={closeMenu} />
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	)
}

/* <DropdownMenuItem>
								<MenuItem icon="Settings" text="Settings" href="/settings" onClose={closeMenu} />
							</DropdownMenuItem> */
