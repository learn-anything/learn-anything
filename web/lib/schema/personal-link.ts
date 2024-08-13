import { Account, co, CoList, CoMap, Encoders, Group, ID } from "jazz-tools"
import { GlobalTopic } from "./global-topic"

// BaseModel class with common fields
class BaseModel extends CoMap {
	createdAt = co.encoded(Encoders.Date)
	updatedAt = co.encoded(Encoders.Date)
}

// PersonalLink class extending BaseModel
export class PersonalLink extends BaseModel {
	url = co.string
	title = co.string
	slug = co.string
	description = co.optional.string
	completed = co.boolean
	sequence = co.number
	learningState = co.optional.literal("wantToLearn", "learning", "learned")
	notes = co.optional.string
	summary = co.optional.string
	topic = co.optional.ref(GlobalTopic)
}

// PersonalLinkLists class with null-safe typing
export class PersonalLinkLists extends CoList.Of(co.ref(PersonalLink)) {}

// Factory function for creating PersonalLink instances
export function createPersonalLink(
	data: Partial<PersonalLink> & Pick<PersonalLink, "url" | "title" | "completed">,
	owner: Account | Group
): PersonalLink {
	const now = new Date()
	return PersonalLink.create(
		{
			...data,
			slug: SlugManager.getUniqueSlug("PersonalLink", data.title),
			sequence: getNextSequence(owner.personalLinks),
			createdAt: now,
			updatedAt: now
		},
		{ owner: owner._owner }
	)
}

function getNextSequence(list: PersonalLinkLists): number {
	return list.length
}

export function updatePersonalLink(link: PersonalLink, data: Partial<PersonalLink>): void {
	Object.assign(link, { ...data, updatedAt: new Date() })
}

// Factory function for creating PersonalLinkLists instances
export function createPersonalLinkList(owner: { group: any }): PersonalLinkLists {
	return PersonalLinkLists.create([], { owner: owner.group })
}

// Helper functions for list operations
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

// Helper function to safely access PersonalLink properties
export function safelyAccessPersonalLink<T>(
	link: PersonalLink | null | undefined,
	accessor: (link: PersonalLink) => T,
	defaultValue: T
): T {
	return link ? accessor(link) : defaultValue
}
