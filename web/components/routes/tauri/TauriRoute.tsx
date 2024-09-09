"use client"

import { useAccount } from "@/lib/providers/jazz-provider"

export default function TauriRoute() {
	const { me } = useAccount()

	return <div>{JSON.stringify(me?.root?.personalPages)}</div>
}
