import { PageDetailRoute } from "@/components/routes/page/detail/PageDetailRoute"

export default function DetailPage({ params }: { params: { id: string } }) {
	return <PageDetailRoute pageId={params.id} />
}
