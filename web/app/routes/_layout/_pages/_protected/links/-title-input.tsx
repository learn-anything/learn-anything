import * as React from "react"
import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LinkFormValues } from "./-schema"

interface TitleInputProps {
  urlFetched: string | null
}

export const TitleInput: React.FC<TitleInputProps> = ({ urlFetched }) => {
  const form = useFormContext<LinkFormValues>()

  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem className="grow space-y-0">
          <FormLabel className="sr-only">Title</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={urlFetched ? "text" : "hidden"}
              autoComplete="off"
              maxLength={100}
              autoFocus
              placeholder="Title"
              className="h-8 border-none p-1.5 text-[15px] font-semibold shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
