import * as React from "react"
import { cn } from "~/lib/utils"

export const ArrowIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 24 24"
      className={cn(className)}
      {...props}
    >
      <path
        d="M18.1125 12.4381C18.4579 12.2481 18.4579 11.7519 18.1125 11.5619L8.74096 6.40753C8.40773 6.22425 8 6.46533 8 6.84564V17.1544C8 17.5347 8.40773 17.7757 8.74096 17.5925L18.1125 12.4381Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  )
}
