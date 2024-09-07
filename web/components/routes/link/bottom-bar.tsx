import React, { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { icons } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getSpecialShortcut, formatShortcut, isMacOS } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import { useAtom } from "jotai"
import { linkShowCreateAtom } from "@/store/link"
import { useQueryState } from "nuqs"
import { useConfirm } from "@omit/react-confirm-dialog"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { PersonalLink } from "@/lib/schema"
import { ID } from "jazz-tools"
import { globalLinkFormExceptionRefsAtom } from "./partials/form/link-form"
import { toast } from "sonner"

interface ToolbarButtonProps {
	icon: keyof typeof icons
	onClick?: (e: React.MouseEvent) => void
	tooltip?: string
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(({ icon, onClick, tooltip }, ref) => {
	const button = (
		<Button variant="ghost" className="h-8 min-w-14" onClick={onClick} ref={ref}>
			<LaIcon name={icon} />
		</Button>
	)

	if (tooltip) {
		return (
			<TooltipProvider>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>{button}</TooltipTrigger>
					<TooltipContent>
						<p>{tooltip}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		)
	}

	return button
})

ToolbarButton.displayName = "ToolbarButton"

export const LinkBottomBar: React.FC = () => {
	const [editId, setEditId] = useQueryState("editId")
	const [, setGlobalLinkFormExceptionRefsAtom] = useAtom(globalLinkFormExceptionRefsAtom)
	const [showCreate, setShowCreate] = useAtom(linkShowCreateAtom)

	const { me } = useAccount({ root: { personalLinks: [] } })
	const personalLink = useCoState(PersonalLink, editId as ID<PersonalLink>)

	const cancelBtnRef = useRef<HTMLButtonElement>(null)
	const confirmBtnRef = useRef<HTMLButtonElement>(null)
	const overlayRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)

	const deleteBtnRef = useRef<HTMLButtonElement>(null)
	const editMoreBtnRef = useRef<HTMLButtonElement>(null)
	const plusBtnRef = useRef<HTMLButtonElement>(null)
	const plusMoreBtnRef = useRef<HTMLButtonElement>(null)

	const confirm = useConfirm()

	useEffect(() => {
		setGlobalLinkFormExceptionRefsAtom([
			overlayRef,
			contentRef,
			deleteBtnRef,
			editMoreBtnRef,
			cancelBtnRef,
			confirmBtnRef,
			plusBtnRef,
			plusMoreBtnRef
		])
	}, [setGlobalLinkFormExceptionRefsAtom])

	const handleDelete = async (e: React.MouseEvent) => {
		if (!personalLink) return

		const result = await confirm({
			title: `Delete "${personalLink.title}"?`,
			description: "This action cannot be undone.",
			alertDialogTitle: {
				className: "text-base"
			},
			alertDialogOverlay: {
				ref: overlayRef
			},
			alertDialogContent: {
				ref: contentRef
			},
			cancelButton: {
				variant: "outline",
				ref: cancelBtnRef
			},
			confirmButton: {
				variant: "destructive",
				ref: confirmBtnRef
			}
		})

		if (result) {
			if (!me?.root.personalLinks) return

			const index = me.root.personalLinks.findIndex(item => item?.id === personalLink.id)
			if (index === -1) {
				console.error("Delete operation fail", { index, personalLink })
				return
			}

			toast.success("Link deleted.", {
				position: "bottom-right",
				description: (
					<span>
						<strong>{personalLink.title}</strong> has been deleted.
					</span>
				)
			})

			me.root.personalLinks.splice(index, 1)
			setEditId(null)
		}
	}

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (isMacOS()) {
				if (event.ctrlKey && event.metaKey && event.key.toLowerCase() === "n") {
					event.preventDefault()
					setShowCreate(true)
				}
			} else {
				// For Windows, we'll use Ctrl + Win + N
				// Note: The Windows key is not directly detectable in most browsers
				if (event.ctrlKey && event.key.toLowerCase() === "n" && (event.metaKey || event.altKey)) {
					event.preventDefault()
					setShowCreate(true)
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [setShowCreate])

	const shortcutKeys = getSpecialShortcut("expandToolbar")
	const shortcutText = formatShortcut(shortcutKeys)

	return (
		<motion.div
			className="bg-background absolute bottom-0 left-0 right-0 border-t"
			animate={{ y: 0 }}
			initial={{ y: "100%" }}
		>
			<AnimatePresence mode="wait">
				{editId && (
					<motion.div
						key="expanded"
						className="flex items-center justify-center gap-1 px-2 py-1"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.1 }}
					>
						<ToolbarButton icon={"ArrowLeft"} onClick={() => setEditId(null)} />
						<ToolbarButton icon={"Trash"} onClick={handleDelete} ref={deleteBtnRef} />
						<ToolbarButton icon={"Ellipsis"} ref={editMoreBtnRef} />
					</motion.div>
				)}

				{!editId && (
					<motion.div
						key="collapsed"
						className="flex items-center justify-center gap-1 px-2 py-1"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.1 }}
					>
						{showCreate && <ToolbarButton icon={"ArrowLeft"} onClick={() => setShowCreate(true)} />}
						{!showCreate && (
							<ToolbarButton
								icon={"Plus"}
								onClick={() => setShowCreate(true)}
								tooltip={`New Link (${shortcutText})`}
								ref={plusBtnRef}
							/>
						)}
						{/* <ToolbarButton icon={"Ellipsis"} ref={plusMoreBtnRef} /> */}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

LinkBottomBar.displayName = "LinkBottomBar"

export default LinkBottomBar
