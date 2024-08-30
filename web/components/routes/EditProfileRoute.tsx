"use client"
import { useAccount } from "@/lib/providers/jazz-provider"

export default function EditProfileRoute() {
	const account = useAccount()

	return (
		<div className="flex flex-1 flex-col text-sm text-black dark:text-white">
			<p className="h-[74px] p-[20px] text-2xl font-semibold opacity-60">Edit Profile</p>
			<div className="flex flex-col items-center border-b border-neutral-900 bg-inherit pb-5">
				<div className="flex w-full max-w-2xl align-top">
					<button className="bg-input mr-3 h-[130px] w-[130px] flex-col items-center justify-center rounded-xl border border-dashed border-black/10 bg-neutral-100 dark:border-white/10">
						<p className="text-sm tracking-wide">Photo</p>
					</button>
					<div className="ml-6 flex-1 space-y-4">
						<input
							type="text"
							placeholder="Your name"
							className="bg-input w-full rounded-md p-3 tracking-wide outline-none"
						/>
						<input
							type="text"
							placeholder="Username"
							className="bg-input w-full rounded-md p-3 tracking-wide outline-none"
						/>
						<p className="text-white/30">learn-anything.xyz/@</p>
						<input
							type="text"
							placeholder="Website"
							className="bg-input tracking-wideoutline-none w-full rounded-md p-3"
						/>
						<textarea
							placeholder="Bio"
							className="bg-input h-[120px] w-full rounded-md p-3 text-left tracking-wide outline-none"
						/>
						<button className="bg-input mt-4 w-[120px] rounded-md px-3 py-2 tracking-wide outline-none hover:opacity-60">
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
