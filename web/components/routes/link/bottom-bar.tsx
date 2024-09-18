import React, { useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { icons } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getSpecialShortcut, formatShortcut, isMacOS, cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import { useAtom } from "jotai"
import { parseAsBoolean, useQueryState } from "nuqs"
import { useConfirm } from "@omit/react-confirm-dialog"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { PersonalLink } from "@/lib/schema"
import { ID } from "jazz-tools"
import { globalLinkFormExceptionRefsAtom } from "./partials/form/link-form"
import { useLinkActions } from "./hooks/use-link-actions"

interface ToolbarButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
	icon: keyof typeof icons
	onClick?: (e: React.MouseEvent) => void
	tooltip?: string
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
	({ icon, onClick, tooltip, className, ...props }, ref) => {
		const button = (
			<Button variant="ghost" className={cn("h-8 min-w-14 p-0", className)} onClick={onClick} ref={ref} {...props}>
				<LaIcon name={icon} />
			</Button>
		)

		if (tooltip) {
			return (
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>{button}</TooltipTrigger>
					<TooltipContent>
						<p>{tooltip}</p>
					</TooltipContent>
				</Tooltip>
			)
		}

		return button
	}
)

ToolbarButton.displayName = "ToolbarButton"

export const LinkBottomBar: React.FC = () => {
	const [editId, setEditId] = useQueryState("editId")
	const [createMode, setCreateMode] = useQueryState("create", parseAsBoolean)
	const [, setGlobalLinkFormExceptionRefsAtom] = useAtom(globalLinkFormExceptionRefsAtom)
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

	const handleCreateMode = useCallback(() => {
		setEditId(null)
		setTimeout(() => {
			setCreateMode(prev => !prev)
		}, 100)
	}, [setEditId, setCreateMode])

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
		if (!personalLink || !me) return

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
			deleteLink(me, personalLink)
			setEditId(null)
		}
	}

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const isCreateShortcut = isMacOS()
				? event.ctrlKey && event.metaKey && event.key.toLowerCase() === "n"
				: event.ctrlKey && event.key.toLowerCase() === "n" && (event.metaKey || event.altKey)

			if (isCreateShortcut) {
				event.preventDefault()
				handleCreateMode()
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [handleCreateMode])

	const shortcutKeys = getSpecialShortcut("expandToolbar")
	const shortcutText = formatShortcut(shortcutKeys)

	return (
		<motion.div
			className="bg-background absolute bottom-0 left-0 right-0 h-11 border-t"
			animate={{ y: 0 }}
			initial={{ y: "100%" }}
		>
			<AnimatePresence mode="wait">
				{editId && (
					<motion.div
						key="expanded"
						className="flex h-full items-center justify-center gap-1 px-2"
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
						className="flex h-full items-center justify-center gap-1 px-2"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.1 }}
					>
						{createMode && <ToolbarButton icon={"ArrowLeft"} onClick={handleCreateMode} />}
						{!createMode && (
							<ToolbarButton
								icon={"Plus"}
								onClick={handleCreateMode}
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
