"use client"

import React, { useEffect, ReactNode } from "react"

interface DeepLinkProviderProps {
	children: ReactNode
}

export function DeepLinkProvider({ children }: DeepLinkProviderProps) {
	useEffect(() => {
		const eventHandlers: { [key: string]: (event: Event) => void } = {
			click: (event: Event) => {
				const e = event as MouseEvent
				// console.log("Click event:", { x: e.clientX, y: e.clientY })
			},
			keydown: (event: Event) => {
				const e = event as KeyboardEvent
				// console.log("Keydown event:", { key: e.key, code: e.code })
			}
		}

		// just a react thing
		Object.entries(eventHandlers).forEach(([eventType, handler]) => {
			window.addEventListener(eventType, handler)
		})

		return () => {
			Object.entries(eventHandlers).forEach(([eventType, handler]) => {
				window.removeEventListener(eventType, handler)
			})
		}
	}, [])

	return <>{children}</>
}
