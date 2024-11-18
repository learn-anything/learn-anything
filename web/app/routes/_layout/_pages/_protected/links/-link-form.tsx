import * as React from "react"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { PersonalLink, Topic } from "@/lib/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createLinkSchema, LinkFormValues } from "./-schema"
import { cn, ensureUrlProtocol, generateUniqueSlug } from "@/lib/utils"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { atom, useAtom } from "jotai"
import { linkLearningStateSelectorAtom } from "@/store/link"
import { FormField, FormItem, FormLabel } from "@/components/ui/form"
import { LearningStateSelector } from "@/components/custom/learning-state-selector"
import { JAZZ_GLOBAL_GROUP_ID } from "@/lib/constants"
import { TitleInput } from "./-title-input"
import { UrlInput } from "./-url-input"
import { DescriptionInput } from "./-description-input"
import { UrlBadge } from "./-url-badge"
import { NotesSection } from "./-notes-section"
import { useOnClickOutside } from "~/hooks/use-on-click-outside"
import {
  TopicSelector,
  topicSelectorAtom,
} from "~/components/custom/topic-selector"
import { createServerFn } from "@tanstack/start"
import { urlSchema } from "~/lib/utils/schema"
import * as cheerio from "cheerio"

interface Metadata {
  title: string
  description: string
  icon: string | null
  url: string
}

const DEFAULT_VALUES = {
  TITLE: "",
  DESCRIPTION: "",
  FAVICON: null,
}

export const globalLinkFormExceptionRefsAtom = atom<
  React.RefObject<HTMLElement>[]
>([])

export const getMetadata = createServerFn()
  .validator((url: string) => url)
  .handler(async ({ data: url }) => {
    if (!url) {
      return new Response('Missing "url" query parameter', {
        status: 400,
      })
    }

    const result = urlSchema.safeParse(decodeURIComponent(url))

    if (!result.success) {
      throw new Error(
        result.error.issues.map((issue) => issue.message).join(", "),
      )
    }

    url = ensureUrlProtocol(decodeURIComponent(url))

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.text()
      const $ = cheerio.load(data)

      const metadata: Metadata = {
        title:
          $("title").text() ||
          $('meta[property="og:title"]').attr("content") ||
          DEFAULT_VALUES.TITLE,
        description:
          $('meta[name="description"]').attr("content") ||
          $('meta[property="og:description"]').attr("content") ||
          DEFAULT_VALUES.DESCRIPTION,
        icon:
          $('link[rel="icon"]').attr("href") ||
          $('link[rel="shortcut icon"]').attr("href") ||
          DEFAULT_VALUES.FAVICON,
        url: url,
      }

      if (metadata.icon && !metadata.icon.startsWith("http")) {
        metadata.icon = new URL(metadata.icon, url).toString()
      }

      return metadata
    } catch (error) {
      console.error("Error fetching metadata:", error)
      const defaultMetadata: Metadata = {
        title: DEFAULT_VALUES.TITLE,
        description: DEFAULT_VALUES.DESCRIPTION,
        icon: DEFAULT_VALUES.FAVICON,
        url: url,
      }
      return defaultMetadata
    }
  })

interface LinkFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onClose?: () => void
  onSuccess?: () => void
  onFail?: () => void
  personalLink?: PersonalLink
  exceptionsRefs?: React.RefObject<HTMLElement>[]
}

const defaultValues: Partial<LinkFormValues> = {
  url: "",
  icon: "",
  title: "",
  description: "",
  completed: false,
  notes: "",
  learningState: undefined,
  topic: null,
}

export const LinkForm: React.FC<LinkFormProps> = ({
  onSuccess,
  onFail,
  personalLink,
  onClose,
  exceptionsRefs = [],
}) => {
  const [istopicSelectorOpen] = useAtom(topicSelectorAtom)
  const [islearningStateSelectorOpen] = useAtom(linkLearningStateSelectorAtom)
  const [globalExceptionRefs] = useAtom(globalLinkFormExceptionRefsAtom)

  const formRef = React.useRef<HTMLFormElement>(null)

  const [isFetching, setIsFetching] = React.useState(false)
  const [urlFetched, setUrlFetched] = React.useState<string | null>(null)
  const { me } = useAccount({ root: { personalLinks: [{}] } })
  const selectedLink = useCoState(PersonalLink, personalLink?.id)

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(createLinkSchema),
    defaultValues,
    mode: "all",
  })

  const topicName = form.watch("topic")
  const findTopic = React.useMemo(
    () => me && Topic.findUnique({ topicName }, JAZZ_GLOBAL_GROUP_ID, me),
    [topicName, me],
  )

  const selectedTopic = useCoState(Topic, findTopic, {})

  const allExceptionRefs = React.useMemo(
    () => [...exceptionsRefs, ...globalExceptionRefs],
    [exceptionsRefs, globalExceptionRefs],
  )

  useOnClickOutside(formRef, (event) => {
    if (
      !istopicSelectorOpen &&
      !islearningStateSelectorOpen &&
      !allExceptionRefs.some((ref) =>
        ref.current?.contains(event.target as Node),
      )
    ) {
      onClose?.()
    }
  })

  React.useEffect(() => {
    if (selectedLink) {
      setUrlFetched(selectedLink.url)
      form.reset({
        url: selectedLink.url,
        icon: selectedLink.icon,
        title: selectedLink.title,
        description: selectedLink.description,
        completed: selectedLink.completed,
        notes: selectedLink.notes,
        learningState: selectedLink.learningState,
        topic: selectedLink.topic?.name,
      })
    }
  }, [selectedLink, selectedLink?.topic, form])

  const fetchMetadata = async (url: string) => {
    setIsFetching(true)
    try {
      const data = await getMetadata({ data: encodeURIComponent(url) })
      setUrlFetched(data.url)
      form.setValue("url", data.url, {
        shouldValidate: true,
      })
      form.setValue("icon", data.icon ?? "", {
        shouldValidate: true,
      })
      form.setValue("title", data.title, {
        shouldValidate: true,
      })
      if (!form.getValues("description"))
        form.setValue("description", data.description, {
          shouldValidate: true,
        })
      form.setFocus("title")
    } catch (err) {
      console.error("Failed to fetch metadata", err)
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = (values: LinkFormValues) => {
    if (isFetching || !me) return

    try {
      const slug = generateUniqueSlug(values.title)

      if (selectedLink) {
        if (!selectedTopic) {
          selectedLink.applyDiff({
            ...values,
            slug,
            updatedAt: new Date(),
            topic: null,
          })
        } else {
          selectedLink.applyDiff({
            ...values,
            slug,
            topic: selectedTopic,
            updatedAt: new Date(),
          })
        }
      } else {
        const newPersonalLink = PersonalLink.create(
          {
            ...values,
            slug,
            topic: selectedTopic,
            sequence: me.root?.personalLinks?.length || 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { owner: me._owner },
        )
        me.root?.personalLinks?.push(newPersonalLink)
      }
      form.reset(defaultValues)
      onSuccess?.()
    } catch (error) {
      onFail?.()
      console.error("Failed to create/update link", error)
      toast.error(
        personalLink ? "Failed to update link" : "Failed to create link",
      )
    }
  }

  const handleCancel = () => {
    form.reset(defaultValues)
    onClose?.()
  }

  const handleResetUrl = () => {
    setUrlFetched(null)
    form.setFocus("url")
    form.reset({ url: "", title: "", icon: "", description: "" })
  }

  const canSubmit = form.formState.isValid && !form.formState.isSubmitting

  return (
    <div
      tabIndex={-1}
      className="p-3 transition-all"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          handleCancel()
        }
      }}
    >
      <div
        className={cn(
          "relative rounded-md border bg-muted/30",
          isFetching && "opacity-50",
        )}
      >
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative min-w-0 flex-1"
          >
            {isFetching && (
              <div
                className="absolute inset-0 z-10 bg-transparent"
                aria-hidden="true"
              />
            )}
            <div className="flex flex-col gap-1.5 p-3">
              <div className="flex flex-row items-start justify-between">
                <UrlInput
                  urlFetched={urlFetched}
                  fetchMetadata={fetchMetadata}
                  isFetchingUrlMetadata={isFetching}
                />
                {urlFetched && <TitleInput urlFetched={urlFetched} />}

                <div className="flex flex-row items-center gap-2">
                  <FormField
                    control={form.control}
                    name="learningState"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel className="sr-only">Topic</FormLabel>
                        <LearningStateSelector
                          value={field.value}
                          onChange={(value) => {
                            form.setValue(
                              "learningState",
                              field.value === value ? undefined : value,
                            )
                          }}
                          showSearch={false}
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel className="sr-only">Topic</FormLabel>
                        <TopicSelector
                          {...field}
                          renderSelectedText={() => (
                            <span className="truncate">
                              {selectedTopic?.prettyName || "Topic"}
                            </span>
                          )}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DescriptionInput />
              <UrlBadge
                urlFetched={urlFetched}
                handleResetUrl={handleResetUrl}
              />
            </div>

            <div className="flex flex-row items-center justify-between gap-2 rounded-b-md border-t px-3 py-2">
              <NotesSection />

              {isFetching ? (
                <div className="flex w-auto items-center justify-end gap-x-2">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Fetching metadata...
                  </span>
                </div>
              ) : (
                <div className="flex w-auto items-center justify-end gap-x-2">
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" disabled={!canSubmit}>
                    Save
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

LinkForm.displayName = "LinkForm"
