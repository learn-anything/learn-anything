"use client"

import { LAEditor, LAEditorRef } from "@/components/la-editor"
import { DetailPageHeader } from "./header"
import { ID } from "jazz-tools"
import { PersonalPage } from "@/lib/schema/personal-page"
import { Content, EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@/components/la-editor/extensions/starter-kit"
import { Paragraph } from "@/components/la-editor/extensions/paragraph"
import { useEffect, useRef } from "react"
import { useCoState } from "@/lib/providers/jazz-provider"
import { toast } from "sonner"

export function DetailPageWrapper({ pageId }: { pageId: string }) {
  const page = useCoState(PersonalPage, pageId as ID<PersonalPage>)
  const contentEditorRef = useRef<LAEditorRef>(null)

  const onEnter = () => {
    contentEditorRef.current?.focus()
  }

  const editor = useEditor(
    {
      extensions: [
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
        }),
        Paragraph
      ],
      editorProps: {
        attributes: {
          spellcheck: "true",
          role: "textbox",
          "aria-readonly": "false",
          "aria-multiline": "false",
          "aria-label": "Page title",
          translate: "no"
        },
        handleKeyDown: (_, event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()

            onEnter()
            return true
          }

          return false
        }
      },
      onBlur({ editor }) {
        onTitleBlur(editor.getText())
      }
    },
    []
  )

  const onTitleBlur = (title: string) => {
    if (page && editor) {
      if (!title) {
        toast.error("Update failed", {
          description: "Title must be longer than or equal to 1 character"
        })
        editor.commands.setContent(`<p>${page.title}</p>`)
        return
      } else {
        page.title = title
      }
    }
  }

  const handleContentUpdate = (content: Content) => {
    console.log("content", content)
  }

  const handleContentOnNewBlock = (content: Content) => {
    if (page) {
      page.content = content
    }
  }

  const handleContentOnBlur = (content: Content) => {
    if (page) {
      page.content = content
    }
  }

  useEffect(() => {
    if (page && editor) {
      editor.commands.setContent(`<p>${page.title}</p>`)
    }
  }, [page])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-row">
      <div className="flex h-full w-full">
        <div className="relative flex min-w-0 grow basis-[760px] flex-col">
          {/* header */}
          <DetailPageHeader pageId={pageId as ID<PersonalPage>} />

          {/* content */}
          <div
            tabIndex={0}
            className="relative flex grow flex-col overflow-y-auto"
          >
            <div className="relative mx-auto flex h-full w-[calc(100%-40px)] shrink-0 grow flex-col sm:w-[calc(100%-80px)]">
              <form className="flex shrink-0 flex-col">
                {/* title */}
                <div className="mb-2 mt-8 py-1.5">
                  <EditorContent
                    editor={editor}
                    className="la-editor cursor-text select-text text-2xl font-semibold leading-[calc(1.33333)] tracking-[-0.00625rem]"
                    // key={page.id}
                  />
                </div>

                {/* editor */}
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
                      onBlur={handleContentOnBlur}
                      onNewBlock={handleContentOnNewBlock}
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
