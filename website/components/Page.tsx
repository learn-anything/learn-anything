import { Show, createEffect } from "solid-js"
import { Motion } from "solid-motionone"

export default function Page(props: {
	page?: {
		title: string
		description: string
	}
}) {
	return (
		<div class="">
			<div class="flex-between  h-[74px] p-[20px] pr-[25px]">
				<Show
					when={!props.page}
					fallback={
						<Motion.div
							animate={{
								opacity: [0, 1],
								transform: ["translateX(10px)", "translateX(0)"],
							}}
							transition={{ duration: 1 }}
							class="text-[25px] font-bold"
						>
							{props.page?.title}
						</Motion.div>
					}
				>
					<input
						type="text"
						placeholder="Title"
						class="placeholder-white/20 font-bold text-[25px] bg-transparent outline-none"
					/>
				</Show>
				<div class="flex gap-[20px] flex-center">
					<div>vis</div>
					<div>...</div>
				</div>
			</div>
		</div>
	)
}
