import { TopicDetailRoute } from "@/components/routes/topics/detail/TopicDetailRoute"

export default function DetailTopicPage({ params }: { params: { name: string } }) {
	return <TopicDetailRoute topicName={params.name} />
}
