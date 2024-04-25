import { Match, Switch, createSignal } from "solid-js"
import * as gql from "../../../shared/graphql_solid"

interface Local {
	learningStatusFilter: "learning" | "toLearn" | "learned" | "all"
	filterByLiked: boolean
	sortBy: "custom" | "recentlyAdded"
	filterByTopic?: string
}
export default function Home() {
	const [data, actions] = gql.useResource(gql.query_webIndex, {})
	const [local, setLocal] = createSignal<Local>({
		learningStatusFilter: "learning",
		filterByLiked: false,
		sortBy: "custom",
	})

	return (
		<div class="w-full h-screen">
			<Switch fallback={<div>loading</div>}>
				<Match when={data().auth}>
					{(authData) => {
						return (
							<>
								{/* <Button label="Update user bio" onChange={async () => {}} /> */}
								{/* <Sidebar
									topics={authData().topicsLearned}
									pages={route().userPages}
									setMode={setMode}
									mode={mode()}
									currentPage={currentPage()}
									setCurrentPage={setCurrentPage}
								/>
								<div class="ml-[200px] h-full p-2 relative">
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
