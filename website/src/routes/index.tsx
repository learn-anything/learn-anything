import { useNavigate } from "@solidjs/router"
import { For, Match, Switch, createSignal } from "solid-js"
import Button from "../../../shared/components/Button"
import Topbar from "../../../shared/components/Topbar"
import ProfileLink from "../../../shared/components/ProfileLink"
import * as gql from "../../../shared/graphql_solid"
import Search from "../../../shared/components/Search"

export default function Home() {
	const [data, actions] = gql.useResource(gql.query_webIndex, {})
	const updateUserBio = gql.useRequest(gql.mutation_updateUserBio)

	const [newBio, setNewBio] = createSignal("")

	const [route, setRoute] = createSignal({
		userTopics: ["games", "phyiscs", "math", "sports"],
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

	return (
		<div class="w-full h-screen">
			<Switch fallback={<div>loading</div>}>
				<Match when={data().auth}>
					{(auth) => (
						<>
							<Sidebar topics={route().userTopics} />
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
								<Search links={route().links} />
							</div>
						</>
					)}
				</Match>
				<Match when={data().public}>{(dataPublic) => <>Force Graph</>}</Match>
			</Switch>
		</div>
	)
}

function Sidebar(props: { topics?: string[] }) {
	return (
		<div class="fixed top-0 left-0 h-screen min-w-[200px] bg-dark text-textGray ">
			<div class="h-[40px] w-[40px] rounded-full bg-white m-[20px]"></div>
			<div class="col-gap-[8px] pl-2">
				<div class="w-full">
					<Button label="My Links" />
				</div>
				<div class="">
					<div class="text-white/20 text-[14px] px-3 p-2">My Topics</div>
					<For each={props.topics}>
						{(topic) => {
							return (
								<div class="text-white/60 px-3 p-2 cursor-pointer hover:bg-hoverDark rounded-[7px] transition-all">
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
