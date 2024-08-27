import { Button } from "../ui/button"

export default function SettingsRoute() {
	return (
		<div className="flex flex-1 flex-col">
			<p className="h-[74px] p-[20px] text-2xl font-semibold text-white/30">Settings</p>
			<div className="flex flex-col space-y-4 p-[20px]">
				<button className="text-foreground bg-foreground/50 w-full max-w-[300px] rounded-lg p-2">
					Settings button for something
				</button>
			</div>
		</div>
	)
}
