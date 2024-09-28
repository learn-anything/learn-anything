"use client"

import { useCallback, useRef, useEffect } from "react"
import { ID } from "jazz-tools"
import { PersonalPage } from "@/lib/schema"
import { LAEditor, LAEditorRef } from "@/components/la-editor"
import { Content, EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@/components/la-editor/extensions/starter-kit"
import { Paragraph } from "@/components/la-editor/extensions/paragraph"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { EditorView } from "@tiptap/pm/view"
import { Editor } from "@tiptap/core"
import { generateUniqueSlug } from "@/lib/utils"
import { FocusClasses } from "@tiptap/extension-focus"
import { DetailPageHeader } from "./header"
import { useMedia } from "@/hooks/use-media"
import { TopicSelector } from "@/components/custom/topic-selector"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { useConfirm } from "@omit/react-confirm-dialog"
import { useRouter } from "next/navigation"
import { usePageActions } from "../hooks/use-page-actions"

const TITLE_PLACEHOLDER = "Untitled"

export function PageDetailRoute({ pageId }: { pageId: string }) {
	const { me } = useAccount({ root: { personalLinks: [] } })
	const isMobile = useMedia("(max-width: 770px)")
	const page = useCoState(PersonalPage, pageId as ID<PersonalPage>)
	const router = useRouter()
	const { deletePage } = usePageActions()
	const confirm = useConfirm()

	const handleDelete = useCallback(async () => {
		const result = await confirm({
			title: "Delete page",
			description: "Are you sure you want to delete this page?",
			confirmText: "Delete",
			cancelText: "Cancel",
			cancelButton: { variant: "outline" },
			confirmButton: { variant: "destructive" }
		})

		if (result && me?.root.personalPages) {
			deletePage(me, pageId as ID<PersonalPage>)
			router.push("/pages")
		}
	}, [confirm, deletePage, me, pageId, router])

	if (!page) return null

	return (
		<div className="absolute inset-0 flex flex-row overflow-hidden">
			<div className="flex h-full w-full">
				<div className="relative flex min-w-0 grow basis-[760px] flex-col">
					<DetailPageHeader page={page} handleDelete={handleDelete} isMobile={isMobile} />
					<DetailPageForm page={page} />
				</div>
				{!isMobile && <SidebarActions page={page} handleDelete={handleDelete} />}
			</div>
		</div>
	)
}

const SidebarActions = ({ page, handleDelete }: { page: PersonalPage; handleDelete: () => void }) => (
	<div className="relative min-w-56 max-w-72 border-l">
		<div className="flex">
			<div className="flex h-10 flex-auto flex-row items-center justify-between px-5">
				<span className="text-left text-[13px] font-medium">Page actions</span>
			</div>
			<div className="absolute bottom-0 left-0 right-0 top-10 space-y-3 overflow-y-auto px-4 py-1.5">
				<div className="flex flex-row">
					<TopicSelector
						value={page.topic?.name}
						onTopicChange={topic => {
							page.topic = topic
							page.updatedAt = new Date()
						}}
						variant="ghost"
						className="-ml-1.5"
						renderSelectedText={() => <span className="truncate">{page.topic?.prettyName || "Select a topic"}</span>}
					/>
				</div>
				<div className="flex flex-row">
					<Button size="sm" variant="ghost" onClick={handleDelete} className="-ml-1.5">
						<LaIcon name="Trash" className="mr-2 size-3.5" />
						<span className="text-sm">Delete</span>
					</Button>
				</div>
			</div>
		</div>
	</div>
)

const DetailPageForm = ({ page }: { page: PersonalPage }) => {
	const titleEditorRef = useRef<Editor | null>(null)
	const contentEditorRef = useRef<LAEditorRef>(null)
	const isTitleInitialMount = useRef(true)
	const isContentInitialMount = useRef(true)
	const isInitialFocusApplied = useRef(false)

	const updatePageContent = useCallback((content: Content, model: PersonalPage) => {
		if (isContentInitialMount.current) {
			isContentInitialMount.current = false
			return
		}
		model.content = content
		model.updatedAt = new Date()
	}, [])

	const handleUpdateTitle = useCallback(
		(editor: Editor) => {
			if (isTitleInitialMount.current) {
				isTitleInitialMount.current = false
				return
			}

			const newTitle = editor.getText()
			if (newTitle !== page.title) {
				const slug = generateUniqueSlug(page.title?.toString() || "")
				page.title = newTitle
				page.slug = slug
				page.updatedAt = new Date()
			}
		},
		[page]
	)

	const handleTitleKeyDown = useCallback((view: EditorView, event: KeyboardEvent) => {
		const editor = titleEditorRef.current
		if (!editor) return false

		const { state } = editor
		const { selection } = state
		const { $anchor } = selection

		switch (event.key) {
			case "ArrowRight":
			case "ArrowDown":
				if ($anchor.pos === state.doc.content.size - 1) {
					event.preventDefault()
					contentEditorRef.current?.editor?.commands.focus("start")
					return true
				}
				break
			case "Enter":
				if (!event.shiftKey) {
					event.preventDefault()
					contentEditorRef.current?.editor?.commands.focus("start")
					return true
				}
				break
		}
		return false
	}, [])

	const handleContentKeyDown = useCallback((view: EditorView, event: KeyboardEvent) => {
		const editor = contentEditorRef.current?.editor
		if (!editor) return false

		const { state } = editor
		const { selection } = state
		const { $anchor } = selection

		if ((event.key === "ArrowLeft" || event.key === "ArrowUp") && $anchor.pos - 1 === 0) {
			event.preventDefault()
			titleEditorRef.current?.commands.focus("end")
			return true
		}
		return false
	}, [])

	const titleEditor = useEditor({
		immediatelyRender: false,
		extensions: [
			FocusClasses,
			Paragraph,
			StarterKit.configure({
				bold: false,
				italic: false,
				typography: false,
				hardBreak: false,
				listItem: false,
				strike: false,
				focus: false,
				gapcursor: false,
				placeholder: { placeholder: TITLE_PLACEHOLDER }
			})
		],
		editorProps: {
			attributes: {
				spellcheck: "true",
				role: "textbox",
				"aria-readonly": "false",
				"aria-multiline": "false",
				"aria-label": TITLE_PLACEHOLDER,
				translate: "no",
				class: "focus:outline-none"
			},
			handleKeyDown: handleTitleKeyDown
		},
		onCreate: ({ editor }) => {
			if (page.title) editor.commands.setContent(`<p>${page.title}</p>`)
		},
		onBlur: ({ editor }) => handleUpdateTitle(editor),
		onUpdate: ({ editor }) => handleUpdateTitle(editor)
	})

	useEffect(() => {
		if (titleEditor) {
			titleEditorRef.current = titleEditor
		}
	}, [titleEditor])

	useEffect(() => {
		isTitleInitialMount.current = true
		isContentInitialMount.current = true

		if (!isInitialFocusApplied.current && titleEditor && contentEditorRef.current?.editor) {
			isInitialFocusApplied.current = true
			if (!page.title) {
				titleEditor?.commands.focus()
			} else {
				contentEditorRef.current.editor.commands.focus()
			}
		}
	}, [page.title, titleEditor])

	return (
		<div className="relative flex grow flex-col overflow-y-auto [scrollbar-gutter:stable]">
			<div className="relative mx-auto flex h-full w-[calc(100%-80px)] shrink-0 grow flex-col max-lg:w-[calc(100%-40px)] max-lg:max-w-[unset]">
				<form className="flex shrink-0 flex-col">
					<div className="mb-2 mt-8 py-1.5">
						<EditorContent
							editor={titleEditor}
							className="la-editor no-command grow cursor-text select-text text-2xl font-semibold leading-[calc(1.33333)] tracking-[-0.00625rem]"
						/>
					</div>
					<div className="flex flex-auto flex-col">
						<div className="relative flex h-full max-w-full grow flex-col items-stretch p-0">
							<LAEditor
								ref={contentEditorRef}
								editorClassName="-mx-3.5 px-3.5 py-2.5 flex-auto focus:outline-none"
								value={page.content}
								placeholder="Add content..."
								output="json"
								throttleDelay={3000}
								onUpdate={c => updatePageContent(c, page)}
								handleKeyDown={handleContentKeyDown}
								onBlur={c => updatePageContent(c, page)}
								onNewBlock={c => updatePageContent(c, page)}
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
