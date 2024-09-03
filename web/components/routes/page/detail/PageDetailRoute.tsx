"use client"

import * as React from "react"
import { ID } from "jazz-tools"
import { PersonalPage } from "@/lib/schema"
import { useCallback, useRef, useEffect } from "react"
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
import { useMedia } from "react-use"
import TopicSelector from "@/components/custom/topic-selector"

const TITLE_PLACEHOLDER = "Untitled"

export function PageDetailRoute({ pageId }: { pageId: string }) {
	const isMobile = useMedia("(max-width: 770px)")
	const page = useCoState(PersonalPage, pageId as ID<PersonalPage>)

	if (!page) return null

	return (
		<div className="absolute inset-0 flex flex-row overflow-hidden">
			<div className="flex h-full w-full">
				<div className="relative flex min-w-0 grow basis-[760px] flex-col">
					<DetailPageHeader page={page} />
					<DetailPageForm page={page} />
				</div>

				{!isMobile && (
					<div className="relative min-w-56 max-w-72 border-l">
						<div className="flex">
							<div className="flex h-10 flex-auto flex-row items-center justify-between px-4">
								<span className="text-left text-sm font-medium">Page actions</span>
							</div>

							<div className="absolute bottom-0 left-0 right-0 top-10 overflow-y-auto px-4 py-1.5">
								<TopicSelector
									value={page.topic?.name}
									onTopicChange={topic => {
										page.topic = topic
										page.updatedAt = new Date()
									}}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export const DetailPageForm = ({ page }: { page: PersonalPage }) => {
	const { me } = useAccount()
	const titleEditorRef = useRef<Editor | null>(null)
	const contentEditorRef = useRef<LAEditorRef>(null)

	const isTitleInitialMount = useRef(true)
	const isContentInitialMount = useRef(true)

	const updatePageContent = (content: Content, model: PersonalPage) => {
		if (isContentInitialMount.current) {
			isContentInitialMount.current = false
			return
		}

		model.content = content
		model.updatedAt = new Date()
	}

	const handleUpdateTitle = (editor: Editor) => {
		if (isTitleInitialMount.current) {
			isTitleInitialMount.current = false
			return
		}

		const personalPages = me?.root?.personalPages?.toJSON() || []
		const slug = generateUniqueSlug(personalPages, page.slug || "")

		const trimmedTitle = editor.getText().trim()
		page.title = trimmedTitle
		page.slug = slug
		page.updatedAt = new Date()

		editor.commands.setContent(trimmedTitle)
	}

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
		autofocus: true,
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
	}, [])

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
