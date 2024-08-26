import { LaIcon } from "@/components/custom/la-icon"

export default function LinkOptions() {
	const buttonClass =
		"block w-full flex flex-row items-center px-4 py-2 rounded-lg text-left text-sm hover:bg-gray-700/20"

	return (
		<div className="absolute bottom-full left-0 mb-2 w-48 rounded-md bg-neutral-800/40 text-white shadow-lg dark:bg-neutral-800">
			<div>
				<button className={buttonClass}>
					<LaIcon name="Repeat2" className="mr-2" />
					Repeat
				</button>
				<button className={buttonClass}>
					<LaIcon name="Layers2" className="mr-2" />
					Duplicate
				</button>
				<button className={buttonClass}>
					<LaIcon name="Share" className="mr-2" />
					Share
				</button>
			</div>
		</div>
	)
}
