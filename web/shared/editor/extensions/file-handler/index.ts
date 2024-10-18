import { type Editor, Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { FileError, FileValidationOptions } from "@shared/editor/lib/utils"
import { filterFiles } from "@shared/editor/lib/utils"

type FileHandlePluginOptions = {
  key?: PluginKey
  editor: Editor
  onPaste?: (editor: Editor, files: File[], pasteContent?: string) => void
  onDrop?: (editor: Editor, files: File[], pos: number) => void
  onValidationError?: (errors: FileError[]) => void
} & FileValidationOptions

const FileHandlePlugin = (options: FileHandlePluginOptions) => {
  const {
    key,
    editor,
    onPaste,
    onDrop,
    onValidationError,
    allowedMimeTypes,
    maxFileSize,
  } = options

  return new Plugin({
    key: key || new PluginKey("fileHandler"),

    props: {
      handleDrop(view, event) {
        event.preventDefault()
        event.stopPropagation()

        const { dataTransfer } = event

        if (!dataTransfer?.files.length) {
          return
        }

        const pos = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        })

        const [validFiles, errors] = filterFiles(
          Array.from(dataTransfer.files),
          {
            allowedMimeTypes,
            maxFileSize,
            allowBase64: options.allowBase64,
          },
        )

        if (errors.length > 0 && onValidationError) {
          onValidationError(errors)
        }

        if (validFiles.length > 0 && onDrop) {
          onDrop(editor, validFiles, pos?.pos ?? 0)
        }
      },

      handlePaste(_, event) {
        event.preventDefault()
        event.stopPropagation()

        const { clipboardData } = event

        if (!clipboardData?.files.length) {
          return
        }

        const [validFiles, errors] = filterFiles(
          Array.from(clipboardData.files),
          {
            allowedMimeTypes,
            maxFileSize,
            allowBase64: options.allowBase64,
          },
        )
        const html = clipboardData.getData("text/html")

        if (errors.length > 0 && onValidationError) {
          onValidationError(errors)
        }

        if (validFiles.length > 0 && onPaste) {
          onPaste(editor, validFiles, html)
        }
      },
    },
  })
}

export const FileHandler = Extension.create<
  Omit<FileHandlePluginOptions, "key" | "editor">
>({
  name: "fileHandler",

  addOptions() {
    return {
      allowBase64: false,
      allowedMimeTypes: [],
      maxFileSize: 0,
    }
  },

  addProseMirrorPlugins() {
    return [
      FileHandlePlugin({
        key: new PluginKey(this.name),
        editor: this.editor,
        ...this.options,
      }),
    ]
  },
})
