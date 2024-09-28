"use client"

import { useState, useEffect, useCallback } from "react"
import { useKeyDown, KeyFilter, Options } from "@/hooks/use-key-down"
import { useAccountOrGuest } from "@/lib/providers/jazz-provider"
import { useRouter } from "next/navigation"
import queryString from "query-string"
import { usePageActions } from "../routes/page/hooks/use-page-actions"
import { useAuth } from "@clerk/nextjs"
import { isModKey } from "@/lib/utils"
import { useAtom } from "jotai"
import { commandPaletteOpenAtom } from "./command-palette/command-palette"

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
	GT: "/topics"
}

const MAX_SEQUENCE_TIME = 1000

export function GlobalKeyboardHandler() {
	const [openCommandPalette, setOpenCommandPalette] = useAtom(commandPaletteOpenAtom)
	const [sequence, setSequence] = useState<string[]>([])
	const { signOut } = useAuth()
	const router = useRouter()
	const { me } = useAccountOrGuest()
	const { newPage } = usePageActions()

	const resetSequence = useCallback(() => {
		setSequence([])
	}, [])

	const checkSequence = useCallback(() => {
		const sequenceStr = sequence.join("")
		const route = SEQUENCES[sequenceStr]

		if (route) {
			console.log(`Navigating to ${route}...`)
			router.push(route)
			resetSequence()
		}
	}, [sequence, router, resetSequence])

	const goToNewLink = useCallback(
		(event: KeyboardEvent) => {
			if (event.metaKey || event.altKey) {
				return
			}

			router.push(`/links?${queryString.stringify({ create: true })}`)
		},
		[router]
	)

	const goToNewPage = useCallback(
		(event: KeyboardEvent) => {
			if (event.metaKey || event.altKey) {
				return
			}

			if (!me || me._type === "Anonymous") {
				return
			}

			const page = newPage(me)

			router.push(`/pages/${page.id}`)
		},
		[me, newPage, router]
	)

	useKeyDown(
		e => e.altKey && e.shiftKey && e.code === "KeyQ",
		() => {
			signOut()
		}
	)

	useKeyDown(
		() => true,
		e => {
			const key = e.key.toUpperCase()
			setSequence(prev => [...prev, key])
		}
	)

	useKeyDown(
		e => isModKey(e) && e.code === "KeyK",
		e => {
			e.preventDefault()
			setOpenCommandPalette(prev => !prev)
		}
	)

	useEffect(() => {
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
