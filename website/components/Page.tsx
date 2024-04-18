import { Show } from "solid-js"

export default function Page(props: {
	page:
		| {
				title: string
				description: string
		  }
		| undefined
}) {
	return (
		<div class="">
			<div class="flex-between  h-[74px] p-[20px] pr-[25px]">
				<Show
					when={props.page.title === undefined}
					fallback={<div class="text-[25px] font-bold">{props.page.title}</div>}
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
