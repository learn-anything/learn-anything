import * as React from "react"
import { useKeyDown, KeyFilter, Options } from "@/hooks/use-key-down"
import { useAccountOrGuest } from "@/lib/providers/jazz-provider"
import { useAtom } from "jotai"
import { usePageActions } from "~/hooks/actions/use-page-actions"
import { useAuth } from "@clerk/tanstack-start"
import { useNavigate } from "@tanstack/react-router"
import { commandPaletteOpenAtom } from "~/store/any-store"
import { isModKey, isServer } from "@shared/utils"

type RegisterKeyDownProps = {
  trigger: KeyFilter
  handler: (event: KeyboardEvent) => void
  options?: Options
}

function RegisterKeyDown({ trigger, handler, options }: RegisterKeyDownProps) {
  useKeyDown(trigger, handler, options)
  return null
}

type Sequence = {
  [key: string]: string
}

const SEQUENCES: Sequence = {
  GL: "/links",
  GP: "/pages",
  GT: "/topics",
}

const MAX_SEQUENCE_TIME = 1000

export function GlobalKeyboardHandler() {
  if (isServer()) {
    return null
  }

  return <KeyboardHandlerContent />
}

export function KeyboardHandlerContent() {
  const [, setOpenCommandPalette] = useAtom(commandPaletteOpenAtom)
  const [sequence, setSequence] = React.useState<string[]>([])
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const { me } = useAccountOrGuest()
  const { createNewPage } = usePageActions()

  const resetSequence = React.useCallback(() => {
    setSequence([])
  }, [])

  const checkSequence = React.useCallback(() => {
    const sequenceStr = sequence.join("")
    const route = SEQUENCES[sequenceStr]

    if (route) {
      navigate({ to: route })
      resetSequence()
    }
  }, [sequence, navigate, resetSequence])

  const goToNewLink = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.metaKey || event.altKey) {
        return
      }

      navigate({
        to: "/links",
        search: { create: true },
      })
    },
    [navigate],
  )

  const goToNewPage = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.metaKey || event.altKey) {
        return
      }

      createNewPage()
    },
    [createNewPage],
  )

  useKeyDown(
    (e) => e.altKey && e.shiftKey && e.code === "KeyQ",
    () => {
      signOut()
    },
  )

  useKeyDown(
    () => true,
    (e) => {
      const key = e.key.toUpperCase()
      setSequence((prev) => [...prev, key])
    },
  )

  useKeyDown(
    (e) => isModKey(e) && e.code === "KeyK",
    (e) => {
      e.preventDefault()
      setOpenCommandPalette((prev) => !prev)
    },
  )

  React.useEffect(() => {
    checkSequence()

    const timeoutId = setTimeout(() => {
      resetSequence()
    }, MAX_SEQUENCE_TIME)

    return () => clearTimeout(timeoutId)
  }, [sequence, checkSequence, resetSequence])

  return (
    me &&
    me._type !== "Anonymous" && (
      <>
        <RegisterKeyDown trigger="c" handler={goToNewLink} />
        <RegisterKeyDown trigger="p" handler={goToNewPage} />
      </>
    )
  )
}
