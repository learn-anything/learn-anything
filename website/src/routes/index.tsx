import { useNavigate } from "@solidjs/router"
import clsx from "clsx"
import { For, Match, Show, Switch, createSignal } from "solid-js"
import ProfileLink from "../../../shared/components/ProfileLink"
import Search from "../../../shared/components/Search"
import Topbar from "../../../shared/components/Topbar"
import * as gql from "../../../shared/graphql_solid"

import Topic from "../../components/Topic"
import Profile from "../../components/Profile"
import { Motion, Presence } from "solid-motionone"
import Page from "../../components/Page"
import Icon from "../../../shared/components/Icon"

export default function Home() {
	const [data, actions] = gql.useResource(gql.query_webIndex, {})

	const updateUserBio = gql.useRequest(gql.mutation_updateUserBio)

	const [newBio, setNewBio] = createSignal("")

	const [route, setRoute] = createSignal({
		userTopics: ["games", "phyiscs", "math", "sports"],
		userPages: ["Mastering", "ADHD"],

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
		pages: [
			{
				title: "Mastering",
				description:
					"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis ullam, dicta rem quis esse, commodi maiores porro cumque eligendi veniam earum beatae cupiditate ab sit magni culpa, illum odit dolor?",
			},
			{
				title: "ADHD",
				description:
					"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis ullam, dicta rem quis esse, commodi maiores porro cumque eligendi veniam earum beatae cupiditate ab sit magni culpa, illum odit dolor?",
			},
		],
	})
	const [linkExpanded, setLinkExpanded] = createSignal("")

	const [currentPage, setCurrentPage] = createSignal("Page")
	const [mode, setMode] = createSignal("Topic")

	return (
		<div class="w-full h-screen">
			<Switch fallback={<div>loading</div>}>
				<Match when={data().auth}>
					{(authData) => {
						return (
							<>
								<Sidebar
									topics={route().userTopics}
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
	pages: string[]
	setMode: (value: string) => void
	mode: string
	currentPage: string
	setCurrentPage: (value: string) => void
}) {
	const [expanded, setExpanded] = createSignal(false)
	const [expandTimer, setExpandTimer] = createSignal(false)

	return (
		<div class="fixed top-0 left-0 flex flex-col justify-between h-screen min-w-[200px] bg-dark text-textGray ">
			<div>
				<div class="flex-between m-[20px] mr-[2px]">
					<div class="h-[40px] w-[40px] rounded-full bg-white"></div>
					<div
						class="px-[15px] h-[40px] flex-center rounded-[7px] text-white/30 bg-hoverDark "
						onClick={() => {
							props.setMode("Search")
						}}
					>
						{props.mode === "Search" ? "Back" : "Search"}
					</div>
				</div>
				<div class="col-gap-[8px] pl-2">
					<div
						class={clsx(
							"cursor-pointer px-3 text-white/60 p-[6px] rounded-[7px] transition-all",
							props.currentPage === "MyLinks" && "button",
						)}
						onClick={() => {
							props.setCurrentPage("MyLinks")
						}}
					>
						My Links
					</div>
					<div class="">
						<div class="flex-between text-white/40">
							<div class="text-white/20 text-[14px] px-3 p-2">Pages</div>
							<div
								onClick={() => {
									props.setMode("Page")
									props.setCurrentPage("")
								}}
							>
								<Icon name="Plus" />
							</div>
						</div>
						<For each={props.pages}>
							{(page) => {
								return (
									<div
										onClick={() => {
											props.setCurrentPage(page)
											props.setMode("Page")
										}}
										class={clsx(
											"text-white/60 px-3 p-[6px] cursor-pointer mb-[2px] hover:bg-hoverDark rounded-[7px] transition-all",
											props.currentPage === page && "button",
										)}
									>
										{page}
									</div>
								)
							}}
						</For>
					</div>
					<div class="">
						<div class="text-white/20 text-[14px] px-3 p-2">Topics</div>
						<For each={props.topics}>
							{(topic) => {
								return (
									<div
										onClick={() => {
											props.setMode("Topic")
											props.setCurrentPage(topic)
										}}
										class={clsx(
											"text-white/60 px-3 p-[6px] cursor-pointer mb-[2px] hover:bg-hoverDark rounded-[7px] transition-all",
											props.currentPage === topic && "button",
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
			<div
				class="relative"
				onClick={() => {
					setExpanded(!expanded())
				}}
				onMouseLeave={() => {
					setExpandTimer(true)
					setTimeout(() => {
						if (expandTimer()) {
							setExpanded(false)
						}
					}, 500)
				}}
				onMouseEnter={() => {
					setExpandTimer(false)
				}}
			>
				<div class="p-4">Profile</div>
				<Presence>
					<Show when={expanded()}>
						<Motion.div
							exit={{ opacity: 0, scale: 0.8 }}
							animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1] }}
							transition={{ duration: 0.2, easing: "ease-in" }}
							class="absolute bottom-12 w-full min-w-fit left-[6px] bg-hoverDark p-1 rounded-[7px]"
							style={{
								border: "1px solid #1E1E1E",
								background: "rgba(55, 55, 55, 0.40)",
								"backdrop-filter": "blur(8.5px)",
							}}
						>
							<div
								onClick={() => {
									props.setCurrentPage("Profile")
								}}
								class="rounded-[7px] h-[34px] cursor-pointer whitespace-nowrap px-[11px] flex items-center hover:bg-softDarkText/10 text-white/60"
							>
								Settings
							</div>
							<div class="rounded-[7px] h-[34px] cursor-pointer whitespace-nowrap px-[11px] flex items-center hover:bg-softDarkText/10 text-white/60">
								Support
							</div>
							<div class="rounded-[7px] h-[34px] cursor-pointer whitespace-nowrap px-[11px] flex items-center hover:bg-softDarkText/10 text-white/60">
								Sign out
							</div>
						</Motion.div>
					</Show>
				</Presence>
			</div>
		</div>
	)
}
