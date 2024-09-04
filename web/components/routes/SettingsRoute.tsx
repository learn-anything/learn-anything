"use client"
import { useAccount } from "@/lib/providers/jazz-provider"

export const SettingsRoute = () => {
	const { me } = useAccount()

	return (
		<div className="flex flex-1 flex-col text-sm text-black dark:text-white">
			<p className="h-[74px] p-[20px] text-2xl font-semibold opacity-80">Settings</p>
			<div className="flex flex-col items-center border-b border-neutral-900 bg-inherit pb-5"></div>
		</div>
	)
}
