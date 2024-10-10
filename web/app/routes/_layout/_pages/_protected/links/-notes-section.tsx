import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import { LinkFormValues } from "./-schema"

export const NotesSection: React.FC = () => {
  const form = useFormContext<LinkFormValues>()

  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem className="relative grow space-y-0">
          <FormLabel className="sr-only">Note</FormLabel>
          <FormControl>
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LaIcon
                  name="Pencil"
                  aria-hidden="true"
                  className="text-muted-foreground/70"
                />
              </div>

              <Input
                {...field}
                autoComplete="off"
                placeholder="Notes"
                className={cn(
                  "border-none pl-8 shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0",
                )}
              />
            </>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
