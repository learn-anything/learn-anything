import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { icons } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { LaIcon } from "@/components/custom/la-icon"
import { useAtom } from "jotai"
import { useConfirm } from "@omit/react-confirm-dialog"
import { useAccount, useCoState } from "@/lib/providers/jazz-provider"
import { PersonalLink } from "@/lib/schema"
import { ID } from "jazz-tools"
import { globalLinkFormExceptionRefsAtom } from "./-link-form"
import { useLinkActions } from "~/hooks/actions/use-link-actions"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { getShortcutKeys } from "@shared/utils"

interface ToolbarButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  icon: keyof typeof icons
  onClick?: (e: React.MouseEvent) => void
  tooltip?: string
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ icon, onClick, tooltip, className, ...props }, ref) => {
    const button = (
      <Button
        variant="ghost"
        className={cn("h-8 min-w-14 p-0", className)}
        onClick={onClick}
        ref={ref}
        {...props}
      >
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
  },
)

ToolbarButton.displayName = "ToolbarButton"

export const LinkBottomBar: React.FC = () => {
  const { create: createMode, editId } = useSearch({
    from: "/_layout/_pages/_protected/links/",
  })
  const navigate = useNavigate()
  const [, setGlobalLinkFormExceptionRefsAtom] = useAtom(
    globalLinkFormExceptionRefsAtom,
  )
  const { me } = useAccount({ root: { personalLinks: [{}] } })
  const personalLink = useCoState(PersonalLink, editId as ID<PersonalLink>)

  const cancelBtnRef = React.useRef<HTMLButtonElement>(null)
  const confirmBtnRef = React.useRef<HTMLButtonElement>(null)
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const deleteBtnRef = React.useRef<HTMLButtonElement>(null)
  const editMoreBtnRef = React.useRef<HTMLButtonElement>(null)
  const plusBtnRef = React.useRef<HTMLButtonElement>(null)
  const plusMoreBtnRef = React.useRef<HTMLButtonElement>(null)

  const { deleteLink } = useLinkActions()
  const confirm = useConfirm()

  const handleCreateMode = React.useCallback(() => {
    navigate({
      to: "/links",
      search: { create: !createMode, editId: undefined },
    })
  }, [createMode, navigate])

  const exceptionRefs = React.useMemo(
    () => [
      overlayRef,
      contentRef,
      deleteBtnRef,
      editMoreBtnRef,
      cancelBtnRef,
      confirmBtnRef,
      plusBtnRef,
      plusMoreBtnRef,
    ],
    [],
  )

  React.useEffect(() => {
    setGlobalLinkFormExceptionRefsAtom(exceptionRefs)
  }, [setGlobalLinkFormExceptionRefsAtom, exceptionRefs])

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!personalLink || !me) return

    const result = await confirm({
      title: `Delete "${personalLink.title}"?`,
      description: "This action cannot be undone.",
      alertDialogTitle: {
        className: "text-base",
      },
      alertDialogOverlay: {
        ref: overlayRef,
      },
      alertDialogContent: {
        ref: contentRef,
      },
      cancelButton: {
        variant: "outline",
        ref: cancelBtnRef,
      },
      confirmButton: {
        variant: "destructive",
        ref: confirmBtnRef,
      },
    })

    if (result) {
      deleteLink(me, personalLink)

      navigate({
        to: "/links",
        search: { create: undefined, editId: undefined },
      })
    }
  }

  const shortcutText = getShortcutKeys(["c"])

  return (
    <div className="min-h-11 border-t">
      <AnimatePresence mode="wait">
        {editId && (
          <motion.div
            key="expanded"
            className="flex h-full items-center justify-center gap-1 border-t px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.1 }}
          >
            <ToolbarButton
              icon={"ArrowLeft"}
              onClick={() => {
                navigate({
                  to: "/links",
                  search: { create: undefined, editId: undefined },
                })
              }}
              aria-label="Go back"
            />
            <ToolbarButton
              icon={"Trash"}
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
              ref={deleteBtnRef}
              aria-label="Delete link"
            />
            <ToolbarButton
              icon={"Ellipsis"}
              ref={editMoreBtnRef}
              aria-label="More options"
            />
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
            {createMode && (
              <ToolbarButton
                icon={"ArrowLeft"}
                onClick={handleCreateMode}
                aria-label="Go back"
              />
            )}
            {!createMode && (
              <ToolbarButton
                icon={"Plus"}
                onClick={handleCreateMode}
                tooltip={`New Link (${shortcutText.map((s) => s.symbol).join("")})`}
                ref={plusBtnRef}
                aria-label="New link"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

LinkBottomBar.displayName = "LinkBottomBar"

export default LinkBottomBar
