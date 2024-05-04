import { Match, Show, Switch, createSignal } from "solid-js"
import * as gql from "../../../shared/graphql_solid"
import { Sidebar } from "../../components/Sidebar"
import Icon from "../../components/Icon"
import clsx from "clsx"

interface Local {
	learningStatusFilter: "learning" | "toLearn" | "learned" | "all"
	filterByLiked: boolean
	sortBy: "custom" | "recentlyAdded"
	filterByTopic?: string
	payPlsModal: boolean
}
export default function Home() {
	const [data, actions] = gql.useResource(gql.query_webIndex, {})
	const [local, setLocal] = createSignal<Local>({
		learningStatusFilter: "learning",
		filterByLiked: false,
		sortBy: "custom",
		payPlsModal: false,
	})
	const [showPlusbar, setShowPlusBar] = createSignal(false)

	return (
		<div class="w-full h-screen">
			<div
				onClick={() => {
					setShowPlusBar(true)
				}}
				class={clsx(
					"absolute bottom-5 rounded-full transition-all bg-blue-500 right-5",
					showPlusbar() && "rotate-90",
				)}
			>
				<Icon name="Plus" />
				<Show when={showPlusbar()}>
					<div class="absolute bottom-0 right-0 bg-blue-500 w-[200px] h-[400px] rounded-[11px]"></div>
				</Show>
			</div>

			<Switch fallback={<div>loading</div>}>
				<Match when={data().auth}>
					{(authData) => {
						return (
							<>
								<Sidebar
									personalPages={authData().personalPages}
									// currentPage={currentPage()}
									// setCurrentPage={setCurrentPage}
									// setMode={setMode}
									// mode={mode()}
								/>
								{/* <div class="ml-[200px] h-full p-2 relative">
									<div class="border-[#191919]  h-full border rounded-[7px]">
										<Switch>
											<Match when={mode() === "Topic"}>
												<Topic
													route={route()}
													linkExpanded={linkExpanded()}
													setLinkExpanded={setLinkExpanded}
												/>
											</Match>
											<Match when={mode() === "Profile"}>
												<Profile />
											</Match>
											<Match when={mode() === "Page"}>
												<Page
													page={
														currentPage() !== ""
															? route().pages[
																	route().pages.findIndex((page: any) => {
																		if (currentPage() !== "") {
																			return page.title === currentPage()
																		}
																	})
																]
															: undefined
													}
												/>
											</Match>
										</Switch>
									</div>
									<Show when={mode() === "Search"}>
										<Search
											links={route().links}
											setMode={setMode}
											mode={mode()}
										/>
									</Show>
								</div> */}
							</>
						)
					}}
				</Match>
				<Match when={data().public}>
					{(publicData) => {
						return <>Force Graph</>
					}}
				</Match>
			</Switch>
		</div>
	)
}
