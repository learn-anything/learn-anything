import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Command } from "cmdk"
import {
  Dialog,
  DialogPortal,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { CommandGroup } from "./command-group"
import { CommandAction, createCommandGroups } from "./command-data"
import { useAccount, useAccountOrGuest } from "@/lib/providers/jazz-provider"
import { useAtom } from "jotai"
import { useCommandActions } from "~/hooks/actions/use-command-actions"
import {
  filterItems,
  getTopics,
  getPersonalLinks,
  getPersonalPages,
  handleAction,
} from "./utils"
import { searchSafeRegExp } from "~/lib/utils"
import { commandPaletteOpenAtom } from "~/store/any-store"

export function CommandPalette() {
  const { me } = useAccountOrGuest()

  if (me._type === "Anonymous") return null

  return <RealCommandPalette />
}

export function RealCommandPalette() {
  const { me } = useAccount({
    root: { personalLinks: [{}], personalPages: [{}] },
  })
  const dialogRef = React.useRef<HTMLDivElement | null>(null)
  const [inputValue, setInputValue] = React.useState("")
  const [activePage, setActivePage] = React.useState("home")
  const [open, setOpen] = useAtom(commandPaletteOpenAtom)

  const actions = useCommandActions()
  const commandGroups = createCommandGroups(actions)

  const bounce = React.useCallback(() => {
    if (dialogRef.current) {
      dialogRef.current.style.transform = "scale(0.99) translateX(-50%)"
      setTimeout(() => {
        if (dialogRef.current) {
          dialogRef.current.style.transform = ""
        }
      }, 100)
    }
  }, [])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        bounce()
      }

      if (activePage !== "home" && !inputValue && e.key === "Backspace") {
        e.preventDefault()
        setActivePage("home")
        setInputValue("")
        bounce()
      }
    },
    [activePage, inputValue, bounce],
  )

  const topics = React.useMemo(() => getTopics(actions), [actions])
  const personalLinks = React.useMemo(
    () => getPersonalLinks(me?.root.personalLinks || [], actions),
    [me?.root.personalLinks, actions],
  )
  const personalPages = React.useMemo(
    () => getPersonalPages(me?.root.personalPages || [], actions),
    [me?.root.personalPages, actions],
  )

  const getFilteredCommands = React.useCallback(() => {
    if (!commandGroups) return []

    const searchRegex = searchSafeRegExp(inputValue)

    if (activePage === "home") {
      if (!inputValue) {
        return commandGroups.home
      }

      const allGroups = [
        ...Object.values(commandGroups).flat(),
        personalLinks,
        personalPages,
        topics,
      ]

      return allGroups
        .map((group) => ({
          heading: group.heading,
          items: filterItems(group.items, searchRegex),
        }))
        .filter((group) => group.items.length > 0)
    }

    switch (activePage) {
      case "searchLinks":
        return [
          ...commandGroups.searchLinks,
          { items: filterItems(personalLinks.items, searchRegex) },
        ]
      case "searchPages":
        return [
          ...commandGroups.searchPages,
          { items: filterItems(personalPages.items, searchRegex) },
        ]
      default: {
        const pageCommands = commandGroups[activePage]
        if (!inputValue) return pageCommands
        return pageCommands
          .map((group) => ({
            heading: group.heading,
            items: filterItems(group.items, searchRegex),
          }))
          .filter((group) => group.items.length > 0)
      }
    }
  }, [
    inputValue,
    activePage,
    commandGroups,
    personalLinks,
    personalPages,
    topics,
  ])

  const handleActionWrapper = React.useCallback(
    (action: CommandAction, payload?: any) => {
      handleAction(action, payload, {
        setActivePage,
        setInputValue,
        bounce,
        closeDialog: () => setOpen(false),
      })
    },
    [bounce, setOpen],
  )

  React.useEffect(() => {
    if (!open) {
      setInputValue("")
      setActivePage("home")
    }
  }, [open, setActivePage, setInputValue])

  const filteredCommands = React.useMemo(
    () => getFilteredCommands(),
    [getFilteredCommands],
  )

  const commandKey = React.useMemo(() => {
    return filteredCommands
      .map((group) => {
        const itemsKey = group.items
          .map((item) => `${item.label}-${item.value}`)
          .join("|")
        return `${group.heading}:${itemsKey}`
      })
      .join("__")
  }, [filteredCommands])

  if (!me) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogPrimitive.Overlay la-overlay="" cmdk-overlay="" />
        <DialogPrimitive.Content
          la-dialog=""
          cmdk-dialog=""
          className="la"
          ref={dialogRef}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Command Palette</DialogTitle>
            <DialogDescription>
              Search for commands and actions
            </DialogDescription>
          </DialogHeader>

          <Command key={commandKey} onKeyDown={handleKeyDown}>
            <div cmdk-input-wrapper="">
              <Command.Input
                autoFocus
                placeholder="Type a command or search..."
                value={inputValue}
                onValueChange={setInputValue}
              />
            </div>

            <Command.List>
              <Command.Empty>No results found.</Command.Empty>
              {filteredCommands.map((group, index, array) => (
                <CommandGroup
                  key={`${group.heading}-${index}`}
                  heading={group.heading}
                  items={group.items}
                  handleAction={handleActionWrapper}
                  isLastGroup={index === array.length - 1}
                />
              ))}
            </Command.List>
          </Command>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
