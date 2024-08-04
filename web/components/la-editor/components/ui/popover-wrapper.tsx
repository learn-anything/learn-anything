import * as React from 'react'
import { cn } from '@/lib/utils'

export type PopoverWrapperProps = React.HTMLProps<HTMLDivElement>

export const PopoverWrapper = React.forwardRef<HTMLDivElement, PopoverWrapperProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn('rounded-lg border bg-popover text-popover-foreground shadow-sm', className)}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    )
  },
)

PopoverWrapper.displayName = 'PopoverWrapper'
