import * as react from "react"
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

export const GraphQLClientContext = react.createContext<GraphQLClient>(
	graphql_client_fallback,
)

/**
 * @param query_data a generated mutation
 * @returns a function to make the request
 *
 * @example
 * ```tsx
 * const links = gql.useResource(gql.query_routesProfile, {email: "example@fake.com"})
 *
 * return <>
 *    {links.map(link => <a href={link.url} key={link.id}>{link.title}</a>)}
 * </>
 * ```
 */
export function useResource<TVars, TValue>(
	query_data: gql.Query_Data<TVars, TValue>,
	vars: TVars,
): TValue {
	const client = react.useContext(GraphQLClientContext)

	const query = react.useMemo(() => query_data.get_body(vars), [vars])

	const [data, setData] = react.useState(() => {
		return cache_get<TValue>(query) ?? query_data.initial_value
	})

	react.useEffect(() => {
		const fetchData = async () => {
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
			setData(res)
		}

		fetchData()
	}, [query])

	return data
}

/**
 * @param query_data a generated mutation
 * @returns a function to make the request
 *
 * @example
 * ```tsx
 * const createUser = gql.useRequest(gql.mutation_createUser)
 *
 * const res = await createUser({email: "example@fake.com"
 * if (res instanceof Error) {
 *    console.error("Couldn't create a user:", res)
 * } else {
 *   console.log("User created:", res)
 * }
 * ```
 */
export function useRequest<TVars, TValue>(
	query_data: gql.Query_Data<TVars, TValue>,
) {
	const client = react.useContext(GraphQLClientContext)

	const callback = react.useCallback(
		async (vars: TVars) => {
			const res = await schedule_operation<TValue>(
				query_data.name,
				query_data.kind,
				query_data.get_body(vars),
			)
			if (res instanceof Error) {
				client.onError(res)
			}
			return res
		},
		[client, query_data],
	)

	return callback
}
