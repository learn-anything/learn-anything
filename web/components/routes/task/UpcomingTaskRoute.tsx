import { TaskRoute } from "@/components/routes/task/TaskRoute"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { get } from "ronin"

export default async function UpcomingTasksPage() {
	const user = await currentUser()
	const flag = await get.featureFlag.with.name("TASK")

	if (!user?.emailAddresses.some(email => flag?.emails.includes(email.emailAddress))) {
		notFound()
	}

	return <TaskRoute filter="upcoming" />
}
