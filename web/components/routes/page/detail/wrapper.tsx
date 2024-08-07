"use client"

import React, { useEffect, useRef } from "react"
import { LAEditor, LAEditorRef } from "@/components/la-editor"
import { DetailPageHeader } from "./header"
import { ID } from "jazz-tools"
import { PersonalPage } from "@/lib/schema/personal-page"
import { Content, EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@/components/la-editor/extensions/starter-kit"
import { Paragraph } from "@/components/la-editor/extensions/paragraph"
import { useCoState } from "@/lib/providers/jazz-provider"
import { toast } from "sonner"
import { EditorView } from "prosemirror-view"

const configureStarterKit = () =>
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
      placeholder: "Page title"
    }
  })

const editorProps = {
  attributes: {
    spellcheck: "true",
    role: "textbox",
    "aria-readonly": "false",
    "aria-multiline": "false",
    "aria-label": "Page title",
    translate: "no"
  }
}

export function DetailPageWrapper({ pageId }: { pageId: string }) {
  const page = useCoState(PersonalPage, pageId as ID<PersonalPage>)
  const contentEditorRef = useRef<LAEditorRef>(null)

  const handleKeyDown = (view: EditorView, event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      contentEditorRef.current?.focus()
      return true
    }
    return false
  }

  const handleTitleBlur = (title: string) => {
    if (page && editor) {
      if (!title) {
        toast.error("Update failed", {
          description: "Title must be longer than or equal to 1 character"
        })

        // https://github.com/ueberdosis/tiptap/issues/3764
        setTimeout(() => {
          editor.commands.setContent(`<p>${page.title}</p>`)
        })
      } else {
        page.title = title
      }
    }
  }

  const editor = useEditor({
    extensions: [configureStarterKit(), Paragraph],
    editorProps: {
      ...editorProps,
      handleKeyDown: handleKeyDown as unknown as (
        view: EditorView,
        event: KeyboardEvent
      ) => boolean | void
    },
    onBlur: ({ editor }) => handleTitleBlur(editor.getText())
  })

  const handleContentUpdate = (content: Content) => {
    console.log("content", content)
  }

  const updatePageContent = (content: Content) => {
    if (page) {
      page.content = content
    }
  }

  useEffect(() => {
    if (page && editor) {
      setTimeout(() => {
        editor.commands.setContent(`<p>${page.title}</p>`)
      })
    }
  }, [page, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-row">
      <div className="flex h-full w-full">
        <div className="relative flex min-w-0 grow basis-[760px] flex-col">
          <DetailPageHeader pageId={pageId as ID<PersonalPage>} />
          <div
            tabIndex={0}
            className="relative flex grow flex-col overflow-y-auto"
          >
            <div className="relative mx-auto flex h-full w-[calc(100%-40px)] shrink-0 grow flex-col sm:w-[calc(100%-80px)]">
              <form className="flex shrink-0 flex-col">
                <div className="mb-2 mt-8 py-1.5">
                  <EditorContent
                    editor={editor}
                    className="la-editor cursor-text select-text text-2xl font-semibold leading-[calc(1.33333)] tracking-[-0.00625rem]"
                  />
                </div>
                <div className="flex flex-auto flex-col">
                  <div className="relative flex h-full max-w-full grow flex-col items-stretch p-0">
                    <LAEditor
                      ref={contentEditorRef}
                      editorClassName="-mx-3.5 px-3.5 py-2.5 flex-auto"
                      initialContent={page?.content}
                      placeholder="Add content..."
                      output="json"
                      throttleDelay={3000}
                      onUpdate={handleContentUpdate}
                      onBlur={updatePageContent}
                      onNewBlock={updatePageContent}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
