import * as React from 'react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { Command, MenuListProps } from './types'
import { getShortcutKeys } from '../../lib/utils'
import { Icon } from '../../components/ui/icon'
import { PopoverWrapper } from '../../components/ui/popover-wrapper'
import { Shortcut } from '../../components/ui/shortcut'

export const MenuList = React.forwardRef((props: MenuListProps, ref) => {
  const scrollContainer = React.useRef<HTMLDivElement>(null)
  const activeItem = React.useRef<HTMLButtonElement>(null)
  const [selectedGroupIndex, setSelectedGroupIndex] = React.useState(0)
  const [selectedCommandIndex, setSelectedCommandIndex] = React.useState(0)

  // Anytime the groups change, i.e. the user types to narrow it down, we want to
  // reset the current selection to the first menu item
  React.useEffect(() => {
    setSelectedGroupIndex(0)
    setSelectedCommandIndex(0)
  }, [props.items])

  const selectItem = React.useCallback(
    (groupIndex: number, commandIndex: number) => {
      const command = props.items[groupIndex].commands[commandIndex]
      props.command(command)
    },
    [props],
  )

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
      if (event.key === 'ArrowDown') {
        if (!props.items.length) {
          return false
        }

        const commands = props.items[selectedGroupIndex].commands

        let newCommandIndex = selectedCommandIndex + 1
        let newGroupIndex = selectedGroupIndex

        if (commands.length - 1 < newCommandIndex) {
          newCommandIndex = 0
          newGroupIndex = selectedGroupIndex + 1
        }

        if (props.items.length - 1 < newGroupIndex) {
          newGroupIndex = 0
        }

        setSelectedCommandIndex(newCommandIndex)
        setSelectedGroupIndex(newGroupIndex)

        return true
      }

      if (event.key === 'ArrowUp') {
        if (!props.items.length) {
          return false
        }

        let newCommandIndex = selectedCommandIndex - 1
        let newGroupIndex = selectedGroupIndex

        if (newCommandIndex < 0) {
          newGroupIndex = selectedGroupIndex - 1
          newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0
        }

        if (newGroupIndex < 0) {
          newGroupIndex = props.items.length - 1
          newCommandIndex = props.items[newGroupIndex].commands.length - 1
        }

        setSelectedCommandIndex(newCommandIndex)
        setSelectedGroupIndex(newGroupIndex)

        return true
      }

      if (event.key === 'Enter') {
        if (!props.items.length || selectedGroupIndex === -1 || selectedCommandIndex === -1) {
          return false
        }

        selectItem(selectedGroupIndex, selectedCommandIndex)

        return true
      }

      return false
    },
  }))

  React.useEffect(() => {
    if (activeItem.current && scrollContainer.current) {
      const offsetTop = activeItem.current.offsetTop
      const offsetHeight = activeItem.current.offsetHeight

      scrollContainer.current.scrollTop = offsetTop - offsetHeight
    }
  }, [selectedCommandIndex, selectedGroupIndex])

  const createCommandClickHandler = React.useCallback(
    (groupIndex: number, commandIndex: number) => {
      return () => {
        selectItem(groupIndex, commandIndex)
      }
    },
    [selectItem],
  )

  if (!props.items.length) {
    return null
  }

  return (
    <PopoverWrapper ref={scrollContainer} className="flex max-h-[min(80vh,24rem)] flex-col overflow-auto p-1">
      {props.items.map((group, groupIndex: number) => (
        <React.Fragment key={group.title}>
          {group.commands.map((command: Command, commandIndex: number) => (
            <Button
              key={command.label}
              variant="ghost"
              onClick={createCommandClickHandler(groupIndex, commandIndex)}
              className={cn('relative w-full justify-between gap-2 px-3.5 py-1.5 font-normal', {
                'bg-accent text-accent-foreground':
                  selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex,
              })}
            >
              <Icon name={command.iconName} />
              <span className="truncate text-sm">{command.label}</span>
              <div className="flex flex-auto flex-row"></div>
              <Shortcut.Wrapper ariaLabel={getShortcutKeys(command.shortcuts)}>
                {command.shortcuts.map(shortcut => (
                  <Shortcut.Key shortcut={shortcut} key={shortcut} />
                ))}
              </Shortcut.Wrapper>
            </Button>
          ))}
          {groupIndex !== props.items.length - 1 && <Separator className="my-1.5" />}
        </React.Fragment>
      ))}
    </PopoverWrapper>
  )
})

MenuList.displayName = 'MenuList'

export default MenuList
