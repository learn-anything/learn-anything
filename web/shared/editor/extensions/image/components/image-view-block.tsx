import * as React from "react"
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import type { ElementDimensions } from "../hooks/use-drag-resize"
import { useDragResize } from "../hooks/use-drag-resize"
import { ResizeHandle } from "./resize-handle"
import { cn } from "@/lib/utils"
import { Controlled as ControlledZoom } from "react-medium-image-zoom"
import { ActionButton, ActionWrapper, ImageActions } from "./image-actions"
import { useImageActions } from "../hooks/use-image-actions"
import { blobUrlToBase64, randomId } from "@shared/editor/lib/utils"
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons"
import { ImageOverlay } from "./image-overlay"
import type { UploadReturnType } from "../image"
import { Spinner } from "@shared/components/spinner"

const MAX_HEIGHT = 600
const MIN_HEIGHT = 120
const MIN_WIDTH = 120

interface ImageState {
  src: string
  isServerUploading: boolean
  imageLoaded: boolean
  isZoomed: boolean
  error: boolean
  naturalSize: ElementDimensions
}

const normalizeUploadResponse = (res: UploadReturnType) => ({
  src: typeof res === "string" ? res : res.src,
  id: typeof res === "string" ? randomId() : res.id,
})

export const ImageViewBlock: React.FC<NodeViewProps> = ({
  editor,
  node,
  selected,
  updateAttributes,
}) => {
  const {
    src: initialSrc,
    width: initialWidth,
    height: initialHeight,
    fileName,
  } = node.attrs
  const uploadAttemptedRef = React.useRef(false)

  const initSrc = React.useMemo(() => {
    if (typeof initialSrc === "string") {
      return initialSrc
    }
    return initialSrc.src
  }, [initialSrc])

  const [imageState, setImageState] = React.useState<ImageState>({
    src: initSrc,
    isServerUploading: false,
    imageLoaded: false,
    isZoomed: false,
    error: false,
    naturalSize: { width: initialWidth, height: initialHeight },
  })

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [activeResizeHandle, setActiveResizeHandle] = React.useState<
    "left" | "right" | null
  >(null)

  const onDimensionsChange = React.useCallback(
    ({ width, height }: ElementDimensions) => {
      updateAttributes({ width, height })
    },
    [updateAttributes],
  )

  const aspectRatio =
    imageState.naturalSize.width / imageState.naturalSize.height
  const maxWidth = MAX_HEIGHT * aspectRatio
  const containerMaxWidth = containerRef.current
    ? parseFloat(
        getComputedStyle(containerRef.current).getPropertyValue(
          "--editor-width",
        ),
      )
    : Infinity

  const { isLink, onView, onDownload, onCopy, onCopyLink, onRemoveImg } =
    useImageActions({
      editor,
      node,
      src: imageState.src,
      onViewClick: (isZoomed) =>
        setImageState((prev) => ({ ...prev, isZoomed })),
    })

  const {
    currentWidth,
    currentHeight,
    updateDimensions,
    initiateResize,
    isResizing,
  } = useDragResize({
    initialWidth: initialWidth ?? imageState.naturalSize.width,
    initialHeight: initialHeight ?? imageState.naturalSize.height,
    contentWidth: imageState.naturalSize.width,
    contentHeight: imageState.naturalSize.height,
    gridInterval: 0.1,
    onDimensionsChange,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    maxWidth: containerMaxWidth > 0 ? containerMaxWidth : maxWidth,
  })

  const shouldMerge = React.useMemo(() => currentWidth <= 180, [currentWidth])

  const handleImageLoad = React.useCallback(
    (ev: React.SyntheticEvent<HTMLImageElement>) => {
      const img = ev.target as HTMLImageElement
      const newNaturalSize = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      }
      setImageState((prev) => ({
        ...prev,
        naturalSize: newNaturalSize,
        imageLoaded: true,
      }))
      updateAttributes({
        width: img.width || newNaturalSize.width,
        height: img.height || newNaturalSize.height,
        alt: img.alt,
        title: img.title,
      })

      if (!initialWidth) {
        updateDimensions((state) => ({ ...state, width: newNaturalSize.width }))
      }
    },
    [initialWidth, updateAttributes, updateDimensions],
  )

  const handleImageError = React.useCallback(() => {
    setImageState((prev) => ({ ...prev, error: true, imageLoaded: true }))
  }, [])

  const handleResizeStart = React.useCallback(
    (direction: "left" | "right") =>
      (event: React.PointerEvent<HTMLDivElement>) => {
        setActiveResizeHandle(direction)
        initiateResize(direction)(event)
      },
    [initiateResize],
  )

  const handleResizeEnd = React.useCallback(() => {
    setActiveResizeHandle(null)
  }, [])

  React.useEffect(() => {
    if (!isResizing) {
      handleResizeEnd()
    }
  }, [isResizing, handleResizeEnd])

  React.useEffect(() => {
    const handleImage = async () => {
      if (!initSrc.startsWith("blob:") || uploadAttemptedRef.current) {
        return
      }

      uploadAttemptedRef.current = true
      const imageExtension = editor.options.extensions.find(
        (ext) => ext.name === "image",
      )
      const { uploadFn } = imageExtension?.options ?? {}

      if (!uploadFn) {
        try {
          const base64 = await blobUrlToBase64(initSrc)
          setImageState((prev) => ({ ...prev, src: base64 }))
          updateAttributes({ src: base64 })
        } catch {
          setImageState((prev) => ({ ...prev, error: true }))
        }
        return
      }

      try {
        setImageState((prev) => ({ ...prev, isServerUploading: true }))
        const response = await fetch(initSrc)
        const blob = await response.blob()
        const file = new File([blob], fileName, { type: blob.type })

        const url = await uploadFn(file, editor)
        const normalizedData = normalizeUploadResponse(url)

        setImageState((prev) => ({
          ...prev,
          ...normalizedData,
          isServerUploading: false,
        }))

        updateAttributes(normalizedData)
      } catch (error) {
        setImageState((prev) => ({
          ...prev,
          error: true,
          isServerUploading: false,
        }))
      }
    }

    handleImage()
  }, [editor, fileName, initSrc, updateAttributes])

  return (
    <NodeViewWrapper
      ref={containerRef}
      data-drag-handle
      className="relative text-center leading-none"
    >
      <div
        className="group/node-image relative mx-auto rounded-md object-contain"
        style={{
          maxWidth: `min(${maxWidth}px, 100%)`,
          width: currentWidth,
          maxHeight: MAX_HEIGHT,
          aspectRatio: `${imageState.naturalSize.width} / ${imageState.naturalSize.height}`,
        }}
      >
        <div
          className={cn(
            "relative flex h-full cursor-default flex-col items-center gap-2 rounded",
            {
              "outline outline-2 outline-offset-1 outline-primary":
                selected || isResizing,
            },
          )}
        >
          <div className="h-full contain-paint">
            <div className="relative h-full">
              {imageState.isServerUploading && !imageState.error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner className="size-7" />
                </div>
              )}

              {imageState.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <InfoCircledIcon className="size-8 text-destructive" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Failed to load image
                  </p>
                </div>
              )}

              <ControlledZoom
                isZoomed={imageState.isZoomed}
                onZoomChange={() =>
                  setImageState((prev) => ({ ...prev, isZoomed: false }))
                }
              >
                <img
                  className={cn(
                    "h-auto rounded object-contain transition-shadow",
                    {
                      "opacity-0": !imageState.imageLoaded || imageState.error,
                    },
                  )}
                  style={{
                    maxWidth: `min(100%, ${maxWidth}px)`,
                    minWidth: `${MIN_WIDTH}px`,
                    maxHeight: MAX_HEIGHT,
                  }}
                  width={currentWidth}
                  height={currentHeight}
                  src={imageState.src}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  alt={node.attrs.alt || ""}
                  title={node.attrs.title || ""}
                  id={node.attrs.id}
                />
              </ControlledZoom>
            </div>

            {imageState.isServerUploading && <ImageOverlay />}

            {editor.isEditable &&
              imageState.imageLoaded &&
              !imageState.error &&
              !imageState.isServerUploading && (
                <>
                  <ResizeHandle
                    onPointerDown={handleResizeStart("left")}
                    className={cn("left-1", {
                      hidden: isResizing && activeResizeHandle === "right",
                    })}
                    isResizing={isResizing && activeResizeHandle === "left"}
                  />
                  <ResizeHandle
                    onPointerDown={handleResizeStart("right")}
                    className={cn("right-1", {
                      hidden: isResizing && activeResizeHandle === "left",
                    })}
                    isResizing={isResizing && activeResizeHandle === "right"}
                  />
                </>
              )}
          </div>

          {imageState.error && (
            <ActionWrapper>
              <ActionButton
                icon={<TrashIcon className="size-4" />}
                tooltip="Remove image"
                onClick={onRemoveImg}
              />
            </ActionWrapper>
          )}

          {!isResizing &&
            !imageState.error &&
            !imageState.isServerUploading && (
              <ImageActions
                shouldMerge={shouldMerge}
                isLink={isLink}
                onView={onView}
                onDownload={onDownload}
                onCopy={onCopy}
                onCopyLink={onCopyLink}
              />
            )}
        </div>
      </div>
    </NodeViewWrapper>
  )
}
