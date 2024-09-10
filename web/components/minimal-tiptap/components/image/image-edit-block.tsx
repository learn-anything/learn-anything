import type { Editor } from "@tiptap/react"
import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { storeImage } from "@/app/actions"

interface ImageEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
	editor: Editor
	close: () => void
}

const ImageEditBlock = ({ editor, className, close, ...props }: ImageEditBlockProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [link, setLink] = useState<string>("")
	const [isUploading, setIsUploading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

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
			const [response, err] = await storeImage(formData)

			if (err) {
				throw new Error(err.fieldErrors?.file?.join(", "))
			}

			if (response?.fileModel) {
				editor.chain().setImage({ src: response.fileModel.content.src }).focus().run()
				close()
			} else {
				throw new Error("Failed to upload image")
			}
		} catch (error) {
			setError(error instanceof Error ? error.message : "An unknown error occurred")
		} finally {
			setIsUploading(false)
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		handleLink()
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className={cn("space-y-5", className)} {...props}>
				<div className="space-y-1">
					<Label>Attach an image link</Label>
					<div className="flex">
						<Input
							type="url"
							required
							placeholder="https://example.com"
							value={link}
							className="grow"
							onChange={e => setLink(e.target.value)}
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
				{error && <div className="text-destructive text-sm">{error}</div>}
			</div>
		</form>
	)
}

export { ImageEditBlock }
