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
	DialogPrimitive
} from "@/components/ui/dialog"
import { LaIcon } from "@/components/custom/la-icon"
import { MinimalTiptapEditor } from "@/components/minimal-tiptap"
import { useState } from "react"
import { Content } from "@tiptap/react"
import { cn } from "@/lib/utils"

export function Feedback() {
	const [value, setValue] = useState<Content>("")

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="icon" className="shrink-0" variant="ghost">
					<LaIcon name="CircleHelp" />
				</Button>
			</DialogTrigger>

			<DialogPortal>
				<DialogOverlay />
				<DialogPrimitive.Content
					className={cn(
						"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
						"flex flex-col p-4 sm:max-w-2xl"
					)}
				>
					<DialogHeader>
						<DialogTitle>Share feedback</DialogTitle>
						<DialogDescription className="sr-only">
							Your feedback helps us improve. Please share your thoughts, ideas, and suggestions
						</DialogDescription>
					</DialogHeader>

					<MinimalTiptapEditor
						value={value}
						onChange={setValue}
						throttleDelay={500}
						className="border-muted-foreground/50 mt-2 min-h-52 rounded-lg"
						editorContentClassName="p-4 overflow-auto flex grow"
						output="html"
						placeholder="Your feedback helps us improve. Please share your thoughts, ideas, and suggestions."
						autofocus={true}
						immediatelyRender={true}
						editable={true}
						injectCSS={true}
						editorClassName="focus:outline-none"
					/>

					<DialogFooter>
						<DialogPrimitive.Close className={buttonVariants({ variant: "outline" })}>Cancel</DialogPrimitive.Close>
						<Button type="submit">Send feedback</Button>
					</DialogFooter>
				</DialogPrimitive.Content>
			</DialogPortal>
		</Dialog>
	)
}
