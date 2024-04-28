import { Match, Switch, createSignal } from "solid-js"
import * as gql from "../../../../shared/graphql_solid.js"
import UserBio from "../../../components/UserBio.jsx"

// only available in `local` env
export default function LocalTest() {
	if (!(import.meta.env.VITE_ENV === "local")) {
		return <></>
	}
	const [data, actions] = gql.useResource(gql.query_localTest, {})
	const [local, setLocal] = createSignal<{}>({})

	return (
		<div class="w-full h-screen">
			<Switch fallback={<div>loading</div>}>
				<Match when={data().auth}>
					{(authData) => {
						console.log(authData())
						return (
							<>
								<UserBio
									bio={authData().bio!}
									updateBio={async (newBio) => {
										console.log(newBio, "new")
										const updateUserBio = gql.useRequest(
											gql.mutation_updateUserBio,
										)
										await updateUserBio({ bio: newBio })
										actions.mutate((p) => {
											if (!p.auth) return p
											return {
												...p,
												auth: {
													...p.auth,
													bio: newBio,
												},
											}
										})
									}}
								/>
							</>
						)
					}}
				</Match>
				<Match when={data().public}>
					{(publicData) => {
						console.log(publicData())
						return <>public page</>
					}}
				</Match>
			</Switch>
		</div>
	)
}
