export default function LinkOptions() {
	const buttonClass = "block w-full px-4 py-2 rounded-lg text-left text-sm hover:bg-gray-700/20"

	return (
		<div className="absolute bottom-full left-0 mb-2 w-48 rounded-md bg-neutral-800/40 text-white shadow-lg dark:bg-neutral-800">
			<div>
				<button className={buttonClass}>Repeat...</button>
				<button className={buttonClass}>Duplicate</button>
				<button className={buttonClass}>Share...</button>
			</div>
		</div>
	)
}
