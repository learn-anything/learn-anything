import { co, CoList, CoMap } from "jazz-tools"
import { nullable } from "../types"
import { GlobalLink } from "./global-link"
import { GlobalTopic } from "./global-topic"

export class LinkMetadata extends CoMap {
	url = co.string
	title = co.string
	favicon = co.string
	description = nullable(co.string)
}

/*
 * Link is link user added, it wraps over Link and lets user add notes and other things to it,
 * (as well as set own title/description/summary if GlobalLink ones is not good enough or is lacking)
 */
export class PersonalLink extends CoMap {
	title = co.string
	slug = co.string
	description = nullable(co.string)
	completed = co.boolean
	sequence = co.number
	isLink = co.boolean
	meta = co.optional.ref(LinkMetadata)

	// not yet implemented
	learningState = co.optional.literal("wantToLearn", "learning", "learned")
	notes = co.optional.string
	summary = co.optional.string
	globalLink = co.optional.ref(GlobalLink)
	topic = co.optional.ref(GlobalTopic)
}

export class PersonalLinkLists extends CoList.Of(co.ref(PersonalLink)) {}
