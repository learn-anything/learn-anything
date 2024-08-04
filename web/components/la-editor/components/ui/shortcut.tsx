import * as React from 'react'
import { cn } from '@/lib/utils'
import { getShortcutKey } from '../../lib/utils'

export interface ShortcutKeyWrapperProps extends React.HTMLAttributes<HTMLSpanElement> {
  ariaLabel: string
}

const ShortcutKeyWrapper = React.forwardRef<HTMLSpanElement, ShortcutKeyWrapperProps>(
  ({ className, ariaLabel, children, ...props }, ref) => {
    return (
      <span aria-label={ariaLabel} className={cn('inline-flex items-center gap-0.5', className)} {...props} ref={ref}>
        {children}
      </span>
    )
  },
)

ShortcutKeyWrapper.displayName = 'ShortcutKeyWrapper'

export interface ShortcutKeyProps extends React.HTMLAttributes<HTMLSpanElement> {
  shortcut: string
}

const ShortcutKey = React.forwardRef<HTMLSpanElement, ShortcutKeyProps>(({ className, shortcut, ...props }, ref) => {
  return (
    <kbd
      className={cn(
        'inline-block min-w-2.5 text-center align-baseline font-sans text-xs font-medium capitalize text-[rgb(156,157,160)]',
        className,
      )}
      {...props}
      ref={ref}
    >
      {getShortcutKey(shortcut)}
    </kbd>
  )
})

ShortcutKey.displayName = 'ShortcutKey'

export const Shortcut = {
  Wrapper: ShortcutKeyWrapper,
  Key: ShortcutKey,
}
