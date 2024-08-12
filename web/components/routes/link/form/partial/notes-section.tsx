import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { LinkFormValues } from "../link-form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"

export const NotesSection: React.FC = () => {
	const form = useFormContext<LinkFormValues>()

	return (
		<FormField
			control={form.control}
			name="notes"
			render={({ field }) => (
				<FormItem className="relative space-y-0">
					<FormLabel className="sr-only">Note</FormLabel>
					<FormControl>
						<>
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<LaIcon name="Pencil" aria-hidden="true" className="text-muted-foreground/70 size-3.5" />
							</div>

							<Input
								{...field}
								autoComplete="off"
								placeholder="Take a note..."
								className={cn(
									"placeholder:text-muted-foreground/70 border-none pl-10 shadow-none focus-visible:ring-0"
								)}
							/>
						</>
					</FormControl>
				</FormItem>
			)}
		/>
	)
}
