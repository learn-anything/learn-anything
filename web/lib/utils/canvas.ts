/**
 * Resizes the canvas to match the size it is being displayed.
 *
 * @param   canvas the canvas to resize
 * @returns `true` if the canvas was resized
 */
export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
	// Get the size the browser is displaying the canvas in device pixels.
	let dpr             = window.devicePixelRatio
	let {width, height} = canvas.getBoundingClientRect()
	let display_width   = Math.round(width * dpr)
	let display_height  = Math.round(height * dpr)

	let need_resize = canvas.width  != display_width ||
	                  canvas.height != display_height

	if (need_resize) {
		canvas.width  = display_width
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
	let cro: CanvasResizeObserver = {
		resized:  false,
		canvas:   canvas,
		observer: null!,
	}
	cro.observer = new ResizeObserver(resize.bind(null, cro))
	resize(cro)
	cro.observer.observe(canvas)
	return cro
}

export function clear(observer: CanvasResizeObserver): void {
	observer.observer.disconnect()
}
