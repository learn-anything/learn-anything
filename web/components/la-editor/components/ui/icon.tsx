import * as React from 'react'
import { cn } from '@/lib/utils'
import { icons } from 'lucide-react'

export type IconProps = {
  name: keyof typeof icons
  className?: string
  strokeWidth?: number
  [key: string]: any
}

export const Icon = React.memo(({ name, className, size, strokeWidth, ...props }: IconProps) => {
  const IconComponent = icons[name]

  if (!IconComponent) {
    return null
  }

  return <IconComponent className={cn(!size ? 'size-4' : size, className)} strokeWidth={strokeWidth || 2} {...props} />
})

Icon.displayName = 'Icon'
