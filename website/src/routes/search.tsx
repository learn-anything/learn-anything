import { Match, Switch, createEffect, onMount } from "solid-js"
import * as gql from "../../../shared/graphql_solid"
import { Sidebar } from "../../components/Sidebar"
import { useNavigate } from "@solidjs/router"

export default function Search() {
	const [data, actions] = gql.useResource(gql.query_webSearch, {})
	createEffect(() => {
		console.log(data())
	})
	return (
		<div class="w-full h-screen">
			<Switch fallback={<div>loading</div>}>
				<Match when={data().auth}>
					{(authData) => {
						return (
							<>
								<Sidebar personalPages={authData().personalPages} />
							</>
						)
					}}
				</Match>
				<Match when={data().public}>
					{(publicData) => {
						const navigate = useNavigate()
						onMount(() => {
							navigate("/auth")
						})
						return <></>
					}}
				</Match>
			</Switch>
		</div>
	)
}
