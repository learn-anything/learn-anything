import GlobalTopic from "@/components/routes/globalTopic/globalTopic"

export default function GlobalTopicPage({ params }: { params: { topic: string } }) {
	return <GlobalTopic topic={params.topic} />
}
