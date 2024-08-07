import { co } from "jazz-tools"
import type { JsonValue } from "cojson"

export type PersonalLinkType = {
	title: string
	url: string
	description: string
	note: string
	status: "Learning" | "Learned" | "To Learn"
	topic: string
	date: string
	dateAdded: string
}

export type TodoItem = {
	text: string
	done: boolean
}

export type User = {
	name: string
	username: string
	website: string
	bio: string
}

/*
 * Jazz-tools
 */
type Nullable<T> = T | null | undefined

export function nullable<T>(coType: co<T>): co<Nullable<T>> {
	return coType as co<Nullable<T>>
}

export function nullableLiteral<T extends (string | number | boolean)[]>(...lit: T): co<Nullable<T[number]>> {
	return nullable(co.literal(...lit))
}

type JsonNullable<T extends JsonValue> = T | null

export function nullableJson<T extends JsonValue>(): co<JsonNullable<T>> {
	return co.json<JsonNullable<T>>()
}
