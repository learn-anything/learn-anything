import { LaIcon } from "../../la-icon"
import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useAccount } from "@/lib/providers/jazz-provider"
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
	const { me, logOut } = useAccount({
		profile: true
	})
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
								<Avatar className="size-6">
									<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
									{/* <AvatarFallback>CN</AvatarFallback> */}
								</Avatar>
								<span className="truncate text-left text-sm font-medium -tracking-wider">{me?.profile?.name}</span>
								<LaIcon
									name="ChevronDown"
									className={`size-4 shrink-0 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
								/>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="start" side="top">
							<DropdownMenuItem>
								<MenuItem icon="CircleUser" text="My profile" href="/profile" onClose={closeMenu} />
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<MenuItem icon="Settings" text="Settings" href="/settings" onClose={closeMenu} />
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<MenuItem icon="LogOut" text="Log out" onClick={logOut} onClose={closeMenu} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
<<<<<<< HEAD
				<div className="flex min-w-2 grow flex-row"></div>
=======
				{/* <div className="flex min-w-2 grow flex-row"></div>
>>>>>>> 7c68b66b7a987fc9b616fcc1d7581056ec630058
				<div className="flex flex-row items-center gap-2">
					<Button size="icon" variant="ghost" aria-label="Settings" className="size-7 p-0">
						<LaIcon name="Settings" />
					</Button>
					<Link href="/">
						<Button size="icon" variant="ghost" aria-label="Settings" className="size-7 p-0">
							<LaIcon name="House" />
						</Button>
					</Link>
<<<<<<< HEAD
				</div>
=======
				</div> */}
>>>>>>> 7c68b66b7a987fc9b616fcc1d7581056ec630058
			</div>
		</div>
	)
}
