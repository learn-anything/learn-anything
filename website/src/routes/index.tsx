// TODO: make it work like kuskus server components (https://github.com/kuskusapp/kuskus/blob/main/app/%5Bprofile%5D/page.tsx)
// TODO: make edgedb-auth-solid work (i.e. existing packages: https://github.com/edgedb/edgedb-js/tree/master/packages)
// TODO: sessions, auth, server actions (auth query, public query)
export default function Home() {
	// const session = auth.getSession()
	// const client = session.client
	// const authenticated = await session.isSignedIn()

	return (
		<div class="w-full h-screen">
			{/* <Switch fallback={<div>loading</div>}>
				<Match when={data().auth}>
					{(authData) => {
						return <></>
					}}
				</Match>
				<Match when={data().public}>
					{(publicData) => {
						return <></>
					}}
				</Match>
			</Switch> */}
		</div>
	)
}

// TODO: move once above works like KusKus server components!
// TODO: make work like in kuskus server components
// https://discord.com/channels/722131463138705510/910635844119982080/1236210923262185495
// const getServerState = async () => {
// 	"use server"
// 	return await getUser("nikita@nikiv.dev")
// }
// const [serverState, setServerState] = createSignal()
// onMount(async () => {
// 	setServerState(await getServerState())
// })

// interface Local {
// 	learningStatusFilter: "learning" | "toLearn" | "learned" | "all"
// 	filterByLiked: boolean
// 	sortBy: "custom" | "recentlyAdded"
// 	filterByTopic?: string
// 	payPlsModal: boolean
// }

// const [local, setLocal] = createSignal<any>({
// 	learningStatusFilter: "learning",
// 	filterByLiked: false,
// 	sortBy: "custom",
// })
// const [showPlusbar, setShowPlusBar] = createSignal(false)
// <div
// 	onClick={() => {
// 		setShowPlusBar(true)
// 	}}
// 	class={clsx(
// 		"absolute bottom-5 rounded-full transition-all bg-blue-500 right-5",
// 		showPlusbar() && "rotate-90",
// 	)}
// >
// 	<Icon name="Plus" />
// 	<Show when={showPlusbar()}>
// 		<div class="absolute bottom-0 right-0 bg-blue-500 w-[200px] h-[400px] rounded-[11px]"></div>
// 	</Show>
// </div>

// <Sidebar
// 	personalPages={authData().personalPages}
// 	// currentPage={currentPage()}
// 	// setCurrentPage={setCurrentPage}
// 	// setMode={setMode}
// 	// mode={mode()}
// />
// {/* <div class="ml-[200px] h-full p-2 relative">
// 	<div class="border-[#191919]  h-full border rounded-[7px]">
// 		<Switch>
// 			<Match when={mode() === "Topic"}>
// 				<Topic
// 					route={route()}
// 					linkExpanded={linkExpanded()}
// 					setLinkExpanded={setLinkExpanded}
// 				/>
// 			</Match>
// 			<Match when={mode() === "Profile"}>
// 				<Profile />
// 			</Match>
// 			<Match when={mode() === "Page"}>
// 				<Page
// 					page={
// 						currentPage() !== ""
// 							? route().pages[
// 									route().pages.findIndex((page: any) => {
// 										if (currentPage() !== "") {
// 											return page.title === currentPage()
// 										}
// 									})
// 								]
// 							: undefined
// 					}
// 				/>
// 			</Match>
// 		</Switch>
// 	</div>
// 	<Show when={mode() === "Search"}>
// 		<Search
// 			links={route().links}
// 			setMode={setMode}
// 			mode={mode()}
// 		/>
// 	</Show>
// </div> */}
