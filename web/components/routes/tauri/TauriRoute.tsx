"use client"

import { useAccount } from "@/lib/providers/jazz-provider"
import { open } from "@tauri-apps/plugin-dialog"

export default function TauriRoute() {
	const { me } = useAccount()

	// console.log({ pages: me?.root?.personalPages?.toJSON() })

	return (
		<div className="mb-5 flex flex-col">
			<button
				onClick={async () => {
					const folderPath = await open({
						multiple: false,
						directory: true
					})
					console.log(folderPath)
				}}
			>
				Connect folder
			</button>
			{/* TODO: loads a lot more data than expected */}
			{/* {JSON.stringify(me?.root?.personalPages)} */}
		</div>
	)
}
