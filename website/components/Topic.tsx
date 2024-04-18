import { For, Show } from "solid-js"
import Topbar from "../../shared/components/Topbar"
import Search from "../../shared/components/Search"
import ProfileLink from "./ProfileLink"

export default function Topic(props: {
	route: any

	linkExpanded: string
	setLinkExpanded: (value: string) => void
}) {
	return (
		<div>
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
				<For each={props.route.links}>
					{(link) => (
						<ProfileLink
							link={link}
							setLinkExpanded={props.setLinkExpanded}
							linkExpanded={props.linkExpanded}
						/>
					)}
				</For>
			</div>
		</div>
	)
}
