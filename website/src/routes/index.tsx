import { useNavigate } from "@solidjs/router"
import clsx from "clsx"
import { For, Match, Show, Switch, createSignal } from "solid-js"
import ProfileLink from "../../../shared/components/ProfileLink"
import Search from "../../../shared/components/Search"
import Topbar from "../../../shared/components/Topbar"
import * as gql from "../../../shared/graphql_solid"

export default function Home() {
	const [data, actions] = gql.useResource(gql.query_webIndex, {})

	const updateUserBio = gql.useRequest(gql.mutation_updateUserBio)

	const [newBio, setNewBio] = createSignal("")

	const [route, setRoute] = createSignal({
		userTopics: ["games", "phyiscs", "math", "sports"],
		shownTopic: "games",
		links: [
			{
				title: "games",
				url: "https://store.epicgames.com/en-US/",
			},
			{
				title: "math",
				url: "https://store.epicgames.com/en-US/",
			},
			{
				title: "sports",
				url: "https://store.epicgames.com/en-US/",
			},
		],
	})
	const [linkExpanded, setLinkExpanded] = createSignal("")
	const [showSearch, setShowSearch] = createSignal(false)

	return (
		<div class="w-full h-screen">
			<Switch fallback={<div>loading</div>}>
				<Match when={data().auth}>
					{(authData) => {
						return (
							<>
								<Sidebar
									topics={route().userTopics}
									setShowSearch={setShowSearch}
									showSearch={showSearch()}
									shownTopic={route().shownTopic}
								/>
								<div class="ml-[200px] h-full p-2 relative">
									<div class="border-[#191919]  h-full border rounded-[7px]">
										{/* <UserBio
			 bio={data.bio}
			 updateBio={async (newBio) => {
				await updateUserBio({ bio: newBio })
				actions.update
			 }}
			/> */}
										<Topbar
											// changeLearningStatus={async (status) => {
											//  const res = await updateLearningStatus({ topicName: "Solid", learningStatus: status })
											//  if (res instanceof Error) return
											//  actions.mutate((p) => ({
											//   ...p,
											//   showLinksStatus: status,
											//  }))
											//  console.log(res, "res")
											// }}
											changeLearningStatus={async (status: any) => {}}
											// showLinksStatus={route().showLinksStatus}
											showLinksStatus={"Learning"}
											// filterOrder={routeData()?.filterOrder}
											// filter={routeData()?.filter}
										/>
										<div class=" px-5 w-full  col-gap-[4px]">
											<For each={route().links}>
												{(link) => (
													<ProfileLink
														link={link}
														setLinkExpanded={setLinkExpanded}
														linkExpanded={linkExpanded()}
													/>
												)}
											</For>
										</div>
									</div>
									<Show when={showSearch()}>
										<Search
											links={route().links}
											setShowSearch={setShowSearch}
											showSearch={showSearch()}
										/>
									</Show>
								</div>
							</>
						)
					}}
				</Match>
				<Match when={data().public}>
					{(publicData) => {
						const navigate = useNavigate()
						return <>Force Graph</>
					}}
				</Match>
			</Switch>
		</div>
	)
}

function Sidebar(props: {
	topics?: string[]
	setShowSearch: (value: boolean) => void
	showSearch: boolean
	shownTopic: string
}) {
	return (
		<div class="fixed top-0 left-0 h-screen min-w-[200px] bg-dark text-textGray ">
			<div class="flex-between m-[20px] mr-[2px]">
				<div class="h-[40px] w-[40px] rounded-full bg-white"></div>
				<div
					class="px-[15px] h-[40px] flex-center rounded-[7px] text-white/30 bg-hoverDark "
					onClick={() => {
						props.setShowSearch(!props.showSearch)
					}}
				>
					{props.showSearch ? "Back" : "Search"}
				</div>
			</div>
			<div class="col-gap-[8px] pl-2">
				<div
					class={clsx(
						"cursor-pointer px-3 text-white/60 p-[6px] rounded-[7px] transition-all",
						props.shownTopic === "MyLinks" && "button",
					)}
				>
					My Links
				</div>
				<div class="">
					<div class="text-white/20 text-[14px] px-3 p-2">My Topics</div>
					<For each={props.topics}>
						{(topic) => {
							return (
								<div
									class={clsx(
										"text-white/60 px-3 p-[6px] cursor-pointer mb-[2px] hover:bg-hoverDark rounded-[7px] transition-all",
										props.shownTopic === topic && "button",
									)}
								>
									{topic}
								</div>
							)
						}}
					</For>
				</div>
			</div>
		</div>
	)
}
