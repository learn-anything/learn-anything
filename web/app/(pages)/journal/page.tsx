import { JournalRoute } from "@/components/routes/journal/JournalRoute"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { get } from "ronin"

export default async function JournalPage() {
	const user = await currentUser()
	const flag = await get.featureFlag.with.name("JOURNAL")

	if (!user?.emailAddresses.some(email => flag?.emails.includes(email.emailAddress))) {
		notFound()
	}

	return <JournalRoute />
}
