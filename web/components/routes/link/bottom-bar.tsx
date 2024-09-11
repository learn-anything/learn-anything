import React, { useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { icons } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getSpecialShortcut, formatShortcut, isMacOS } from "@/lib/utils"
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
	({ icon, onClick, tooltip, ...props }, ref) => {
		const button = (
			<Button variant="ghost" className="h-8 min-w-14" onClick={onClick} ref={ref} {...props}>
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

	const { deleteLink } = useLinkActions()
	const confirm = useConfirm()

	const refs = {
		cancel: useRef<HTMLButtonElement>(null),
		confirm: useRef<HTMLButtonElement>(null),
		overlay: useRef<HTMLDivElement>(null),
		content: useRef<HTMLDivElement>(null),
		delete: useRef<HTMLButtonElement>(null),
		editMore: useRef<HTMLButtonElement>(null),
		plus: useRef<HTMLButtonElement>(null),
		plusMore: useRef<HTMLButtonElement>(null)
	}

	const handleCreateMode = useCallback(() => {
		setEditId(null)
		setTimeout(() => {
			setCreateMode(true)
		}, 100)
	}, [setEditId, setCreateMode])

	useEffect(() => {
		setGlobalLinkFormExceptionRefsAtom(Object.values(refs))
	}, [setGlobalLinkFormExceptionRefsAtom])

	const handleDelete = async (e: React.MouseEvent) => {
		if (!personalLink || !me) return

		const result = await confirm({
			title: `Delete "${personalLink.title}"?`,
			description: "This action cannot be undone.",
			alertDialogTitle: { className: "text-base" },
			alertDialogOverlay: { ref: refs.overlay },
			alertDialogContent: { ref: refs.content },
			cancelButton: { variant: "outline", ref: refs.cancel },
			confirmButton: { variant: "destructive", ref: refs.confirm }
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
	}, [])

	const shortcutKeys = getSpecialShortcut("expandToolbar")
	const shortcutText = formatShortcut(shortcutKeys)

	return (
		<motion.div
			className="bg-background absolute bottom-0 left-0 right-0 border-t"
			animate={{ y: 0 }}
			initial={{ y: "100%" }}
		>
			<AnimatePresence mode="wait">
				{createMode ? (
					<motion.div
						key="expanded"
						className="flex items-center justify-center gap-1 px-2 py-1"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.1 }}
					>
						<ToolbarButton icon="ArrowLeft" onClick={() => setCreateMode(false)} />
						{editId && (
							<ToolbarButton
								icon="Trash"
								onClick={handleDelete}
								className="text-destructive hover:text-destructive"
								ref={refs.delete}
							/>
						)}
						<ToolbarButton icon="Ellipsis" ref={refs.editMore} />
					</motion.div>
				) : (
					<motion.div
						key="collapsed"
						className="flex items-center justify-center gap-1 px-2 py-1"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.1 }}
					>
						<ToolbarButton
							icon="Plus"
							onClick={handleCreateMode}
							tooltip={`New Link (${shortcutText})`}
							ref={refs.plus}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

LinkBottomBar.displayName = "LinkBottomBar"

export default LinkBottomBar
