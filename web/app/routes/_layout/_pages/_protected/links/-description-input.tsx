import * as React from "react"
import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form"
import { TextareaAutosize } from "@/components/custom/textarea-autosize"
import { LinkFormValues } from "./-schema"

interface DescriptionInputProps {}

export const DescriptionInput: React.FC<DescriptionInputProps> = () => {
  const form = useFormContext<LinkFormValues>()

  return (
    <div>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="grow space-y-0">
            <FormLabel className="sr-only">Description</FormLabel>
            <FormControl>
              <TextareaAutosize
                {...field}
                autoComplete="off"
                placeholder="Description"
                className="resize-none overflow-y-auto border-none p-1.5 text-sm font-medium shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
