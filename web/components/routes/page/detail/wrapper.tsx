"use client"

import * as React from "react"
import { useAtom } from "jotai"
import { ID } from "jazz-tools"
import { PersonalPage, Topic } from "@/lib/schema"
import { useCallback, useRef, useEffect, useState } from "react"
import { LAEditor, LAEditorRef } from "@/components/la-editor"
import { Content, EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@/components/la-editor/extensions/starter-kit"
import { Paragraph } from "@/components/la-editor/extensions/paragraph"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { toast } from "sonner"
import { EditorView } from "@tiptap/pm/view"
import { Editor } from "@tiptap/core"
import { generateUniqueSlug } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { pageTopicSelectorAtom } from "@/store/page"
import { TopicSelector } from "@/components/routes/link/form/partial/topic-selector"
import DeletePageModal from "@/components/custom/delete-modal"

const TITLE_PLACEHOLDER = "Untitled"

export function DetailPageWrapper({ pageId }: { pageId: string }) {
	const page = useCoState(PersonalPage, pageId as ID<PersonalPage>)

	if (!page) return <div>Loading...</div>

	return (
		<div className="flex flex-row">
			<div className="flex h-full w-full">
				<div className="relative flex min-w-0 grow basis-[760px] flex-col">
					<DetailPageForm page={page} />
				</div>
			</div>
		</div>
	)
}

export const DetailPageForm = ({ page }: { page: PersonalPage }) => {
	const { me } = useAccount()
	const titleEditorRef = useRef<Editor | null>(null)
	const contentEditorRef = useRef<LAEditorRef>(null)
	const [, setTopicSelectorOpen] = useAtom(pageTopicSelectorAtom)
	const [selectedPageTopic, setSelectedPageTopic] = useState<Topic | null>(page.topic || null)
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)

	const updatePageContent = (content: Content, model: PersonalPage) => {
		model.content = content
	}

	const handleTitleBlur = (editor: Editor) => {
		const newTitle = editor.getText().trim()

		if (!newTitle) {
			toast.error("Update failed", {
				description: "Title must be longer than or equal to 1 character"
			})
			editor.commands.setContent(page.title || "")
			return
		}

		if (newTitle === page.title) return

		const personalPages = me.root?.personalPages?.toJSON() || []
		const slug = generateUniqueSlug(personalPages, page.slug || "")

		const trimmedTitle = editor.getText().trim()
		page.title = trimmedTitle
		page.slug = slug

		editor.commands.setContent(trimmedTitle)
	}

	const handleTitleKeyDown = useCallback((view: EditorView, event: KeyboardEvent) => {
		const editor = titleEditorRef.current
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

	const handleContentKeyDown = useCallback((view: EditorView, event: KeyboardEvent) => {
		const editor = contentEditorRef.current?.editor
		if (!editor) return false
		const { state } = editor
		const { selection } = state
		const { $anchor } = selection
		return false
	}, [])

	const confirmDelete = (page: PersonalPage) => {
		console.log("Deleting page:", page.id)
		setDeleteModalOpen(false)
		//TODO: add delete logic
	}

	const titleEditor = useEditor({
		immediatelyRender: false,
		extensions: [
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
				history: false,
				placeholder: {
					placeholder: TITLE_PLACEHOLDER
				}
			})
		],
		editorProps: {
			attributes: {
				spellcheck: "true",
				role: "textbox",
				"aria-readonly": "false",
				"aria-multiline": "false",
				"aria-label": TITLE_PLACEHOLDER,
				translate: "no"
			},
			handleKeyDown: handleTitleKeyDown
		},
		onCreate: ({ editor }) => {
			if (page.title) editor.commands.setContent(`<p>${page.title}</p>`)
		},
		onBlur: ({ editor }) => handleTitleBlur(editor)
	})

	useEffect(() => {
		if (titleEditor) {
			titleEditorRef.current = titleEditor
		}
	}, [titleEditor])

	return (
		<div tabIndex={0} className="relative flex grow flex-col overflow-y-auto">
			<div className="relative mx-auto flex h-full w-[calc(100%-40px)] shrink-0 grow flex-col sm:w-[calc(100%-80px)]">
				<form className="flex shrink-0 flex-col">
					<div className="mb-2 mt-8 flex flex-row justify-between py-1.5">
						<EditorContent
							editor={titleEditor}
							className="la-editor grow cursor-text select-text text-2xl font-semibold leading-[calc(1.33333)] tracking-[-0.00625rem]"
						/>
						<div className="items-center space-x-4">
							<TopicSelector
								onSelect={topic => {
									page.topic = topic
									setSelectedPageTopic(topic)
									setTopicSelectorOpen(false)
								}}
							/>
							<Button
								type="button"
								variant="secondary"
								className="text-foreground bg-truncat"
								onClick={() => setDeleteModalOpen(true)}
							>
								<LaIcon name="Trash" className="h-4 w-4" />
							</Button>
						</div>
					</div>
					<div className="flex flex-auto flex-col">
						<div className="relative flex h-full max-w-full grow flex-col items-stretch p-0">
							<LAEditor
								ref={contentEditorRef}
								editorClassName="-mx-3.5 px-3.5 py-2.5 flex-auto"
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

			<DeletePageModal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={() => {
					confirmDelete(page)
				}}
				title={page.title || ""}
			/>
		</div>
	)
}
