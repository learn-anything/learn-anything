"use client"

import { useAccount } from "@/lib/providers/jazz-provider"

export default function TauriRoute() {
	const { me } = useAccount()

	console.log({ pages: me?.root?.personalPages?.toJSON() })

	return <div>{JSON.stringify(me?.root?.personalPages)}</div>
}
