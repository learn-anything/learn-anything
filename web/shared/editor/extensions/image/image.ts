import type { ImageOptions } from "@tiptap/extension-image"
import { Image as TiptapImage } from "@tiptap/extension-image"
import type { Editor } from "@tiptap/react"
import type { Node } from "@tiptap/pm/model"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { ImageViewBlock } from "./components/image-view-block"
import {
  filterFiles,
  randomId,
  type FileError,
  type FileValidationOptions,
} from "@shared/editor/lib/utils"

type ImageAction = "download" | "copyImage" | "copyLink"

interface DownloadImageCommandProps {
  src: string
  alt?: string
}

interface ImageActionProps extends DownloadImageCommandProps {
  action: ImageAction
}

type ImageInfo = {
  id?: string | number
  src: string
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
  onImageRemoved?: (props: ImageInfo) => void
  onActionSuccess?: (props: ImageActionProps) => void
  onActionError?: (error: Error, props: ImageActionProps) => void
  customDownloadImage?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => Promise<void>
  customCopyImage?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => Promise<void>
  customCopyLink?: (
    props: ImageActionProps,
    options: CustomImageOptions,
  ) => Promise<void>
  onValidationError?: (errors: FileError[]) => void
  onToggle?: (editor: Editor, files: File[], pos: number) => void
}

declare module "@tiptap/core" {
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

const defaultCopyLink = async (
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
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: undefined,
      },
      width: {
        default: undefined,
      },
      height: {
        default: undefined,
      },
      fileName: {
        default: undefined,
      },
      fileType: {
        default: undefined,
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
                  return {
                    type: this.type.name,
                    attrs: {
                      id: randomId(),
                      src: blobUrl,
                      alt: image.alt,
                      title: image.title,
                      fileName: image.src.name,
                      fileType: image.src.type,
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
                      fileType: null,
                    },
                  }
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
    }
  },

  onTransaction({ transaction }) {
    if (!transaction.docChanged) return

    const oldDoc = transaction.before
    const newDoc = transaction.doc

    const oldImages = new Map<string, ImageInfo>()
    const newImages = new Map<string, ImageInfo>()

    const addToMap = (node: Node, map: Map<string, ImageInfo>) => {
      if (node.type.name === "image") {
        const attrs = node.attrs
        if (attrs.src) {
          const key = attrs.id || attrs.src
          map.set(key, { id: attrs.id, src: attrs.src })
        }
      }
    }

    oldDoc.descendants((node) => addToMap(node, oldImages))
    newDoc.descendants((node) => addToMap(node, newImages))

    oldImages.forEach((imageInfo, key) => {
      if (!newImages.has(key)) {
        if (imageInfo.src.startsWith("blob:")) {
          URL.revokeObjectURL(imageInfo.src)
        }

        if (
          !imageInfo.src.startsWith("blob:") &&
          !imageInfo.src.startsWith("data:")
        ) {
          this.options.onImageRemoved?.({
            id: imageInfo.id,
            src: imageInfo.src,
          })
        }
      }
    })
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageViewBlock, {
      className: "block-node",
    })
  },
})
