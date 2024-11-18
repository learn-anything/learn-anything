import type { ImageOptions } from "@tiptap/extension-image"
import { Image as TiptapImage } from "@tiptap/extension-image"
import type { Editor } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { ImageViewBlock } from "./components/image-view-block"
import {
  filterFiles,
  randomId,
  type FileError,
  type FileValidationOptions,
} from "@shared/editor/lib/utils"
import { ReplaceStep } from "@tiptap/pm/transform"
import type { Attrs } from "@tiptap/pm/model"

type ImageAction = "download" | "copyImage" | "copyLink"

interface DownloadImageCommandProps {
  src: string
  alt?: string
}

interface ImageActionProps extends DownloadImageCommandProps {
  action: ImageAction
}

export type UploadReturnType =
  | string
  | {
      id: string | number
      src: string
    }

interface CustomImageOptions
  extends ImageOptions,
    Omit<FileValidationOptions, "allowBase64"> {
  uploadFn?: (file: File, editor: Editor) => Promise<UploadReturnType>
  onImageRemoved?: (props: Attrs) => void
  onActionSuccess?: (props: ImageActionProps) => void
  onActionError?: (error: Error, props: ImageActionProps) => void
  downloadImage?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => Promise<void>
  copyImage?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => Promise<void>
  copyLink?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => Promise<void>
  onValidationError?: (errors: FileError[]) => void
  onToggle?: (editor: Editor, files: File[], pos: number) => void
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    setImages: {
      setImages: (
        attrs: { src: string | File; alt?: string; title?: string }[],
      ) => ReturnType
    }
    downloadImage: {
      downloadImage: (attrs: DownloadImageCommandProps) => ReturnType
    }
    copyImage: {
      copyImage: (attrs: DownloadImageCommandProps) => ReturnType
    }
    copyLink: {
      copyLink: (attrs: DownloadImageCommandProps) => ReturnType
    }
    toggleImage: {
      toggleImage: () => ReturnType
    }
  }
}

const handleError = (
  error: unknown,
  props: ImageActionProps,
  errorHandler?: (error: Error, props: ImageActionProps) => void,
): void => {
  const typedError = error instanceof Error ? error : new Error("Unknown error")
  errorHandler?.(typedError, props)
}

const handleDataUrl = (src: string): { blob: Blob; extension: string } => {
  const [header, base64Data] = src.split(",")
  const mimeType = header.split(":")[1].split(";")[0]
  const extension = mimeType.split("/")[1]
  const byteCharacters = atob(base64Data)
  const byteArray = new Uint8Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i)
  }
  const blob = new Blob([byteArray], { type: mimeType })
  return { blob, extension }
}

const handleImageUrl = async (
  src: string,
): Promise<{ blob: Blob; extension: string }> => {
  const response = await fetch(src)
  if (!response.ok) throw new Error("Failed to fetch image")
  const blob = await response.blob()
  const extension = blob.type.split(/\/|\+/)[1]
  return { blob, extension }
}

const fetchImageBlob = async (
  src: string,
): Promise<{ blob: Blob; extension: string }> => {
  return src.startsWith("data:") ? handleDataUrl(src) : handleImageUrl(src)
}

const saveImage = async (
  blob: Blob,
  name: string,
  extension: string,
): Promise<void> => {
  const imageURL = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = imageURL
  link.download = `${name}.${extension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(imageURL)
}

const downloadImage = async (
  props: ImageActionProps,
  options: CustomImageOptions,
): Promise<void> => {
  const { src, alt } = props
  const potentialName = alt || "image"

  try {
    const { blob, extension } = await fetchImageBlob(src)
    await saveImage(blob, potentialName, extension)
    options.onActionSuccess?.({ ...props, action: "download" })
  } catch (error) {
    handleError(error, { ...props, action: "download" }, options.onActionError)
  }
}

const copyImage = async (
  props: ImageActionProps,
  options: CustomImageOptions,
): Promise<void> => {
  const { src } = props
  try {
    const res = await fetch(src)
    const blob = await res.blob()
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
    options.onActionSuccess?.({ ...props, action: "copyImage" })
  } catch (error) {
    handleError(error, { ...props, action: "copyImage" }, options.onActionError)
  }
}

const copyLink = async (
  props: ImageActionProps,
  options: CustomImageOptions,
): Promise<void> => {
  const { src } = props
  try {
    await navigator.clipboard.writeText(src)
    options.onActionSuccess?.({ ...props, action: "copyLink" })
  } catch (error) {
    handleError(error, { ...props, action: "copyLink" }, options.onActionError)
  }
}

export const Image = TiptapImage.extend<CustomImageOptions>({
  atom: true,

  addOptions() {
    return {
      ...this.parent?.(),
      allowedMimeTypes: [],
      maxFileSize: 0,
      uploadFn: undefined,
      onToggle: undefined,
      downloadImage: undefined,
      copyImage: undefined,
      copyLink: undefined,
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      id: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      fileName: {
        default: null,
      },
    }
  },

  addCommands() {
    return {
      setImages:
        (attrs) =>
        ({ commands }) => {
          const [validImages, errors] = filterFiles(attrs, {
            allowedMimeTypes: this.options.allowedMimeTypes,
            maxFileSize: this.options.maxFileSize,
            allowBase64: this.options.allowBase64,
          })

          if (errors.length > 0 && this.options.onValidationError) {
            this.options.onValidationError(errors)
          }

          if (validImages.length > 0) {
            return commands.insertContent(
              validImages.map((image) => {
                if (image.src instanceof File) {
                  const blobUrl = URL.createObjectURL(image.src)
                  const id = randomId()

                  return {
                    type: this.type.name,
                    attrs: {
                      id,
                      src: blobUrl,
                      alt: image.alt,
                      title: image.title,
                      fileName: image.src.name,
                    },
                  }
                } else {
                  return {
                    type: this.type.name,
                    attrs: {
                      id: randomId(),
                      src: image.src,
                      alt: image.alt,
                      title: image.title,
                      fileName: null,
                    },
                  }
                }
              }),
            )
          }

          return false
        },

      downloadImage: (attrs) => () => {
        const downloadFunc = this.options.downloadImage || downloadImage
        void downloadFunc({ ...attrs, action: "download" }, this.options)
        return true
      },

      copyImage: (attrs) => () => {
        const copyImageFunc = this.options.copyImage || copyImage
        void copyImageFunc({ ...attrs, action: "copyImage" }, this.options)
        return true
      },

      copyLink: (attrs) => () => {
        const copyLinkFunc = this.options.copyLink || copyLink
        void copyLinkFunc({ ...attrs, action: "copyLink" }, this.options)
        return true
      },

      toggleImage:
        () =>
        ({ editor }) => {
          const input = document.createElement("input")
          input.type = "file"
          input.accept = this.options.allowedMimeTypes.join(",")
          input.onchange = () => {
            const files = input.files
            if (!files) return

            const [validImages, errors] = filterFiles(Array.from(files), {
              allowedMimeTypes: this.options.allowedMimeTypes,
              maxFileSize: this.options.maxFileSize,
              allowBase64: this.options.allowBase64,
            })

            if (errors.length > 0 && this.options.onValidationError) {
              this.options.onValidationError(errors)
              return false
            }

            if (validImages.length === 0) return false

            if (this.options.onToggle) {
              this.options.onToggle(
                editor,
                validImages,
                editor.state.selection.from,
              )
            }

            return false
          }

          input.click()
          return true
        },
    }
  },

  onTransaction({ transaction }) {
    transaction.steps.forEach((step) => {
      if (step instanceof ReplaceStep && step.slice.size === 0) {
        const deletedPages = transaction.before.content.cut(step.from, step.to)

        deletedPages.forEach((node) => {
          if (node.type.name === "image") {
            const attrs = node.attrs

            if (attrs.src.startsWith("blob:")) {
              URL.revokeObjectURL(attrs.src)
            }

            this.options.onImageRemoved?.(attrs)
          }
        })
      }
    })
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageViewBlock, {
      className: "block-node",
    })
  },
})
