import * as React from "react"
import { useFormContext } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { LinkFormValues } from "./-schema"

interface UrlBadgeProps {
  urlFetched: string | null
  handleResetUrl: () => void
}

export const UrlBadge: React.FC<UrlBadgeProps> = ({
  urlFetched,
  handleResetUrl,
}) => {
  const form = useFormContext<LinkFormValues>()

  if (!urlFetched) return null

  return (
    <div className="flex items-center gap-1.5 py-1.5">
      <div className="flex min-w-0 flex-row items-center gap-1.5">
        <Badge variant="secondary" className="relative truncate py-1 text-xs">
          {form.getValues("url")}
          <Button
            size="icon"
            type="button"
            onClick={handleResetUrl}
            className="ml-2 size-4 rounded-full bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <LaIcon name="X" className="" />
          </Button>
        </Badge>
      </div>
    </div>
  )
}
