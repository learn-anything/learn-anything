"use client"

import * as React from "react"
import {
  ContentHeader,
  SidebarToggleButton
} from "@/components/custom/content-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { useCoState } from "@/lib/providers/jazz-provider"
import { PersonalPage } from "@/lib/schema/personal-page"
import { ID } from "jazz-tools"

export const DetailPageHeader = ({ pageId }: { pageId: ID<PersonalPage> }) => {
  const page = useCoState(PersonalPage, pageId)

  return (
    <ContentHeader>
      <div className="flex min-w-0 gap-2">
        <SidebarToggleButton />

        <Breadcrumb className="flex flex-row items-center">
          <BreadcrumbList className="sm:gap-2">
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                Pages
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </ContentHeader>
  )
}
