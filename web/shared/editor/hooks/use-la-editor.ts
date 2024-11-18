import * as React from "react"
import type { Editor } from "@tiptap/core"
import type { Content, EditorOptions, UseEditorOptions } from "@tiptap/react"
import { useEditor } from "@tiptap/react"
import { cn } from "@/lib/utils"
import { useThrottleCallback } from "@shared/hooks/use-throttle-callback"
import { getOutput, randomId } from "@shared/editor/lib/utils"
import { StarterKit } from "@shared/editor/extensions/starter-kit"
import { TaskList } from "@shared/editor/extensions/task-list"
import { TaskItem } from "@shared/editor/extensions/task-item"
import { HorizontalRule } from "@shared/editor/extensions/horizontal-rule"
import { Blockquote } from "@shared/editor/extensions/blockquote/blockquote"
import { SlashCommand } from "@shared/editor/extensions/slash-command"
import { Heading } from "@shared/editor/extensions/heading"
import { Link } from "@shared/editor/extensions/link"
import { CodeBlockLowlight } from "@shared/editor/extensions/code-block-lowlight"
import { Selection } from "@shared/editor/extensions/selection"
import { Code } from "@shared/editor/extensions/code"
import { Paragraph } from "@shared/editor/extensions/paragraph"
import { BulletList } from "@shared/editor/extensions/bullet-list"
import { OrderedList } from "@shared/editor/extensions/ordered-list"
import { Dropcursor } from "@shared/editor/extensions/dropcursor"
import { Image as ImageExt } from "../extensions/image"
import { FileHandler } from "../extensions/file-handler"
import { toast } from "sonner"
import { deleteImageFn, storeImageFn } from "@shared/actions"
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@shared/constants"
import { TrailingNode } from "../extensions/trailing-node"

export interface UseLaEditorProps
  extends Omit<UseEditorOptions, "editorProps"> {
  value?: Content
  output?: "html" | "json" | "text"
  placeholder?: string
  editorClassName?: string
  throttleDelay?: number
  onUpdate?: (content: Content) => void
  onBlur?: (content: Content) => void
  editorProps?: EditorOptions["editorProps"]
}

const createExtensions = ({ placeholder }: { placeholder: string }) => [
  Heading,
  Code,
  Link,
  TaskList,
  TaskItem,
  Selection,
  Paragraph,
  TrailingNode,
  ImageExt.configure({
    allowedMimeTypes: ALLOWED_FILE_TYPES,
    maxFileSize: MAX_FILE_SIZE,
    allowBase64: true,
    uploadFn: async (file) => {
      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          const img = new Image()
          const objectUrl = URL.createObjectURL(file)

          img.onload = () => {
            resolve({
              width: img.naturalWidth,
              height: img.naturalHeight,
            })
            URL.revokeObjectURL(objectUrl)
          }

          img.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error("Failed to load image"))
          }

          img.src = objectUrl
        },
      )

      const formData = new FormData()
      formData.append("file", file)
      formData.append("width", dimensions.width.toString())
      formData.append("height", dimensions.height.toString())

      const store = await storeImageFn({ data: formData })

      return { id: store.fileModel.id, src: store.fileModel.content.src }
    },
    onImageRemoved(props) {
      if (props.id) {
        deleteImageFn({ data: props.id })

        console.log("Image removed", props)

        toast.success("Image removed", {
          position: "bottom-right",
          description: "Image removed successfully",
        })
      }
    },
    onToggle(editor, files, pos) {
      editor.commands.insertContentAt(
        pos,
        files.map((image) => {
          const blobUrl = URL.createObjectURL(image)
          const id = randomId()

          return {
            type: "image",
            attrs: {
              id,
              src: blobUrl,
              alt: image.name,
              title: image.name,
              fileName: image.name,
            },
          }
        }),
      )
    },
    onValidationError(errors) {
      errors.forEach((error) => {
        toast.error("Image validation error", {
          position: "bottom-right",
          description: error.reason,
        })
      })
    },
    onActionSuccess({ action }) {
      const mapping = {
        copyImage: "Copy Image",
        copyLink: "Copy Link",
        download: "Download",
      }
      toast.success(mapping[action], {
        position: "bottom-right",
        description: "Image action success",
      })
    },
    onActionError(error, { action }) {
      const mapping = {
        copyImage: "Copy Image",
        copyLink: "Copy Link",
        download: "Download",
      }
      toast.error(`Failed to ${mapping[action]}`, {
        position: "bottom-right",
        description: error.message,
      })
    },
  }),
  FileHandler.configure({
    allowBase64: true,
    allowedMimeTypes: ALLOWED_FILE_TYPES,
    maxFileSize: MAX_FILE_SIZE,
    onDrop: (editor, files, pos) => {
      files.forEach((file) =>
        editor.commands.insertContentAt(pos, {
          type: "image",
          attrs: { src: URL.createObjectURL(file) },
        }),
      )
    },
    onPaste: (editor, files) => {
      files.forEach((file) =>
        editor.commands.insertContent({
          type: "image",
          attrs: { src: URL.createObjectURL(file) },
        }),
      )
    },
    onValidationError: (errors) => {
      errors.forEach((error) => {
        toast.error("Image validation error", {
          position: "bottom-right",
          description: error.reason,
        })
      })
    },
  }),
  Dropcursor,
  Blockquote,
  BulletList,
  OrderedList,
  SlashCommand,
  HorizontalRule,
  CodeBlockLowlight,
  StarterKit.configure({
    placeholder: {
      placeholder: () => placeholder,
    },
  }),
]

type Props = UseLaEditorProps

export const useLaEditor = ({
  value,
  output = "html",
  placeholder = "",
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  editorProps,
  ...props
}: Props) => {
  const throttledSetValue = useThrottleCallback(
    (editor: Editor) => {
      const content = getOutput(editor, output)
      onUpdate?.(content)
    },
    [output, onUpdate],
    throttleDelay,
  )

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value) {
        editor.commands.setContent(value)
      }
    },
    [value],
  )

  const handleBlur = React.useCallback(
    (editor: Editor) => {
      const content = getOutput(editor, output)
      onBlur?.(content)
    },
    [output, onBlur],
  )

  const mergedEditorProps = React.useMemo(() => {
    const defaultEditorProps: EditorOptions["editorProps"] = {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: cn("focus:outline-none", editorClassName),
      },
    }

    if (!editorProps) return defaultEditorProps

    return {
      ...defaultEditorProps,
      ...editorProps,
      attributes: {
        ...defaultEditorProps.attributes,
        ...editorProps.attributes,
      },
    }
  }, [editorProps, editorClassName])

  const editorOptions: UseEditorOptions = React.useMemo(
    () => ({
      extensions: createExtensions({ placeholder }),
      editorProps: mergedEditorProps,
      onUpdate: ({ editor }) => throttledSetValue(editor),
      onCreate: ({ editor }) => handleCreate(editor),
      onBlur: ({ editor }) => handleBlur(editor),
      ...props,
    }),
    [
      placeholder,
      mergedEditorProps,
      props,
      throttledSetValue,
      handleCreate,
      handleBlur,
    ],
  )

  return useEditor(editorOptions)
}

export default useLaEditor
