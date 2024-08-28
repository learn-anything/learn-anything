import { co, CoList, CoMap, Encoders, ID } from "jazz-tools"
import { Link, Topic } from "./master/topic"

class BaseModel extends CoMap {
	createdAt = co.encoded(Encoders.Date)
	updatedAt = co.encoded(Encoders.Date)
}

export class PersonalLink extends BaseModel {
	url = co.string
	icon = co.optional.string // is an icon URL
	link = co.optional.ref(Link)
	title = co.string
	slug = co.string
	description = co.optional.string
	completed = co.boolean
	sequence = co.number
	learningState = co.optional.literal("wantToLearn", "learning", "learned")
	notes = co.optional.string
	summary = co.optional.string
	topic = co.optional.ref(Topic)
}

export class PersonalLinkLists extends CoList.Of(co.ref(PersonalLink)) {}

export function updatePersonalLink(link: PersonalLink, data: Partial<PersonalLink>): void {
	Object.assign(link, { ...data, updatedAt: new Date() })
}

export function createPersonalLinkList(owner: { group: any }): PersonalLinkLists {
	return PersonalLinkLists.create([], { owner: owner.group })
}

export function addToPersonalLinkList(list: PersonalLinkLists, item: PersonalLink): void {
	list.push(item)
}

export function removeFromPersonalLinkList(list: PersonalLinkLists, id: ID<PersonalLink>): void {
	const index = list.findIndex(item => item?.id === id)
	if (index !== -1) {
		list.splice(index, 1)
	}
}

export function updateInPersonalLinkList(
	list: PersonalLinkLists,
	id: ID<PersonalLink>,
	data: Partial<PersonalLink>
): void {
	const item = list.find(item => item?.id === id)
	if (item) {
		Object.assign(item, { ...data, updatedAt: new Date() })
	}
}

export function getFromPersonalLinkList(
	list: PersonalLinkLists,
	id: ID<PersonalLink>
): PersonalLink | null | undefined {
	return list.find(item => item?.id === id)
}

export function safelyAccessPersonalLink<T>(
	link: PersonalLink | null | undefined,
	accessor: (link: PersonalLink) => T,
	defaultValue: T
): T {
	return link ? accessor(link) : defaultValue
}
