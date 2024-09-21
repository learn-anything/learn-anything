import { useState, useEffect } from "react"

export function useTouchSensor() {
	const [isTouchDevice, setIsTouchDevice] = useState(false)

	useEffect(() => {
		const detectTouch = () => {
			setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
		}

		detectTouch()
		window.addEventListener("touchstart", detectTouch, false)

		return () => {
			window.removeEventListener("touchstart", detectTouch)
		}
	}, [])

	return isTouchDevice
}
