import * as React from "react"
import { useAtom } from "jotai"
import { icons } from "lucide-react"
import { LaIcon } from "@/components/custom/la-icon"
import { DiscordIcon } from "@/components/icons/discord-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { showShortcutAtom } from "@/components/shortcut/shortcut"
import { useKeyboardManager } from "@/hooks/use-keyboard-manager"
import { SignInButton, useAuth, useUser } from "@clerk/tanstack-start"
import { Link, useLocation } from "@tanstack/react-router"
import { ShortcutKey } from "@shared/minimal-tiptap/components/shortcut-key"
import { Feedback } from "./feedback"
import { useAccount } from "~/lib/providers/jazz-provider"

export const ProfileSection: React.FC = () => {
  const { user, isSignedIn } = useUser()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const { pathname } = useLocation()
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
          setShowShortcut={setShowShortcut}
        />
        <span className="flex flex-auto"></span>
        <Feedback />
      </div>
    </div>
  )
}

interface ProfileDropdownProps {
  user: any
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  setShowShortcut: (show: boolean) => void
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  menuOpen,
  setMenuOpen,
  setShowShortcut,
}) => (
  <div className="flex min-w-0">
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Profile"
          className="flex h-auto items-center gap-1.5 truncate rounded py-1 pl-1 pr-1.5 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Avatar className="size-6">
            <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
          </Avatar>
          <span className="truncate text-left text-sm font-medium -tracking-wide">
            {user.fullName}
          </span>
          <LaIcon
            name="ChevronDown"
            className={cn("size-4 shrink-0 transition-transform duration-300", {
              "rotate-180": menuOpen,
            })}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" side="top">
        <DropdownMenuItems setShowShortcut={setShowShortcut} />
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)

interface DropdownMenuItemsProps {
  setShowShortcut: (show: boolean) => void
}

const DropdownMenuItems: React.FC<DropdownMenuItemsProps> = ({
  setShowShortcut,
}) => {
  const { signOut } = useAuth()
  const { logOut } = useAccount()

  const handleSignOut = React.useCallback(async () => {
    try {
      logOut()
      signOut(() => {
        window.location.href = "/"
      })
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }, [logOut, signOut])

  return (
    <>
      <MenuLink href="/profile" icon="CircleUser" text="My profile" />
      <DropdownMenuItem className="gap-2" onClick={() => setShowShortcut(true)}>
        <LaIcon name="Keyboard" />
        <span>Shortcuts</span>
      </DropdownMenuItem>
      <MenuLink href="/onboarding" icon="LayoutList" text="Onboarding" />
      <DropdownMenuSeparator />
      <MenuLink
        href="https://docs.learn-anything.xyz/"
        icon="Sticker"
        text="Docs"
      />
      <MenuLink
        href="https://github.com/learn-anything/learn-anything"
        icon="Github"
        text="GitHub"
      />
      <MenuLink
        href="https://discord.com/invite/bxtD8x6aNF"
        icon={DiscordIcon}
        text="Discord"
        iconClass="-ml-1"
      />
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleSignOut}>
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
}

interface MenuLinkProps {
  href: string
  icon: keyof typeof icons | React.FC
  text: string
  iconClass?: string
}

const MenuLink: React.FC<MenuLinkProps> = ({
  href,
  icon,
  text,
  iconClass = "",
}) => {
  const IconComponent = typeof icon === "string" ? icons[icon] : icon
  return (
    <DropdownMenuItem asChild>
      <Link className="cursor-pointer" to={href}>
        <div
          className={cn("relative flex flex-1 items-center gap-2", iconClass)}
        >
          <IconComponent className="size-4" />
          <span className="line-clamp-1 flex-1">{text}</span>
        </div>
      </Link>
    </DropdownMenuItem>
  )
}

export default ProfileSection
