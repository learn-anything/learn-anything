import * as React from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { useAccount } from "@/lib/providers/jazz-provider"
import { PageItem } from "./-item"
import { useMedia } from "@/hooks/use-media"
import { useActiveItemScroll } from "@/hooks/use-active-item-scroll"
import { useKeyDown } from "@/hooks/use-key-down"
import { Column } from "~/components/custom/column"

interface PageListProps {}

export const PageList: React.FC<PageListProps> = () => {
  const isTablet = useMedia("(max-width: 640px)")
  const { me } = useAccount({ root: { personalPages: [{ topic: {} }] } })
  const [activeItemIndex, setActiveItemIndex] = React.useState<number | null>(
    null,
  )
  const [keyboardActiveIndex, setKeyboardActiveIndex] = React.useState<
    number | null
  >(null)

  const next = () =>
    Math.min(
      (activeItemIndex ?? 0) + 1,
      (me?.root.personalPages.length ?? 0) - 1,
    )

  const prev = () => Math.max((activeItemIndex ?? 0) - 1, 0)

  const handleKeyDown = (ev: KeyboardEvent) => {
    switch (ev.key) {
      case "ArrowDown":
        ev.preventDefault()
        ev.stopPropagation()
        setActiveItemIndex(next())
        setKeyboardActiveIndex(next())
        break
      case "ArrowUp":
        ev.preventDefault()
        ev.stopPropagation()
        setActiveItemIndex(prev())
        setKeyboardActiveIndex(prev())
    }
  }

  useKeyDown(() => true, handleKeyDown)

  const { setElementRef } = useActiveItemScroll<HTMLAnchorElement>({
    activeIndex: keyboardActiveIndex,
  })

  return (
    <div className="flex h-full w-full flex-col overflow-hidden border-t">
      {!isTablet && <ColumnHeader />}
      <Primitive.div
        className="flex flex-1 flex-col divide-y divide-primary/5 overflow-y-auto outline-none [scrollbar-gutter:stable]"
        tabIndex={-1}
        role="list"
      >
        {me?.root.personalPages.map((page, index) => (
          <PageItem
            key={page.id}
            ref={(el) => setElementRef(el, index)}
            page={page}
            isActive={index === activeItemIndex}
            onPointerMove={() => {
              setKeyboardActiveIndex(null)
              setActiveItemIndex(index)
            }}
            data-keyboard-active={keyboardActiveIndex === index}
          />
        ))}
      </Primitive.div>
    </div>
  )
}

export const useColumnStyles = () => {
  const isTablet = useMedia("(max-width: 640px)")

  return {
    title: {
      "--width": "69px",
      "--min-width": "200px",
      "--max-width": isTablet ? "none" : "auto",
    },
    content: {
      "--width": "auto",
      "--min-width": "200px",
      "--max-width": "200px",
    },
    topic: {
      "--width": "65px",
      "--min-width": "120px",
      "--max-width": "120px",
    },
    updated: {
      "--width": "65px",
      "--min-width": "120px",
      "--max-width": "120px",
    },
  }
}

export const ColumnHeader: React.FC = () => {
  const columnStyles = useColumnStyles()

  return (
    <div className="flex h-8 shrink-0 grow-0 flex-row gap-4 border-b sm:px-6 max-lg:px-4">
      <Column.Wrapper style={columnStyles.title}>
        <Column.Text>Title</Column.Text>
      </Column.Wrapper>
      <Column.Wrapper style={columnStyles.topic}>
        <Column.Text>Topic</Column.Text>
      </Column.Wrapper>
      <Column.Wrapper style={columnStyles.updated}>
        <Column.Text>Updated</Column.Text>
      </Column.Wrapper>
    </div>
  )
}
