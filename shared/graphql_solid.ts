import * as s from "solid-js"
import * as gql from "./graphql_queries.js"

import { cache_get, cache_set, schedule_operation } from "./graphql_client"

export * from "./graphql_queries.js"

export type GraphQLClient = {
	onError: (err: Error) => void
}

const graphql_client_fallback: GraphQLClient = {
	onError: (err: Error) => {
		console.error(err)
	},
}
export const GraphQLClientContext = s.createContext<GraphQLClient>(
	graphql_client_fallback,
)

/**
 * @example
 * ```tsx
 * const [links] = gql.useResource(gql.query_routesProfile, {email: "example@fake.com"})
 *
 * <For each={links()}>
 *     {(link) => <a href={link.url}>{link.title}</a>}
 * </For>
 * ```
 */
export function useResource<TVars, TValue>(
	query_data: gql.Query_Data<TVars, TValue>,
	vars: TVars, // Vars cannot be reactive, because they are used as a cache key
): s.InitializedResourceReturn<TValue> {
	const client = s.useContext(GraphQLClientContext)

	const query = query_data.get_body(vars)
	const initial_value = cache_get<TValue>(query) ?? query_data.initial_value

	return s.createResource(
		async () => {
			const res = await schedule_operation<TValue>(
				query_data.name,
				query_data.kind,
				query,
			)
			if (res instanceof Error) {
				client.onError(res)
				throw res
			}
			cache_set(query, res)
			return res
		},
		{
			initialValue: initial_value,
		},
	) as any
}

/**
 * @example
 * ```tsx
 * const createUser = gql.useRequest(gql.mutation_createUser)
 *
 * const res = await createUser({email: "example@fake.com"})
 * if (res instanceof Error) {
 *     console.error("Couldn't create a user:", res)
 * } else {
 *     console.log("New user:", res)
 * }
 * ```
 */
export function useRequest<TVars, TValue>(
	query_data: gql.Query_Data<TVars, TValue>,
): (vars: TVars) => Promise<TValue | Error> {
	const client = s.useContext(GraphQLClientContext)

	return async function (vars) {
		const res = await schedule_operation<TValue>(
			query_data.name,
			query_data.kind,
			query_data.get_body(vars),
		)
		if (res instanceof Error) {
			client.onError(res)
		}
		return res
	}
}
