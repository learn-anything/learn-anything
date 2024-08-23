import { LaIcon } from "../../la-icon"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useAccount } from "@/lib/providers/jazz-provider"
import Link from "next/link"

export const ProfileSection: React.FC = () => {
	const { me, logOut } = useAccount({
		profile: true
	})

	return (
		<div className="visible absolute inset-x-0 bottom-0 z-10 flex gap-8 p-2.5">
			<div className="flex h-10 min-w-full items-center">
				<div className="flex min-w-0">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								aria-label="Profile"
								className="hover:bg-accent focus-visible:ring-ring hover:text-accent-foreground flex h-8 items-center gap-1.5 truncate rounded pl-1 pr-1.5 focus-visible:outline-none focus-visible:ring-1"
							>
								<Avatar className="size-6">
									<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<span className="truncate text-left text-sm font-medium -tracking-wider">{me?.profile?.name}</span>
								<LaIcon name="ChevronDown" className="size-4 shrink-0" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="start" side="top">
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<div className="relative flex flex-1 items-center gap-2">
										<LaIcon name="CircleUser" />
										<Link href="/profile">
											<span className="line-clamp-1 flex-1">My profile</span>
										</Link>
									</div>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={logOut}>
								<div className="relative flex flex-1 items-center gap-2">
									{/* <LaIcon name="LogOut" /> */}
									<span className="line-clamp-1 flex-1">Log out</span>
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="flex min-w-2 grow flex-row"></div>
				<div className="flex flex-row items-center gap-2">
					<Button size="icon" variant="ghost" aria-label="Settings" className="size-7 p-0">
						<LaIcon name="Settings" />
					</Button>
					<Link href="/">
						<Button size="icon" variant="ghost" aria-label="Settings" className="size-7 p-0">
							<LaIcon name="House" />
						</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}
