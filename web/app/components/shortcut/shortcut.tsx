import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { atom, useAtom } from "jotai"
import {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTitle,
  sheetVariants,
  SheetDescription,
} from "@/components/ui/sheet"
import { LaIcon } from "@/components/custom/la-icon"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useKeyboardManager } from "@/hooks/use-keyboard-manager"

export const showShortcutAtom = atom(false)

type ShortcutItem = {
  label: string
  keys: string[]
  then?: string[]
}

type ShortcutSection = {
  title: string
  shortcuts: ShortcutItem[]
}

const SHORTCUTS: ShortcutSection[] = [
  {
    title: "General",
    shortcuts: [
      { label: "Open command menu", keys: ["⌘", "k"] },
      { label: "Log out", keys: ["⌥", "⇧", "q"] },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [
      { label: "Go to link", keys: ["G"], then: ["L"] },
      { label: "Go to page", keys: ["G"], then: ["P"] },
      { label: "Go to topic", keys: ["G"], then: ["T"] },
    ],
  },
  {
    title: "Links",
    shortcuts: [{ label: "Create new link", keys: ["c"] }],
  },
  {
    title: "Pages",
    shortcuts: [{ label: "Create new page", keys: ["p"] }],
  },
]

const ShortcutKey: React.FC<{ keyChar: string }> = ({ keyChar }) => (
  <kbd
    aria-hidden="true"
    className="inline-flex size-5 items-center justify-center rounded border font-sans text-xs capitalize"
  >
    {keyChar}
  </kbd>
)

const ShortcutItem: React.FC<ShortcutItem> = ({ label, keys, then }) => (
  <div className="flex flex-row items-center gap-2">
    <dt className="flex grow items-center">
      <span className="text-left text-sm text-muted-foreground">{label}</span>
    </dt>
    <dd className="flex items-end">
      <span className="text-left">
        <span
          aria-label={keys.join(" ") + (then ? ` then ${then.join(" ")}` : "")}
          className="inline-flex items-center gap-1"
        >
          {keys.map((key, index) => (
            <ShortcutKey key={index} keyChar={key} />
          ))}
          {then && (
            <>
              <span className="text-xs text-muted-foreground">then</span>
              {then.map((key, index) => (
                <ShortcutKey key={`then-${index}`} keyChar={key} />
              ))}
            </>
          )}
        </span>
      </span>
    </dd>
  </div>
)

const ShortcutSection: React.FC<ShortcutSection> = ({ title, shortcuts }) => (
  <section className="flex flex-col gap-2">
    <h2 className="inline-flex gap-1.5 text-sm">{title}</h2>
    <dl className="m-0 flex flex-col gap-2">
      {shortcuts.map((shortcut, index) => (
        <ShortcutItem key={index} {...shortcut} />
      ))}
    </dl>
  </section>
)

export function Shortcut() {
  const [showShortcut, setShowShortcut] = useAtom(showShortcutAtom)
  const [searchQuery, setSearchQuery] = React.useState("")

  const { disableKeydown } = useKeyboardManager("shortcutSection")

  React.useEffect(() => {
    disableKeydown(showShortcut)
  }, [showShortcut, disableKeydown])

  const filteredShortcuts = React.useMemo(() => {
    if (!searchQuery) return SHORTCUTS

    return SHORTCUTS.map((section) => ({
      ...section,
      shortcuts: section.shortcuts.filter((shortcut) =>
        shortcut.label.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    })).filter((section) => section.shortcuts.length > 0)
  }, [searchQuery])

  return (
    <Sheet open={showShortcut} onOpenChange={setShowShortcut}>
      <SheetPortal>
        <SheetOverlay className="bg-black/10" />
        <SheetPrimitive.Content
          className={cn(
            sheetVariants({ side: "right" }),
            "m-3 h-[calc(100vh-24px)] rounded-md p-0",
          )}
        >
          <header className="flex flex-[0_0_auto] items-center gap-3 px-5 pb-4 pt-5">
            <SheetTitle className="text-base font-medium">
              Keyboard Shortcuts
            </SheetTitle>
            <SheetDescription className="sr-only">
              Quickly navigate around the app
            </SheetDescription>

            <div className="flex-auto"></div>

            <SheetPrimitive.Close
              className={cn(
                buttonVariants({ size: "icon", variant: "ghost" }),
                "size-6 p-0",
              )}
            >
              <LaIcon name="X" className="size-5 text-muted-foreground" />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          </header>

          <div className="flex flex-col gap-1 px-5 pb-6">
            <form className="relative flex items-center">
              <LaIcon
                name="Search"
                className="absolute left-3 size-4 text-muted-foreground"
              />
              <Input
                autoFocus
                placeholder="Search shortcuts"
                className="h-10 border-muted-foreground/50 pl-10 focus-visible:border-muted-foreground focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <main className="flex-auto overflow-y-auto overflow-x-hidden [scrollbar-gutter:auto]">
            <div className="px-5 pb-5">
              <div
                role="region"
                aria-live="polite"
                className="flex flex-col gap-7"
              >
                {filteredShortcuts.map((section, index) => (
                  <ShortcutSection key={index} {...section} />
                ))}
              </div>
            </div>
          </main>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  )
}
