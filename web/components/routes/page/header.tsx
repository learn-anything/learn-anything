"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { LaIcon } from "@/components/custom/la-icon"
import { useAccount } from "@/lib/providers/jazz-provider"
import { useRouter } from "next/navigation"
import { PersonalPage } from "@/lib/schema"
import { toast } from "sonner"

export const PageHeader = React.memo(() => {
	const { me } = useAccount()
	const router = useRouter()

	if (!me) return null

	const handleClick = () => {
		try {
			const newPersonalPage = PersonalPage.create(
				{ public: false, createdAt: new Date(), updatedAt: new Date() },
				{ owner: me._owner }
			)
			me.root?.personalPages?.push(newPersonalPage)
			router.push(`/pages/${newPersonalPage.id}`)
		} catch (error) {
			toast.error("Failed to create page")
		}
	}

	return (
		<ContentHeader className="px-6 py-5 max-lg:px-4">
			<div className="flex min-w-0 shrink-0 items-center gap-1.5">
				<SidebarToggleButton />
				<div className="flex min-h-0 items-center">
					<span className="truncate text-left font-bold lg:text-xl">Pages</span>
				</div>
			</div>

			<div className="flex flex-auto"></div>

			<div className="flex w-auto items-center justify-end">
				<div className="flex items-center gap-2">
					<Button size="sm" type="button" variant="secondary" className="gap-x-2" onClick={handleClick}>
						<LaIcon name="Plus" />
						<span className="hidden md:block">New page</span>
					</Button>
				</div>
			</div>
		</ContentHeader>
	)
})

PageHeader.displayName = "PageHeader"
