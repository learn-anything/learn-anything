import { ContentHeader } from "@/components/custom/content-header"
import { Input } from "@/components/ui/input"

export const SearchHeader = () => {
	return (
		<ContentHeader>
			<Input placeholder="Search something..." />
		</ContentHeader>
	)
}
