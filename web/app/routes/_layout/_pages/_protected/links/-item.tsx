import * as React from "react"
import { useAtom } from "jotai"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LaIcon } from "@/components/custom/la-icon"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { LearningStateSelectorContent } from "@/components/custom/learning-state-selector"
import { PersonalLink } from "@/lib/schema/personal-link"
import { cn, ensureUrlProtocol } from "@/lib/utils"
import { LEARNING_STATES, LearningStateValue } from "@/lib/constants"
import { linkOpenPopoverForIdAtom } from "@/store/link"
import { LinkForm } from "./-link-form"
import { Link } from "@tanstack/react-router"

interface LinkItemProps extends React.HTMLAttributes<HTMLDivElement> {
  personalLink: PersonalLink
  disabled?: boolean
  editId: string | null
  isActive: boolean
  onItemSelected?: (personalLink: PersonalLink) => void
  onFormClose?: () => void
}

export const LinkItem = React.forwardRef<HTMLDivElement, LinkItemProps>(
  (
    {
      personalLink,
      disabled,
      editId,
      isActive,
      onItemSelected,
      onFormClose,
      ...props
    },
    ref,
  ) => {
    const [openPopoverForId, setOpenPopoverForId] = useAtom(
      linkOpenPopoverForIdAtom,
    )
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: personalLink.id, disabled })

    const style = React.useMemo(
      () => ({
        transform: CSS.Transform.toString(transform),
        transition,
      }),
      [transform, transition],
    )

    const selectedLearningState = React.useMemo(
      () =>
        LEARNING_STATES.find((ls) => ls.value === personalLink.learningState),
      [personalLink.learningState],
    )

    const handleLearningStateSelect = React.useCallback(
      (value: string) => {
        const learningState = value as LearningStateValue
        personalLink.learningState =
          personalLink.learningState === learningState
            ? undefined
            : learningState
        setOpenPopoverForId(null)
      },
      [personalLink, setOpenPopoverForId],
    )

    const handleKeyDown = React.useCallback(
      (ev: React.KeyboardEvent<HTMLDivElement>) => {
        if (ev.key === "Enter") {
          ev.preventDefault()
          ev.stopPropagation()
          onItemSelected?.(personalLink)
        }
      },
      [personalLink, onItemSelected],
    )

    if (editId === personalLink.id) {
      return (
        <LinkForm
          onClose={onFormClose}
          personalLink={personalLink}
          onSuccess={onFormClose}
          onFail={() => {}}
        />
      )
    }

    return (
      <div
        ref={(node) => {
          setNodeRef(node)
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        style={style as React.CSSProperties}
        {...props}
        {...attributes}
        {...listeners}
        tabIndex={0}
        onDoubleClick={() => onItemSelected?.(personalLink)}
        aria-disabled={disabled}
        aria-selected={isActive}
        data-disabled={disabled}
        data-active={isActive}
        className={cn(
          "w-full cursor-default overflow-visible border-b-[0.5px] border-transparent outline-none",
          "data-[active='true']:bg-[var(--link-background-muted-new)] data-[keyboard-active='true']:focus-visible:shadow-[var(--link-shadow)_0px_0px_0px_1px_inset]",
        )}
        onKeyDown={handleKeyDown}
      >
        <div
          className={cn(
            "w-full grow overflow-visible outline-none",
            "flex items-center gap-x-2 py-2 sm:px-5 sm:py-2 max-lg:px-4",
          )}
        >
          <Popover
            open={openPopoverForId === personalLink.id}
            onOpenChange={(open: boolean) =>
              setOpenPopoverForId(open ? personalLink.id : null)
            }
          >
            <PopoverTrigger asChild>
              <Button
                size="sm"
                type="button"
                role="combobox"
                variant="ghost"
                className="size-7 shrink-0 cursor-default p-0 text-muted-foreground/75 hover:bg-inherit hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
              >
                {selectedLearningState?.icon ? (
                  <LaIcon
                    name={selectedLearningState.icon}
                    className={cn(selectedLearningState.className)}
                  />
                ) : (
                  <LaIcon name="Circle" strokeWidth={2.5} />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-52 rounded-lg p-0"
              side="bottom"
              align="start"
            >
              <LearningStateSelectorContent
                showSearch={false}
                searchPlaceholder="Search state..."
                value={personalLink.learningState}
                onSelect={handleLearningStateSelect}
              />
            </PopoverContent>
          </Popover>

          <div className="flex min-w-0 flex-col items-start gap-y-1.5 overflow-hidden md:flex-row md:items-center md:gap-x-2">
            <div className="flex items-center gap-x-1.5">
              {personalLink.icon && (
                <img
                  src={personalLink.icon as string}
                  alt={personalLink.title}
                  className="size-4 shrink-0 rounded-full"
                  width={16}
                  height={16}
                />
              )}
              <p className="line-clamp-1 text-sm font-medium text-primary hover:text-primary">
                {personalLink.title}
              </p>
            </div>
            {personalLink.url && (
              <div className="flex min-w-0 shrink items-center gap-x-1 text-muted-foreground">
                <LaIcon
                  name="Link"
                  aria-hidden="true"
                  className="size-3 flex-none"
                />
                <Link
                  to={ensureUrlProtocol(personalLink.url)}
                  target="_blank"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    e.stopPropagation()
                  }
                  className="mr-1 truncate text-xs hover:text-primary"
                >
                  {personalLink.url}
                </Link>
              </div>
            )}
          </div>

          <div className="flex-1"></div>

          <div className="flex shrink-0 items-center justify-end">
            {personalLink.topic && (
              <Badge
                variant="secondary"
                className="border-muted-foreground/25 font-medium"
              >
                {personalLink.topic.prettyName}
              </Badge>
            )}
          </div>
        </div>

        <div className="relative h-[0.5px] w-full after:absolute after:left-0 after:right-0 after:block after:h-full after:bg-[var(--la-border-new)]"></div>
      </div>
    )
  },
)

LinkItem.displayName = "LinkItem"
