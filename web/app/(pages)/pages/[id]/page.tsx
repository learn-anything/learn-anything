import { DetailPageWrapper } from "@/components/routes/page/detail/wrapper"

export default function DetailPage({ params }: { params: { id: string } }) {
	return <DetailPageWrapper pageId={params.id} />
}
