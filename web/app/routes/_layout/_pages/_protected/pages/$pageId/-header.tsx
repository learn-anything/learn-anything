import * as React from "react"
import {
  ContentHeader,
  SidebarToggleButton,
} from "@/components/custom/content-header"
import { PersonalPage } from "@/lib/schema/personal-page"
import { TopicSelector } from "@/components/custom/topic-selector"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"

interface DetailPageHeaderProps {
  page: PersonalPage
  handleDelete: () => void
  isMobile: boolean
}

export const DetailPageHeader: React.FC<DetailPageHeaderProps> = ({
  page,
  handleDelete,
  isMobile,
}) => {
  if (!isMobile) return null

  return (
    <>
      <ContentHeader>
        <div className="flex min-w-0 gap-2">
          <SidebarToggleButton />
        </div>
      </ContentHeader>

      <div className="flex flex-row items-start gap-1.5 border-b px-6 py-2 max-lg:pl-4">
        <TopicSelector
          value={page.topic?.name}
          onTopicChange={(topic) => {
            page.topic = topic
            page.updatedAt = new Date()
          }}
          align="start"
          variant="outline"
          renderSelectedText={() => (
            <span className="truncate">
              {page.topic?.prettyName || "Select a topic"}
            </span>
          )}
        />
        <Button size="sm" variant="outline" onClick={handleDelete}>
          <LaIcon name="Trash" className="mr-2" />
          Delete
        </Button>
      </div>
    </>
  )
}
