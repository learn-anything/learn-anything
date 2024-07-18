import { LearnDetailWrapper } from "./_components/wrapper"

export default function LearnDetailPage({
  params
}: {
  params: { slug: string }
}) {
  return <LearnDetailWrapper slug={params.slug} />
}
