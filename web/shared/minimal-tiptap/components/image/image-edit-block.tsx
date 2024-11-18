import * as React from "react"
import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { storeImageFn } from "@shared/actions"
import { ZodError } from "zod"

interface ImageEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  editor: Editor
  close: () => void
}

const ImageEditBlock = ({
  editor,
  className,
  close,
  ...props
}: ImageEditBlockProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [link, setLink] = React.useState<string>("")
  const [isUploading, setIsUploading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleLink = () => {
    editor.chain().focus().setImage({ src: link }).run()
    close()
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", files[0])

    try {
      const response = await storeImageFn({ data: formData })

      editor
        .chain()
        .setImage({ src: response.fileModel.content.src })
        .focus()
        .run()
      close()
    } catch (error) {
      if (error instanceof Error) {
        try {
          const errors = JSON.parse(error.message)
          if (errors.body.name === "ZodError") {
            setError(
              (errors.body as ZodError).issues
                .map((issue) => issue.message)
                .join(", "),
            )
          } else {
            setError(error.message)
          }
        } catch (parseError) {
          setError(error.message)
        }
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleLink()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={cn("space-y-6", className)} {...props}>
        <div className="space-y-1">
          <Label>Attach an image link</Label>
          <div className="flex">
            <Input
              type="url"
              required
              placeholder="https://example.com"
              value={link}
              className="grow"
              onChange={(e) => setLink(e.target.value)}
            />
            <Button type="submit" className="ml-2 inline-block">
              Submit
            </Button>
          </div>
        </div>
        <Button className="w-full" onClick={handleClick} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload from your computer"}
        </Button>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFile}
        />
        {error && (
          <div className="rounded bg-destructive/10 p-2 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    </form>
  )
}

export { ImageEditBlock }
