"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { LaIcon } from "@/components/custom/la-icon"
import { useAccount } from "@/lib/providers/jazz-provider"
import { usePageActions } from "./hooks/use-page-actions"

interface PageHeaderProps {}

export const PageHeader: React.FC<PageHeaderProps> = React.memo(() => {
	const { me } = useAccount()
	const router = useRouter()
	const { newPage } = usePageActions()

	if (!me) return null

	const handleNewPageClick = () => {
		const page = newPage(me)
		router.push(`/pages/${page.id}`)
	}

	return (
		<ContentHeader className="px-6 py-4 max-lg:px-4">
			<HeaderTitle />
			<div className="flex flex-auto" />
			<NewPageButton onClick={handleNewPageClick} />
		</ContentHeader>
	)
})

PageHeader.displayName = "PageHeader"

const HeaderTitle: React.FC = () => (
	<div className="flex min-w-0 shrink-0 items-center gap-1.5">
		<SidebarToggleButton />
		<div className="flex min-h-0 items-center">
			<span className="truncate text-left font-bold lg:text-xl">Pages</span>
		</div>
	</div>
)

interface NewPageButtonProps {
	onClick: () => void
}

const NewPageButton: React.FC<NewPageButtonProps> = ({ onClick }) => (
	<div className="flex w-auto items-center justify-end">
		<div className="flex items-center gap-2">
			<Button size="sm" type="button" variant="secondary" className="gap-x-2" onClick={onClick}>
				<LaIcon name="Plus" />
				<span className="hidden md:block">New page</span>
			</Button>
		</div>
	</div>
)
