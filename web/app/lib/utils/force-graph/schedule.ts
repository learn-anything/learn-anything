export interface Scheduler<Args extends unknown[]> {
  trigger: (...args: Args) => void
  clear: () => void
}

/**
 * Creates a callback that is debounced and cancellable. The debounced callback is called on **trailing** edge.
 *
 * @param callback The callback to debounce
 * @param wait The duration to debounce in milliseconds
 *
 * @example
 * ```ts
 * const debounce = schedule.debounce((message: string) => console.log(message), 250)
 * debounce.trigger('Hello!')
 * debounce.clear() // clears a timeout in progress
 * ```
 */
export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait?: number,
): Debounce<Args> {
  return new Debounce(callback, wait)
}

export class Debounce<Args extends unknown[]> implements Scheduler<Args> {
  timeout_id: ReturnType<typeof setTimeout> | undefined

  constructor(
    public callback: (...args: Args) => void,
    public wait?: number,
  ) {}

  trigger(...args: Args): void {
    if (this.timeout_id !== undefined) {
      this.clear()
    }
    this.timeout_id = setTimeout(() => {
      this.callback(...args)
    }, this.wait)
  }

  clear(): void {
    clearTimeout(this.timeout_id)
  }
}

/**
 * Creates a callback that is throttled and cancellable. The throttled callback is called on **trailing** edge.
 *
 * @param callback The callback to throttle
 * @param wait The duration to throttle
 *
 * @example
 * ```ts
 * const throttle = schedule.throttle((val: string) => console.log(val), 250)
 * throttle.trigger('my-new-value')
 * throttle.clear() // clears a timeout in progress
 * ```
 */
export function throttle<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait?: number,
): Throttle<Args> {
  return new Throttle(callback, wait)
}

export class Throttle<Args extends unknown[]> implements Scheduler<Args> {
  is_throttled = false
  timeout_id: ReturnType<typeof setTimeout> | undefined
  last_args: Args | undefined

  constructor(
    public callback: (...args: Args) => void,
    public wait?: number,
  ) {}

  trigger(...args: Args): void {
    this.last_args = args
    if (this.is_throttled) {
      return
    }
    this.is_throttled = true
    this.timeout_id = setTimeout(() => {
      this.callback(...(this.last_args as Args))
      this.is_throttled = false
    }, this.wait)
  }

  clear(): void {
    clearTimeout(this.timeout_id)
    this.is_throttled = false
  }
}

/**
 * Creates a callback throttled using `window.requestIdleCallback()`. ([MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback))
 *
 * The throttled callback is called on **trailing** edge.
 *
 * @param callback The callback to throttle
 * @param max_wait maximum wait time in milliseconds until the callback is called
 *
 * @example
 * ```ts
 * const idle = schedule.scheduleIdle((val: string) => console.log(val), 250)
 * idle.trigger('my-new-value')
 * idle.clear() // clears a timeout in progress
 * ```
 */
export function scheduleIdle<Args extends unknown[]>(
  callback: (...args: Args) => void,
  max_wait?: number,
): ScheduleIdle<Args> | Throttle<Args> {
  return typeof requestIdleCallback == "function"
    ? new ScheduleIdle(callback, max_wait)
    : new Throttle(callback)
}

export class ScheduleIdle<Args extends unknown[]> implements Scheduler<Args> {
  is_deferred = false
  request_id: ReturnType<typeof requestIdleCallback> | undefined
  last_args: Args | undefined

  constructor(
    public callback: (...args: Args) => void,
    public max_wait?: number,
  ) {}

  trigger(...args: Args): void {
    this.last_args = args
    if (this.is_deferred) {
      return
    }
    this.is_deferred = true
    this.request_id = requestIdleCallback(
      () => {
        this.callback(...(this.last_args as Args))
        this.is_deferred = false
      },
      { timeout: this.max_wait },
    )
  }

  clear(): void {
    if (this.request_id != undefined) {
      cancelIdleCallback(this.request_id)
    }
    this.is_deferred = false
  }
}
