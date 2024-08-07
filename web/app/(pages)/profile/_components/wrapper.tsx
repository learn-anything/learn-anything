"use client"

import { useAccount } from "@/lib/providers/jazz-provider"

export const ProfileWrapper = () => {
	const account = useAccount()

	return (
		<div>
			<h2>{account.me.profile?.name}</h2>
			<p>Profile Page</p>
		</div>
	)
}
