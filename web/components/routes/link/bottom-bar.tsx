import React, { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { icons, ZapIcon } from "lucide-react"
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
import { useLinkActions } from "./hooks/use-link-actions"
import { showHotkeyPanelAtom } from "@/store/sidebar"

interface ToolbarButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
	icon: keyof typeof icons
	onClick?: (e: React.MouseEvent) => void
	tooltip?: string
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
	({ icon, onClick, tooltip, ...props }, ref) => {
		const button = (
			<Button variant="ghost" className="h-8 min-w-14" onClick={onClick} ref={ref} {...props}>
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
	}
)

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

	const { deleteLink } = useLinkActions()
	const confirm = useConfirm()

	const [showHotkeyPanel, setShowHotkeyPanel] = useAtom(showHotkeyPanelAtom)

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
			if (!me) return
			deleteLink(me, personalLink)
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
						<ToolbarButton
							icon={"Trash"}
							onClick={handleDelete}
							className="text-destructive hover:text-destructive"
							ref={deleteBtnRef}
						/>
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
			<div className="absolute right-0 top-0 flex h-full items-center justify-center p-2 pr-1">
				<div
					onClick={() => {
						setShowHotkeyPanel(true)
					}}
					className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800"
				>
					<ZapIcon className="h-4 w-4" />
				</div>
			</div>
		</motion.div>
	)
}

LinkBottomBar.displayName = "LinkBottomBar"

export default LinkBottomBar
