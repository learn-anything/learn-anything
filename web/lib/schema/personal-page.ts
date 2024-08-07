import { co, CoList, CoMap } from "jazz-tools"
import { GlobalTopic } from "./global-topic"

/*
 * Page, content that user can write to. Similar to Notion/Reflect page. It holds ProseMirror editor content + metadata.
 * - slug: make it unique
 * - Public Access, url should be learn-anything.xyz/@user/slug
 * - if public, certain members (can do read/write access accordingly), personal (end to end encrypted, only accessed by user)
 */
export class PersonalPage extends CoMap {
	title = co.string
	slug = co.string
	content = co.optional.json()
	topic = co.optional.ref(GlobalTopic)
	// backlinks = co.optional.ref() // other PersonalPages linking to this page TODO: add, think through how to do it well, efficiently
}

export class PersonalPageLists extends CoList.Of(co.ref(PersonalPage)) {}
