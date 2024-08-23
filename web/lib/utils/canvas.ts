/**
 * Resizes the canvas to match the size it is being displayed.
 *
 * @param   canvas the canvas to resize
 * @returns `true` if the canvas was resized
 */
export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
	// Get the size the browser is displaying the canvas in device pixels.
	let dpr = window.devicePixelRatio
	let {width, height} = canvas.getBoundingClientRect()
	let display_width  = Math.round(width * dpr)
	let display_height = Math.round(height * dpr)

	// Check if the canvas is not the same size.
	let need_resize = canvas.width != display_width || canvas.height != display_height

	if (need_resize) {
		canvas.width = display_width
		canvas.height = display_height
	}

	return need_resize
}

export interface CanvasResizeObserver {
	/** Canvas was resized since last check. Set it to `false` to reset. */
	resized:  boolean
	canvas:   HTMLCanvasElement
	observer: ResizeObserver
}

export function resize(observer: CanvasResizeObserver): boolean {
	let resized = resizeCanvasToDisplaySize(observer.canvas)
	observer.resized ||= resized
	return resized
}

export function resizeObserver(canvas: HTMLCanvasElement): CanvasResizeObserver {
	let canvas_observer: CanvasResizeObserver = {
		resized: false,
		canvas,
		observer: null!,
	}
	canvas_observer.observer = new ResizeObserver(resize.bind(null, canvas_observer))
	resize(canvas_observer)
	canvas_observer.observer.observe(canvas)
	return canvas_observer
}

export function clear(observer: CanvasResizeObserver): void {
	observer.observer.disconnect()
}
