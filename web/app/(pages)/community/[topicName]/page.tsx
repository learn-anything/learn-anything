import { CommunityTopicRoute } from "@/components/routes/community/CommunityTopicRoute"

export default function CommunityTopicPage({ params }: { params: { topicName: string } }) {
	return <CommunityTopicRoute topicName={params.topicName} />
}
