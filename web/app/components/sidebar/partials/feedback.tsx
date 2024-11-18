import * as React from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogPrimitive,
} from "@/components/ui/dialog"
import { LaIcon } from "@/components/custom/la-icon"
import { MinimalTiptapEditor } from "@shared/minimal-tiptap"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Spinner } from "@/components/custom/spinner"
import { Editor } from "@tiptap/react"
import { createServerFn } from "@tanstack/start"
import { clerkClient, getAuth } from "@clerk/tanstack-start/server"
import { create } from "ronin"
import { getWebRequest } from "vinxi/http"

export const sendFeedbackFn = createServerFn({ method: "POST" })
  .validator((content: string) => content)
  .handler(async ({ data }) => {
    const auth = await getAuth(getWebRequest())

    if (!auth.userId) {
      throw new Error("User not authenticated")
    }

    const user = await clerkClient({
      telemetry: { disabled: true },
    }).users.getUser(auth.userId)
    await create.feedback.with({
      message: data,
      emailFrom: user.emailAddresses[0].emailAddress,
    })
  })

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Feedback cannot be empty",
  }),
})

export function Feedback() {
  const [open, setOpen] = useState(false)
  const editorRef = useRef<Editor | null>(null)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  const handleCreate = React.useCallback(
    ({ editor }: { editor: Editor }) => {
      if (form.getValues("content") && editor.isEmpty) {
        editor.commands.setContent(form.getValues("content"))
      }
      editorRef.current = editor
    },
    [form],
  )

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsPending(true)
      await sendFeedbackFn({ data: values.content })

      form.reset({ content: "" })
      editorRef.current?.commands.clearContent()

      setOpen(false)
      toast.success("Feedback sent")
    } catch (error) {
      toast.error("Failed to send feedback")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="shrink-0" variant="ghost">
          <LaIcon name="CircleHelp" />
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            "flex flex-col p-4 sm:max-w-2xl",
          )}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader className="mb-5">
                <DialogTitle>Share feedback</DialogTitle>
                <DialogDescription className="sr-only">
                  Your feedback helps us improve. Please share your thoughts,
                  ideas, and suggestions
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Content</FormLabel>
                    <FormControl>
                      <MinimalTiptapEditor
                        {...field}
                        throttleDelay={500}
                        className={cn(
                          "min-h-52 rounded-lg border-muted-foreground/40 focus-within:border-muted-foreground/80",
                          {
                            "border-destructive focus-within:border-destructive":
                              form.formState.errors.content,
                          },
                        )}
                        editorContentClassName="p-4 overflow-auto flex grow"
                        output="html"
                        placeholder="Your feedback helps us improve. Please share your thoughts, ideas, and suggestions."
                        autofocus={true}
                        onCreate={handleCreate}
                        editorClassName="focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <DialogPrimitive.Close
                  className={buttonVariants({ variant: "outline" })}
                >
                  Cancel
                </DialogPrimitive.Close>
                <Button type="submit">
                  {isPending ? (
                    <>
                      <Spinner className="mr-2" />
                      <span>Sending feedback...</span>
                    </>
                  ) : (
                    "Send feedback"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
