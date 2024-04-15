import * as gql from "./graphql_queries.js"

const graphql_url = "http://127.0.0.1:4000/graphql"

async function raw_request<T = never>(query: string): Promise<T | Error> {
	try {
		const res = await fetch(graphql_url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: '{"query":' + JSON.stringify(query) + "}",
		})
		const json = await res.json()
		if (json.errors) {
			return new Error(json.errors[0].message)
		}
		return json.data
	} catch (err) {
		if (err instanceof Error) {
			return err
		}
		if (typeof err === "string") {
			return new Error(err)
		}
		return new Error("Unknown error")
	}
}

/*
For now cache is a in-memory map
Later it will be replaced by a IndexedDB store
*/
const cache = new Map<string, any>()

export function cache_get<T>(query: string): T | undefined {
	return cache.get(query)
}

export function cache_set<T>(query: string, value: T): void {
	cache.set(query, value)
}

type Operation = {
	name: string
	kind: gql.Operation_Kind
	query: string
	resolve: (res: any) => void
}

const operations_pending = new Map<string, Operation[]>()
let operations_scheduled = false

async function flush_operations(): Promise<void> {
	operations_scheduled = false

	const body = {
		query: "",
		mutation: "",
	}
	const operations_copy: Operation[] = []

	for (const operations of operations_pending.values()) {
		if (operations.length === 1) {
			const operation = operations[0]!
			body[operation.kind] += operation.query + "\n"
			operations_copy.push(operation)
		} else {
			/*
			Operations of the same name need to be renamed to avoid conflicts
			e.g.
			foo_bar:   foo_bar(){...}
			foo_bar_1: foo_bar(){...}
			foo_bar_2: foo_bar(){...}
			*/
			for (const operation of operations) {
				body[operation.kind] += operation.name + ":" + operation.query + "\n"
				operations_copy.push(operation)
			}
		}
	}
	operations_pending.clear()

	let query = ""
	if (body.query) query += "query" + "{" + body.query + "}"
	if (body.mutation) query += "mutation" + "{" + body.mutation + "}"

	const res = await raw_request<Record<string, any>>(query)
	if (res instanceof Error) {
		for (const operation of operations_copy) {
			operation.resolve(res)
		}
	} else {
		for (const operation of operations_copy) {
			const value = res[operation.name]
			operation.resolve(value)
		}
	}
}

export function schedule_operation<TValue>(
	name: string,
	kind: gql.Operation_Kind,
	query: string,
): Promise<TValue> {
	let resolve!: (res: TValue) => void
	const promise = new Promise<TValue>((res) => (resolve = res))

	const operation: Operation = { name, kind, query, resolve }

	const pending = operations_pending.get(name)
	if (pending) {
		operation.name = name + "_" + pending.length
		pending.push(operation)
	} else {
		operations_pending.set(name, [operation])
	}

	if (!operations_scheduled) {
		operations_scheduled = true
		queueMicrotask(flush_operations)
	}

	return promise
}
