import * as React from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ID } from "jazz-tools"
import { PersonalPage } from "@/lib/schema"
import { Content, EditorContent, useEditor } from "@tiptap/react"
import { useCoState } from "@/lib/providers/jazz-provider"
import { EditorView } from "@tiptap/pm/view"
import { Editor } from "@tiptap/core"
import { generateUniqueSlug } from "@/lib/utils"
import { FocusClasses } from "@tiptap/extension-focus"
import { DetailPageHeader } from "./-header"
import { useMedia } from "@/hooks/use-media"
import { TopicSelector } from "@/components/custom/topic-selector"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import { useConfirm } from "@omit/react-confirm-dialog"
import { usePageActions } from "~/hooks/actions/use-page-actions"
import { Paragraph } from "@shared/editor/extensions/paragraph"
import { StarterKit } from "@shared/editor/extensions/starter-kit"
import { LaEditor } from "@shared/editor"

export const Route = createFileRoute(
  "/_layout/_pages/_protected/pages/$pageId/",
)({
  component: PageDetailComponent,
})

const TITLE_PLACEHOLDER = "Untitled"

function PageDetailComponent() {
  const { pageId } = Route.useParams()
  const isMobile = useMedia("(max-width: 770px)")
  const page = useCoState(PersonalPage, pageId as ID<PersonalPage>, {
    topic: {},
  })

  const navigate = useNavigate()
  const { deletePage } = usePageActions()
  const confirm = useConfirm()

  const handleDelete = React.useCallback(async () => {
    const result = await confirm({
      title: "Delete page",
      description: "Are you sure you want to delete this page?",
      confirmText: "Delete",
      cancelText: "Cancel",
      cancelButton: { variant: "outline" },
      confirmButton: { variant: "destructive" },
    })

    if (result) {
      deletePage(pageId as ID<PersonalPage>)
      navigate({ to: "/pages" })
    }
  }, [confirm, deletePage, pageId, navigate])

  if (!page) return null

  return (
    <div className="absolute inset-0 flex flex-row overflow-hidden">
      <div className="flex h-full w-full">
        <div className="relative flex min-w-0 grow basis-[760px] flex-col">
          <DetailPageHeader
            page={page}
            handleDelete={handleDelete}
            isMobile={isMobile}
          />
          <DetailPageForm page={page} />
        </div>

        {!isMobile && (
          <SidebarActions
            key={pageId}
            page={page}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

const SidebarActions = ({
  page,
  handleDelete,
}: {
  page: PersonalPage
  handleDelete: () => void
}) => (
  <div className="relative min-w-56 max-w-72 border-l bg-[var(--body-background)]">
    <div className="flex">
      <div className="flex h-10 flex-auto flex-row items-center justify-between px-5">
        <span className="text-left text-[13px] font-medium text-muted-foreground">
          Page actions
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-10 space-y-3 overflow-y-auto px-4 py-1.5">
        <TopicSelector
          value={page.topic?.name}
          onTopicChange={(topic) => {
            page.topic = topic
            page.updatedAt = new Date()
          }}
          variant="ghost"
          className="-ml-1.5"
          renderSelectedText={() => (
            <span className="truncate">
              {page.topic?.prettyName || "Select a topic"}
            </span>
          )}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          className="-ml-1.5"
        >
          <LaIcon name="Trash" className="mr-2" />
          <span className="text-sm">Delete</span>
        </Button>
      </div>
    </div>
  </div>
)

SidebarActions.displayName = "SidebarActions"

const DetailPageForm = ({ page }: { page: PersonalPage }) => {
  const titleEditorRef = React.useRef<Editor | null>(null)
  const contentEditorRef = React.useRef<Editor | null>(null)
  const [isInitialSync, setIsInitialSync] = React.useState(true)

  React.useEffect(() => {
    if (!page) return

    const unsubscribe = page.subscribe({}, (updatedPage) => {
      if (
        updatedPage &&
        contentEditorRef.current &&
        titleEditorRef.current &&
        !isInitialSync
      ) {
        const currentTItle = titleEditorRef.current.getText()
        const newTitle = updatedPage.title

        if (currentTItle !== newTitle) {
          titleEditorRef.current.commands.setContent(newTitle as Content)
        }

        const currentContent = contentEditorRef.current.getJSON()
        const newContent = updatedPage.content

        if (JSON.stringify(currentContent) !== JSON.stringify(newContent)) {
          contentEditorRef.current.commands.setContent(newContent as Content)
        }
      }
    })

    return () => unsubscribe()
  }, [page, isInitialSync])

  const updatePageContent = React.useCallback(
    (content: Content) => {
      page.applyDiff({ content, updatedAt: new Date() })
    },
    [page],
  )

  const handleUpdateTitle = React.useCallback(
    (editor: Editor) => {
      const newTitle = editor.getText()
      if (newTitle !== page.title) {
        const slug = generateUniqueSlug(newTitle)
        page.title = newTitle
        page.slug = slug
        page.updatedAt = new Date()
      }
    },
    [page],
  )

  const handleTitleKeyDown = React.useCallback(
    (view: EditorView, event: KeyboardEvent) => {
      const editor = titleEditorRef.current
      if (!editor) return false

      const { state } = editor
      const { selection } = state
      const { $anchor } = selection

      if (
        (event.key === "ArrowRight" || event.key === "ArrowDown") &&
        $anchor.pos === state.doc.content.size - 1
      ) {
        event.preventDefault()
        contentEditorRef.current?.commands.focus("start")
        return true
      }
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        contentEditorRef.current?.commands.focus("start")
        return true
      }
      return false
    },
    [],
  )

  const handleContentKeyDown = React.useCallback(
    (view: EditorView, event: KeyboardEvent) => {
      const editor = contentEditorRef.current
      if (!editor) return false

      const { state } = editor
      const { selection } = state
      const { $anchor } = selection

      if (
        (event.key === "ArrowLeft" || event.key === "ArrowUp") &&
        $anchor.pos - 1 === 0
      ) {
        event.preventDefault()
        titleEditorRef.current?.commands.focus("end")
        return true
      }
      return false
    },
    [],
  )

  const titleEditor = useEditor({
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
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
        placeholder: { placeholder: TITLE_PLACEHOLDER },
      }),
    ],
    editorProps: {
      attributes: {
        spellcheck: "true",
        role: "textbox",
        "aria-readonly": "false",
        "aria-multiline": "false",
        "aria-label": TITLE_PLACEHOLDER,
        translate: "no",
        class: "focus:outline-none",
      },
      handleKeyDown: handleTitleKeyDown,
    },
    onCreate: ({ editor }) => {
      if (page.title) {
        editor.commands.setContent(page.title)
      }
      titleEditorRef.current = editor
    },
    onBlur: ({ editor }) => handleUpdateTitle(editor),
    onUpdate: ({ editor }) => handleUpdateTitle(editor),
  })

  const { content: pageContent, title: pageTitle } = page

  const handleCreate = React.useCallback(
    ({ editor }: { editor: Editor }) => {
      contentEditorRef.current = editor

      if (pageContent) {
        editor.commands.setContent(pageContent as Content)
      }

      setIsInitialSync(false)

      if (!pageTitle && titleEditorRef.current) {
        titleEditorRef.current.commands.focus()
      } else if (contentEditorRef.current) {
        contentEditorRef.current.commands.focus()
      }
    },
    [pageContent, pageTitle],
  )

  return (
    <div className="relative flex grow flex-col overflow-y-auto [scrollbar-gutter:stable]">
      <div className="relative mx-auto flex h-full w-[calc(100%-80px)] shrink-0 grow flex-col max-lg:w-[calc(100%-40px)] max-lg:max-w-[unset]">
        <form className="flex shrink-0 flex-col">
          <div className="mb-2 mt-8 py-1.5">
            <EditorContent
              key={page.id}
              editor={titleEditor}
              className="title-editor no-command grow cursor-text select-text text-2xl font-semibold leading-[calc(1.33333)] tracking-[-0.00625rem]"
            />
          </div>
          <div className="flex flex-auto flex-col">
            <div className="relative flex h-full max-w-full grow flex-col items-stretch p-0">
              <LaEditor
                key={page.id}
                editorClassName="-mx-3.5 px-3.5 py-2.5 flex-auto focus:outline-none"
                value={page.content as Content}
                placeholder="Add content..."
                output="json"
                throttleDelay={0}
                immediatelyRender={true}
                shouldRerenderOnTransaction={false}
                editorProps={{ handleKeyDown: handleContentKeyDown }}
                onCreate={handleCreate}
                onUpdate={updatePageContent}
                onBlur={updatePageContent}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

DetailPageForm.displayName = "DetailPageForm"
