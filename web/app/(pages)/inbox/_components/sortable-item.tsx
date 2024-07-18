import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { LinkIcon } from "lucide-react"
import React, { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"

interface Person {
  id: string
  name: string
  email: string
  href: string
  checked: boolean
}

const ItemTypes = {
  PERSON: "person"
}

interface SortableItemProps {
  person: Person
  index: number
  movePerson: (dragIndex: number, hoverIndex: number) => void
  toggleCheck: (index: number) => void
}

const SortableItem: React.FC<SortableItemProps> = ({
  person,
  index,
  movePerson,
  toggleCheck
}) => {
  const ref = useRef<HTMLLIElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PERSON,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.PERSON,
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      movePerson(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    }
  })

  drag(drop(ref))

  const opacity = isDragging ? 0.5 : 1

  return (
    <li
      ref={ref}
      className={cn("relative py-3 hover:bg-muted/40")}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className="px-4">
        <div className="flex justify-between gap-x-6">
          <div className="flex min-w-0 gap-x-4">
            <Checkbox
              checked={person.checked}
              onChange={() => toggleCheck(index)}
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold text-primary/80 hover:text-primary">
                <a href={person.href}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {person.name}
                </a>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <LinkIcon
              aria-hidden="true"
              className="size-4 flex-none text-primary/40"
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export { SortableItem }
