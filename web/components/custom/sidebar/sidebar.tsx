"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMedia } from "@/hooks/use-media"
import { useAtom } from "jotai"
import { Logo } from "@/components/custom/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { isCollapseAtom } from "@/store/sidebar"
import { LinkSection } from "./partial/link-section"
import { PageSection } from "./partial/page-section"
import { TopicSection } from "./partial/topic-section"
import { ProfileSection } from "./partial/profile-section"
import { TaskSection } from "./partial/task-section"
import { useAccountOrGuest } from "@/lib/providers/jazz-provider"
import { LaIcon } from "../la-icon"
import { JournalSection } from "./partial/journal-section"

interface SidebarContextType {
	isCollapsed: boolean
	setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextType>({
	isCollapsed: false,
	setIsCollapsed: () => {}
})

const useSidebarCollapse = (isTablet: boolean): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
	const [isCollapsed, setIsCollapsed] = useAtom(isCollapseAtom)
	const pathname = usePathname()

	React.useEffect(() => {
		if (isTablet) setIsCollapsed(true)
	}, [pathname, setIsCollapsed, isTablet])

	React.useEffect(() => {
		setIsCollapsed(isTablet)
	}, [isTablet, setIsCollapsed])

	return [isCollapsed, setIsCollapsed]
}

interface SidebarItemProps {
	label: string
	url: string
	icon?: React.ReactNode
	onClick?: () => void
	children?: React.ReactNode
}

const SidebarItem: React.FC<SidebarItemProps> = React.memo(({ label, url, icon, onClick, children }) => {
	const pathname = usePathname()
	const isActive = pathname === url

	return (
		<div className={cn("group relative my-0.5 rounded-md", isActive ? "bg-secondary/80" : "hover:bg-secondary/40")}>
			<Link
				className="text-secondary-foreground flex h-8 grow items-center truncate rounded-md pl-1.5 pr-1 text-sm font-medium"
				href={url}
				onClick={onClick}
			>
				{icon && (
					<span className={cn("text-primary/60 group-hover:text-primary mr-2 size-4", { "text-primary": isActive })}>
						{icon}
					</span>
				)}
				<span>{label}</span>
				{children}
			</Link>
		</div>
	)
})

SidebarItem.displayName = "SidebarItem"

const LogoAndSearch: React.FC = React.memo(() => {
	const pathname = usePathname()
	return (
		<div className="px-3">
			<div className="mt-2 flex h-10 max-w-full items-center">
				<Link href="/" className="px-2">
					<Logo className="size-7" />
				</Link>
				<div className="flex min-w-2 grow flex-row" />
				{pathname === "/search" ? (
					<Link href="/">
						<Button size="sm" variant="secondary" type="button" className="text-md text-primary/60 font-medium">
							← Back
						</Button>
					</Link>
				) : (
					<Link href="/search">
						<Button
							size="sm"
							variant="secondary"
							aria-label="Search"
							type="button"
							className="text-primary/60 flex w-20 items-center justify-start py-4 pl-2"
						>
							<LaIcon name="Search" className="mr-2" />
						</Button>
					</Link>
				)}
			</div>
		</div>
	)
})

LogoAndSearch.displayName = "LogoAndSearch"

const SidebarContent: React.FC = React.memo(() => {
	const { me } = useAccountOrGuest()
	const pathname = usePathname()

	return (
		<nav className="bg-background relative flex h-full w-full shrink-0 flex-col">
			<div>
				<LogoAndSearch />
			</div>
			<div className="relative mb-0.5 mt-1.5 flex grow flex-col overflow-y-auto rounded-md px-3 outline-none">
				<div className="h-2 shrink-0" />
				{me._type === "Account" && <LinkSection pathname={pathname} />}
				{me._type === "Account" && <TopicSection pathname={pathname} />}
				{me._type === "Account" && <JournalSection />}
				{me._type === "Account" && <TaskSection pathname={pathname} />}
				{me._type === "Account" && <PageSection pathname={pathname} />}
			</div>

			<ProfileSection />
		</nav>
	)
})

SidebarContent.displayName = "SidebarContent"

const Sidebar: React.FC = () => {
	const isTablet = useMedia("(max-width: 1024px)")
	const [isCollapsed, setIsCollapsed] = useSidebarCollapse(isTablet)

	const sidebarClasses = cn(
		"h-full overflow-hidden transition-all duration-300 ease-in-out",
		isCollapsed ? "w-0" : "w-auto min-w-56"
	)

	const sidebarInnerClasses = cn(
		"h-full w-56 min-w-56 transition-transform duration-300 ease-in-out",
		isCollapsed ? "-translate-x-full" : "translate-x-0"
	)

	const contextValue = React.useMemo(() => ({ isCollapsed, setIsCollapsed }), [isCollapsed, setIsCollapsed])

	if (isTablet) {
		return (
			<>
				<div
					className={cn(
						"fixed inset-0 z-30 bg-black/40 transition-opacity duration-300",
						isCollapsed ? "pointer-events-none opacity-0" : "opacity-100"
					)}
					onClick={() => setIsCollapsed(true)}
				/>
				<div
					className={cn(
						"fixed left-0 top-0 z-40 h-full",
						sidebarClasses,
						!isCollapsed && "shadow-[4px_0px_16px_rgba(0,0,0,0.1)] transition-all"
					)}
				>
					<div className={cn(sidebarInnerClasses, "border-r-primary/5 border-r")}>
						<SidebarContext.Provider value={contextValue}>
							<SidebarContent />
						</SidebarContext.Provider>
					</div>
				</div>
			</>
		)
	}

	return (
		<div className={sidebarClasses}>
			<div className={sidebarInnerClasses}>
				<SidebarContext.Provider value={contextValue}>
					<SidebarContent />
				</SidebarContext.Provider>
			</div>
		</div>
	)
}

Sidebar.displayName = "Sidebar"

export { Sidebar, SidebarItem, SidebarContext }
