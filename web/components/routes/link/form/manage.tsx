"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebounce } from "react-use"
import { toast } from "sonner"
import Image from "next/image"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from "@/components/ui/form"
import {
  BoxIcon,
  EllipsisIcon,
  HeartIcon,
  PlusIcon,
  Trash2Icon
} from "lucide-react"
import { cn, ensureUrlProtocol, isUrl as LibIsUrl } from "@/lib/utils"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { TodoItem, UserLink } from "@/lib/schema"
import { createLinkSchema } from "./schema"
import { TopicSelector } from "./partial/topic-section"
import { useAtom } from "jotai"
import { linkEditIdAtom, linkShowCreateAtom } from "@/store/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useKey } from "react-use"

export type LinkFormValues = z.infer<typeof createLinkSchema>

const DEFAULT_FORM_VALUES: Partial<LinkFormValues> = {
  title: "",
  description: "",
  topic: "",
  isLink: false,
  meta: null
}

export const LinkManage: React.FC = () => {
  const [showCreate, setShowCreate] = useAtom(linkShowCreateAtom)
  const [, setEditId] = useAtom(linkEditIdAtom)

  useEffect(() => {
    if (showCreate) {
      setEditId(null)
    }
  }, [showCreate])

  useKey("Escape", () => {
    setShowCreate(false)
  })

  return (
    <>
      {showCreate && (
        <CreateForm
          onSuccess={() => setShowCreate(false)}
          onCancel={() => setShowCreate(false)}
        />
      )}
      <CreateButton
        onClick={() => setShowCreate(!showCreate)}
        isOpen={showCreate}
      />
    </>
  )
}

const CreateButton: React.FC<{ onClick: () => void; isOpen: boolean }> = ({
  onClick,
  isOpen
}) => (
  <Button
    className={cn(
      "absolute bottom-4 right-4 size-12 rounded-full bg-[#274079] p-0 text-white transition-transform hover:bg-[#274079]/90",
      { "rotate-45 transform": isOpen }
    )}
    onClick={onClick}
  >
    <PlusIcon className="size-6" />
  </Button>
)

interface CreateFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onSuccess?: () => void
  onCancel?: () => void
  todoItem?: TodoItem
}

export const CreateForm = React.forwardRef<HTMLFormElement, CreateFormProps>(
  ({ onSuccess, onCancel, todoItem }, ref) => {
    const selectedTodo = useCoState(TodoItem, todoItem?.id)
    const [isFetching, setIsFetching] = useState(false)
    const { me } = useAccount()
    const form = useForm<LinkFormValues>({
      resolver: zodResolver(createLinkSchema),
      defaultValues: DEFAULT_FORM_VALUES
    })

    const title = form.watch("title")
    const [debouncedText, setDebouncedText] = useState<string>("")
    useDebounce(() => setDebouncedText(title), 300, [title])

    useEffect(() => {
      if (selectedTodo) {
        form.setValue("title", selectedTodo.title)
        form.setValue("description", selectedTodo.description ?? "")
        form.setValue("isLink", selectedTodo.isLink)
        form.setValue("meta", selectedTodo.meta)
      }
    }, [selectedTodo, form])

    useEffect(() => {
      const fetchMetadata = async (url: string) => {
        setIsFetching(true)
        try {
          const res = await fetch(
            `/api/metadata?url=${encodeURIComponent(url)}`,
            { cache: "force-cache" }
          )
          if (!res.ok) throw new Error("Failed to fetch metadata")
          const data = await res.json()
          form.setValue("isLink", true)
          form.setValue("meta", data)
          form.setValue("title", data.title)
          form.setValue("description", data.description)
        } catch (err) {
          toast.error("Link preview failed")
          form.setValue("isLink", false)
          form.setValue("meta", null)
          form.setValue("title", debouncedText)
          form.setValue("description", "")
        } finally {
          setIsFetching(false)
        }
      }

      const lowerText = debouncedText.toLowerCase()
      if (LibIsUrl(lowerText)) {
        fetchMetadata(ensureUrlProtocol(lowerText))
      }
    }, [debouncedText, form])

    const onSubmit = (values: LinkFormValues) => {
      if (isFetching) return

      try {
        let userLink: UserLink | undefined

        if (values.isLink && values.meta) {
          userLink = UserLink.create(values.meta, { owner: me._owner })
        }

        if (selectedTodo) {
          selectedTodo.title = values.title
          selectedTodo.description = values.description ?? ""
          selectedTodo.isLink = values.isLink
          if (selectedTodo.meta) {
            Object.assign(selectedTodo.meta, values.meta)
          }

          toast.success("Todo updated")
        } else {
          // Create new todo
          const newTodo = TodoItem.create(
            {
              title: values.title,
              description: values.description,
              sequence: me.root?.todos?.length || 1,
              completed: false,
              isLink: values.isLink,
              meta: userLink
              // topic: values.topic
            },
            { owner: me._owner }
          )

          me.root?.todos?.push(newTodo)

          toast.success("Todo created")
        }

        form.reset(DEFAULT_FORM_VALUES)
        onSuccess?.()
      } catch (error) {
        console.error("Failed to create/update todo", error)
        toast.error(
          todoItem ? "Failed to update todo" : "Failed to create todo"
        )
      }
    }

    const handleCancel: () => void = () => {
      form.reset(DEFAULT_FORM_VALUES)
      onCancel?.()
    }

    return (
      <div className="p-3 transition-all">
        <div className="rounded-md border border-primary/5 bg-primary/5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative min-w-0 flex-1"
              ref={ref}
            >
              <div className="flex flex-row p-3">
                <div className="flex flex-auto flex-col gap-1.5">
                  <div className="flex flex-row items-start justify-between">
                    <div className="flex grow flex-row items-center gap-1.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        aria-label="Choose icon"
                        className="size-7 text-primary/60"
                      >
                        {form.watch("isLink") ? (
                          <Image
                            src={form.watch("meta")?.favicon || ""}
                            alt={form.watch("meta")?.title || ""}
                            className="size-5 rounded-md"
                            width={16}
                            height={16}
                          />
                        ) : (
                          <BoxIcon size={16} />
                        )}
                      </Button>

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="grow space-y-0">
                            <FormLabel className="sr-only">Text</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                autoComplete="off"
                                maxLength={100}
                                autoFocus
                                placeholder="Paste a link or write a todo"
                                className="h-6 border-none p-1.5 font-medium placeholder:text-primary/40 focus-visible:outline-none focus-visible:ring-0"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex min-w-0 shrink-0 cursor-pointer select-none flex-row">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            type="button"
                            variant="ghost"
                            className="size-7 gap-x-2 text-sm"
                          >
                            <EllipsisIcon
                              size={16}
                              className="text-primary/60"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="group">
                            <Trash2Icon
                              size={16}
                              className="mr-2 text-destructive group-hover:text-red-500"
                            />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="size-7 gap-x-2 text-sm"
                      >
                        <HeartIcon size={16} className="text-primary/60" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-1.5 pl-8">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="grow space-y-0">
                          <FormLabel className="sr-only">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              autoComplete="off"
                              placeholder="Description (optional)"
                              className="h-6 border-none p-1.5 text-xs font-medium placeholder:text-primary/40 focus-visible:outline-none focus-visible:ring-0"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-auto flex-row items-center justify-between gap-2 border-t border-primary/5 px-3 py-2">
                <div className="flex flex-row items-center gap-0.5">
                  <div className="flex min-w-0 shrink-0 cursor-pointer select-none flex-row">
                    <TopicSelector />
                  </div>
                </div>
                <div className="flex w-auto items-center justify-end">
                  <div className="flex min-w-0 shrink-0 cursor-pointer select-none flex-row gap-x-2">
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" disabled={isFetching}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    )
  }
)
