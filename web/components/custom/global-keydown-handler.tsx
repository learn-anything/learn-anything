"use client"

import { useState, useEffect, useCallback } from "react"
import { useKeydownListener } from "@/hooks/use-keydown-listener"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

type Sequence = {
	[key: string]: string
}

const SEQUENCES: Sequence = {
	GL: "/links",
	GP: "/pages",
	GT: "/topics"
}

const MAX_SEQUENCE_TIME = 1000

export function GlobalKeydownHandler() {
	const [sequence, setSequence] = useState<string[]>([])
	const { signOut } = useAuth()
	const router = useRouter()

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

	useKeydownListener((e: KeyboardEvent) => {
		// Check for logout shortcut
		if (e.altKey && e.shiftKey && e.code === "KeyQ") {
			signOut()
			return
		}

		// Key sequence handling
		const key = e.key.toUpperCase()
		setSequence(prev => [...prev, key])
	})

	useEffect(() => {
		checkSequence()

		const timeoutId = setTimeout(() => {
			resetSequence()
		}, MAX_SEQUENCE_TIME)

		return () => clearTimeout(timeoutId)
	}, [sequence, checkSequence, resetSequence])

	return null
}
