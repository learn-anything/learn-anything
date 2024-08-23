import * as react from "react"

export type WindowSize = {
	width: number,
	height: number,
}

export function getWindowSize(): WindowSize {
	return {
        width:  window.innerWidth,
        height: window.innerHeight,
	}
}

export function useWindowSize(): WindowSize {
	
    let [window_size, setWindowSize] = react.useState(getWindowSize())

    react.useEffect(() => {
        function handleResize() {
            setWindowSize(getWindowSize())
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return window_size
}
