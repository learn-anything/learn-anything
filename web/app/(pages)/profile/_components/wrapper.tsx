"use client"

import { useAccount } from "@/lib/providers/jazz-provider"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { LaIcon } from "@/components/custom/la-icon"
import { Icon } from "@/components/la-editor/components/ui/icon"
import { Button } from "@/components/ui/button"

interface ProfileStatsProps {
	number: number
	label: string
}

interface ProfileLinksProps {
	linklabel?: string
	link?: string
	topic?: string
}

interface ProfilePagesProps {
	topic?: string
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ number, label }) => {
	return (
		<div className="text-center font-semibold text-black/60 dark:text-white">
			<p className="text-4xl">{number}</p>
			<p className="text-[#878787]">{label}</p>
		</div>
	)
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ linklabel, link, topic }) => {
	return (
		<div className="flex flex-row items-center justify-between bg-[#121212] p-3 text-black dark:text-white">
			<div className="flex flex-row items-center space-x-3">
				<p className="text-base text-opacity-90">{linklabel || "Untitled"}</p>
				<div className="flex cursor-pointer flex-row items-center gap-1">
					<Icon name="Link" />
					<p className="text-sm text-opacity-10">{link || "#"}</p>
				</div>
			</div>
			<div className="text0opacity-50 bg-[#1a1a1a] p-2">{topic || "Uncategorized"}</div>
		</div>
	)
}

const ProfilePages: React.FC<ProfilePagesProps> = ({ topic }) => {
	return (
		<div className="flex flex-row items-center justify-between rounded-lg bg-[#121212] p-3 text-black dark:text-white">
			<div className="rounded-lg bg-[#1a1a1a] p-2 text-opacity-50">{topic || "Uncategorized"}</div>
		</div>
	)
}

export const ProfileWrapper = () => {
	const account = useAccount()
	const params = useParams()
	const username = params.username as string

	const router = useRouter()

	const clickEdit = () => router.push("/edit-profile")

	if (!account.me || !account.me.profile) {
		return (
			<div className="flex h-screen flex-col py-3 text-black dark:text-white">
				<div className="flex flex-1 flex-col rounded-3xl border border-neutral-800">
					<p className="my-10 h-[74px] border-b border-neutral-900 text-center text-2xl font-semibold">
						Oops! This account doesn&apos;t exist.
					</p>
					<p className="mb-5 text-center text-lg font-semibold">Try searching for another.</p>
					<p className="mb-5 text-center text-lg font-semibold">
						The link you followed may be broken, or the page may have been removed. Go back to
						<Link href="/">
							<span className="">homepage</span>
						</Link>
						.
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-1 flex-col text-black dark:text-white">
			<div className="flex items-center justify-between p-[20px]">
				<p className="text-2xl font-semibold">Profile</p>
				<Button
					onClick={clickEdit}
					className="shadow-outer ml-auto flex h-[34px] cursor-pointer flex-row space-x-2 rounded-lg bg-white px-3 text-black shadow-[1px_1px_1px_1px_rgba(0,0,0,0.3)] hover:bg-black/10 dark:bg-[#222222] dark:text-white dark:hover:opacity-60"
				>
					<LaIcon name="UserCog" className="text-foreground cursor-pointer" />
					<span>Edit Profile</span>
				</Button>
			</div>
			<p className="text-2xl font-semibold">{username}</p>
			<div className="flex flex-col items-center border-b border-neutral-900 bg-inherit pb-5">
				<div className="flex w-full max-w-2xl align-top">
					<div className="mr-3 h-[130px] w-[130px] rounded-md bg-[#222222]" />
					<div className="ml-6 flex-1">
						<p className="mb-3 text-[25px] font-semibold">{account.me.profile.name}</p>
						<div className="mb-1 flex flex-row items-center font-light text-[24]">
							@<p className="pl-1">{account.me.root?.username}</p>
						</div>
						<a href={account.me.root?.website || "#"} className="mb-1 flex flex-row items-center text-sm font-light">
							<Icon name="Link" />
							<p className="pl-1">{account.me.root?.website}</p>
						</a>
					</div>
					<button className="shadow-outer ml-auto flex h-[34px] cursor-pointer flex-row items-center justify-center space-x-2 rounded-lg bg-white px-3 text-center font-medium text-black shadow-[1px_1px_1px_1px_rgba(0,0,0,0.3)] hover:bg-black/10 dark:bg-[#222222] dark:text-white dark:hover:opacity-60">
						Follow
					</button>
				</div>
			</div>
			<div className="mt-10 flex justify-center">
				<div className="flex flex-row gap-20">
					<ProfileStats number={account.me.root?.topicsLearning?.length || 0} label="Learning" />
					<ProfileStats number={account.me.root?.topicsWantToLearn?.length || 0} label="To Learn" />
					<ProfileStats number={account.me.root?.topicsLearned?.length || 0} label="Learned" />
				</div>
			</div>

			{/* <div className="mx-auto mt-10 w-[50%] justify-center space-y-1">
				<p className="pb-3 pl-2 text-base font-light text-white/50">Public Pages</p>
				{account.me.root?.personalPages?.map((page, index) => <ProfileLinks topic={page.topic?.name} />)}
			</div>
			<div className="mx-auto mt-10 w-[50%] justify-center space-y-1">
				<p className="pb-3 pl-2 text-base font-light text-white/50">Public Links</p>
				{account.me.root?.personalLinks?.map((link, index) => (
					<ProfileLinks key={index} linklabel={link.title} link={link.url} topic={link.topic?.name} />
				))}
			</div> */}
		</div>
	)
}
