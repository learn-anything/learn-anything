"use client"

import * as React from "react"
import { SignInButton, useAuth, useUser } from "@clerk/nextjs"
import { useAtom } from "jotai"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { icons } from "lucide-react"

import { LaIcon } from "@/components/custom/la-icon"
import { DiscordIcon } from "@/components/custom/discordIcon"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Feedback } from "./feedback"
import { showShortcutAtom } from "@/components/custom/shortcut/shortcut"
import { ShortcutKey } from "@/components/minimal-tiptap/components/shortcut-key"
import { useKeyboardManager } from "@/hooks/use-keyboard-manager"

export const ProfileSection: React.FC = () => {
	const { user, isSignedIn } = useUser()
	const { signOut } = useAuth()
	const [menuOpen, setMenuOpen] = React.useState(false)
	const pathname = usePathname()
	const [, setShowShortcut] = useAtom(showShortcutAtom)

	const { disableKeydown } = useKeyboardManager("profileSection")

	React.useEffect(() => {
		disableKeydown(menuOpen)
	}, [menuOpen, disableKeydown])

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
				<ProfileDropdown
					user={user}
					menuOpen={menuOpen}
					setMenuOpen={setMenuOpen}
					signOut={signOut}
					setShowShortcut={setShowShortcut}
				/>
				<Feedback />
			</div>
		</div>
	)
}

interface ProfileDropdownProps {
	user: any
	menuOpen: boolean
	setMenuOpen: (open: boolean) => void
	signOut: () => void
	setShowShortcut: (show: boolean) => void
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, menuOpen, setMenuOpen, signOut, setShowShortcut }) => (
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
				<DropdownMenuItems signOut={signOut} setShowShortcut={setShowShortcut} />
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
)

interface DropdownMenuItemsProps {
	signOut: () => void
	setShowShortcut: (show: boolean) => void
}

const DropdownMenuItems: React.FC<DropdownMenuItemsProps> = ({ signOut, setShowShortcut }) => (
	<>
		<MenuLink href="/profile" icon="CircleUser" text="My profile" />
		<DropdownMenuItem className="gap-2" onClick={() => setShowShortcut(true)}>
			<LaIcon name="Keyboard" />
			<span>Shortcut</span>
		</DropdownMenuItem>
		<MenuLink href="/onboarding" icon="LayoutList" text="Onboarding" />
		<DropdownMenuSeparator />
		<MenuLink href="https://docs.learn-anything.xyz/" icon="Sticker" text="Docs" />
		<MenuLink href="https://github.com/learn-anything/learn-anything" icon="Github" text="GitHub" />
		<MenuLink href="https://discord.com/invite/bxtD8x6aNF" icon={DiscordIcon} text="Discord" iconClass="-ml-1" />
		<DropdownMenuSeparator />
		<DropdownMenuItem onClick={signOut}>
			<div className="relative flex flex-1 cursor-pointer items-center gap-2">
				<LaIcon name="LogOut" />
				<span>Log out</span>
				<div className="absolute right-0">
					<ShortcutKey keys={["alt", "shift", "q"]} />
				</div>
			</div>
		</DropdownMenuItem>
	</>
)

interface MenuLinkProps {
	href: string
	icon: keyof typeof icons | React.FC
	text: string
	iconClass?: string
}

const MenuLink: React.FC<MenuLinkProps> = ({ href, icon, text, iconClass = "" }) => {
	const IconComponent = typeof icon === "string" ? icons[icon] : icon
	return (
		<DropdownMenuItem asChild>
			<Link className="cursor-pointer" href={href}>
				<div className={cn("relative flex flex-1 items-center gap-2", iconClass)}>
					<IconComponent className="size-4" />
					<span className="line-clamp-1 flex-1">{text}</span>
				</div>
			</Link>
		</DropdownMenuItem>
	)
}

export default ProfileSection
