"use client"

import { useAccount } from "@/lib/providers/jazz-provider"

export default function EditProfileRoute() {
	const account = useAccount()

	return (
		<div className="flex flex-1 flex-col">
			<p className="h-[74px] p-[20px] text-2xl font-semibold text-white/30">Profile</p>
			<div className="flex flex-col items-center border-b border-neutral-900 bg-inherit pb-5 text-white">
				<div className="flex w-full max-w-2xl align-top">
					<button className="mr-3 h-[130px] w-[130px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-neutral-100 text-white/50 dark:bg-neutral-900">
						<p className="text-sm tracking-wide">Photo</p>
					</button>
					<div className="ml-6 flex-1 space-y-4 font-light">
						<input
							type="text"
							placeholder="Your name"
							className="w-full rounded-md bg-[#121212] p-3 font-light tracking-wide text-white/70 placeholder-white/20 outline-none"
						/>
						<input
							type="text"
							placeholder="Username"
							className="w-full rounded-md bg-[#121212] p-3 tracking-wide text-white/70 placeholder-white/20 outline-none"
						/>
						<p className="text-white/30">learn-anything.xyz/@</p>
						<input
							type="text"
							placeholder="Website"
							className="w-full rounded-md bg-[#121212] p-3 tracking-wide text-white/30 placeholder-white/20 outline-none"
						/>
						<textarea
							placeholder="Bio"
							className="h-[120px] w-full rounded-md bg-[#121212] p-3 text-left font-light tracking-wide text-white/30 placeholder-white/20 outline-none"
						/>
						<button className="mt-4 w-[120px] rounded-md bg-[#222222] px-3 py-2 font-light tracking-wide text-white/70 outline-none hover:opacity-60">
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
