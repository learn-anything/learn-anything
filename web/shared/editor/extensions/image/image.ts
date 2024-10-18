import type { ImageOptions } from "@tiptap/extension-image"
import { Image as TiptapImage } from "@tiptap/extension-image"
import type { Editor } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { ImageViewBlock } from "./components/image-view-block"
import {
  filterFiles,
  sanitizeUrl,
  type FileError,
  type FileValidationOptions,
} from "@shared/editor/lib/utils"

interface DownloadImageCommandProps {
  src: string
  alt?: string
}

interface ImageActionProps {
  src: string
  alt?: string
  action: "download" | "copyImage" | "copyLink"
}

interface CustomImageOptions
  extends ImageOptions,
    Omit<FileValidationOptions, "allowBase64"> {
  uploadFn?: (blobUrl: string, editor: Editor) => Promise<string>
  onToggle?: (editor: Editor, files: File[], pos: number) => void
  onActionSuccess?: (props: ImageActionProps) => void
  onActionError?: (error: Error, props: ImageActionProps) => void
  customDownloadImage?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => void
  customCopyImage?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => void
  customCopyLink?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => void
  onValidationError?: (errors: FileError[]) => void
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    toggleImage: {
      toggleImage: () => ReturnType
    }
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
  }
}

const handleError = (
  error: unknown,
  props: ImageActionProps,
  errorHandler?: (error: Error, props: ImageActionProps) => void,
) => {
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
  if (src.startsWith("data:")) {
    return handleDataUrl(src)
  } else {
    return handleImageUrl(src)
  }
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

const defaultDownloadImage = async (
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

const defaultCopyImage = async (
  props: ImageActionProps,
  options: CustomImageOptions,
) => {
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

const defaultCopyLink = async (
  props: ImageActionProps,
  options: CustomImageOptions,
) => {
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
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: undefined,
      },
      height: {
        default: undefined,
      },
    }
  },

  addCommands() {
    return {
      toggleImage: () => (props) => {
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
              props.editor,
              validImages,
              props.editor.state.selection.from,
            )
          }
        }

        input.click()
        return true
      },
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
                return {
                  type: this.name,
                  attrs: {
                    src:
                      image.src instanceof File
                        ? sanitizeUrl(URL.createObjectURL(image.src), {
                            allowBase64: this.options.allowBase64,
                          })
                        : image.src,
                    alt: image.alt,
                    title: image.title,
                  },
                }
              }),
            )
          }

          return false
        },
      downloadImage: (attrs) => () => {
        const downloadFunc =
          this.options.customDownloadImage || defaultDownloadImage
        void downloadFunc({ ...attrs, action: "download" }, this.options)
        return true
      },
      copyImage: (attrs) => () => {
        const copyImageFunc = this.options.customCopyImage || defaultCopyImage
        void copyImageFunc({ ...attrs, action: "copyImage" }, this.options)
        return true
      },
      copyLink: (attrs) => () => {
        const copyLinkFunc = this.options.customCopyLink || defaultCopyLink
        void copyLinkFunc({ ...attrs, action: "copyLink" }, this.options)
        return true
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageViewBlock, {
      className: "block-node",
    })
  },
})
