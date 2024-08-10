"use client"

import * as React from "react"
import { ListFilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ContentHeader, SidebarToggleButton } from "@/components/custom/content-header"
import { useMedia } from "react-use"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAtom } from "jotai"
import { linkSortAtom } from "@/store/link"

interface TabItemProps {
	url: string
	label: string
}

const TABS = ["All", "Learning", "To Learn", "Learned"]

export const LinkHeader = () => {
	const isTablet = useMedia("(max-width: 1024px)")

	return (
		<>
			<ContentHeader className="p-4">
				<div className="flex min-w-0 shrink-0 items-center gap-1.5">
					<SidebarToggleButton />
					<div className="flex min-h-0 items-center">
						<span className="truncate text-left text-xl font-bold">Links</span>
					</div>
				</div>

				{!isTablet && <Tabs />}

				<div className="flex flex-auto"></div>

				<FilterAndSort />
			</ContentHeader>

			{isTablet && (
				<div className="border-b-primary/5 flex min-h-10 flex-row items-start justify-between border-b px-6 py-2 max-lg:pl-4">
					<Tabs />
				</div>
			)}
		</>
	)
}

const Tabs = () => {
	const [activeTab, setActiveTab] = React.useState(TABS[0])

	return (
		<div className="bg-secondary/50 flex items-baseline overflow-x-hidden rounded-md">
			{TABS.map(tab => (
				<TabItem key={tab} url="#" label={tab} isActive={activeTab === tab} onClick={() => setActiveTab(tab)} />
			))}
		</div>
	)
}

interface TabItemProps {
	url: string
	label: string
	isActive: boolean
	onClick: () => void
}

const TabItem = ({ url, label, isActive, onClick }: TabItemProps) => {
	return (
		<div tabIndex={-1} className="rounded-md">
			<div className="flex flex-row">
				<div aria-label={label}>
					<Link href={url}>
						<Button
							size="sm"
							type="button"
							variant="ghost"
							className={`gap-x-2 truncate text-sm ${isActive ? "bg-accent text-accent-foreground" : ""}`}
							onClick={onClick}
						>
							{label}
						</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}

const FilterAndSort = () => {
	const [sort, setSort] = useAtom(linkSortAtom)

	const getFilterText = () => {
		return sort.charAt(0).toUpperCase() + sort.slice(1)
	}

	return (
		<div className="flex w-auto items-center justify-end">
			<div className="flex items-center gap-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button size="sm" type="button" variant="secondary" className="gap-x-2 text-sm">
							<ListFilterIcon size={16} className="text-primary/60" />
							<span className="hidden md:block">Filter: {getFilterText()}</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-72" align="end">
						<div className="flex flex-col">
							<div className="flex min-w-8 flex-row items-center">
								<Label>Sort by</Label>
								<div className="flex flex-auto flex-row items-center justify-end">
									<Select value={sort} onValueChange={setSort}>
										<SelectTrigger className="h-6 w-auto">
											<SelectValue placeholder="Select"></SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="title">Title</SelectItem>
											<SelectItem value="manual">Manual</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	)
}
