import { useState, useEffect } from "react"

const SSR = typeof window === "undefined"

export function useTouchSensor() {
	const [isTouchDevice, setIsTouchDevice] = useState(false)

	useEffect(() => {
		const detectTouch = () => {
			setIsTouchDevice(
				!SSR &&
					(window.matchMedia?.("(hover: none) and (pointer: coarse)")?.matches ||
						"ontouchstart" in window ||
						navigator.maxTouchPoints > 0)
			)
		}

		detectTouch()
		window.addEventListener("touchstart", detectTouch, false)

		return () => {
			window.removeEventListener("touchstart", detectTouch)
		}
	}, [])

	return isTouchDevice
}
