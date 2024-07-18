"use client"

import { Button } from "@/components/ui/button"
import { ContentHeader } from "./content-header"
import React, { useState, useEffect, useCallback, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import {
  ChevronDownIcon,
  EllipsisIcon,
  HeartIcon,
  LinkIcon,
  PlusIcon
} from "lucide-react"
import { SortableItem } from "./sortable-item"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Person {
  id: string
  name: string
  email: string
  href: string
  checked: boolean
}

const PEOPLE = [
  {
    id: 1,
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    href: "#"
  },
  {
    id: 2,
    name: "Michael Foster",
    email: "michael.foster@example.com",
    href: "#"
  },
  {
    id: 3,
    name: "Dries Vincent",
    email: "dries.vincent@example.com",
    href: "#"
  },
  {
    id: 4,
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    href: "#"
  },
  {
    id: 5,
    name: "Courtney Henry",
    email: "courtney.henry@example.com",
    href: "#"
  },
  {
    id: 6,
    name: "Tom Cook",
    email: "tom.cook@example.com",
    href: "#"
  }
]

export const InboxWrapper = () => {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <ContentHeader />

      {showCreate && <CreateContent />}

      <PeopleList />
      <Button
        className={cn(
          "absolute bottom-4 right-4 size-12 rounded-full bg-[#274079] p-0 text-white transition-transform hover:bg-[#274079]/90",
          { "rotate-45 transform": showCreate }
        )}
        onClick={() => setShowCreate((prev) => !prev)}
      >
        <PlusIcon className="size-6" />
      </Button>
    </div>
  )
}

const CreateContent: React.FC = () => {
  return (
    <div className="p-3 transition-all">
      <div className="rounded-md border border-primary/5 bg-primary/5">
        <form className="relative min-w-0 flex-1">
          <div className="flex flex-row p-3">
            <div className="flex flex-auto flex-col gap-1.5">
              <div className="flex flex-row items-start justify-between">
                <div className="flex min-w-0 flex-auto flex-row items-center gap-1.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    aria-label="Choose icon"
                    className="size-7 text-primary/60"
                  >
                    <LinkIcon size={16} />
                  </Button>
                  <Input
                    autoComplete="off"
                    maxLength={100}
                    autoFocus
                    placeholder="Paste a link or write a todo"
                    className="h-6 border-none p-1.5 font-medium placeholder:text-primary/40 focus-visible:outline-none focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-1.5 pl-8">
                <Input
                  autoComplete="off"
                  placeholder="Description (optional)"
                  maxLength={255}
                  className="h-6 border-none p-1.5 text-xs font-medium placeholder:text-primary/40 focus-visible:outline-none focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-auto flex-row items-center justify-between gap-2 border-t border-primary/5 px-3 py-2">
            <div className="flex flex-row items-center gap-0.5">
              <div className="flex min-w-0 shrink-0 cursor-pointer select-none flex-row">
                <Button
                  size="sm"
                  type="button"
                  variant="secondary"
                  className="gap-x-2 text-sm text-primary/60"
                >
                  <span className="hidden md:block">No topic</span>
                  <ChevronDownIcon size={16} />
                </Button>
              </div>
            </div>
            <div className="flex w-auto items-center justify-end">
              <div className="flex min-w-0 shrink-0 cursor-pointer select-none flex-row">
                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                  className="gap-x-2 text-sm"
                >
                  <EllipsisIcon size={16} className="text-primary/60" />
                </Button>
                <Button
                  size="icon"
                  type="button"
                  variant="ghost"
                  className="gap-x-2 text-sm"
                >
                  <HeartIcon size={16} className="text-primary/60" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const PeopleList: React.FC = () => {
  const [people, setPeople] = useState<Person[]>(() => {
    const savedPeople = localStorage.getItem("people")
    return savedPeople ? JSON.parse(savedPeople) : []
  })

  useEffect(() => {
    localStorage.setItem("people", JSON.stringify(people))
  }, [people])

  const movePerson = useCallback((dragIndex: number, hoverIndex: number) => {
    setPeople((prevPeople) => {
      const newPeople = [...prevPeople]
      const [draggedPerson] = newPeople.splice(dragIndex, 1)
      newPeople.splice(hoverIndex, 0, draggedPerson)
      return newPeople
    })
  }, [])

  const toggleCheck = useCallback((index: number) => {
    setPeople((prevPeople) => {
      const newPeople = [...prevPeople]
      newPeople[index] = {
        ...newPeople[index],
        checked: !newPeople[index].checked
      }
      return newPeople
    })
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <ul role="list" className="divide-y divide-primary/5">
        {people.map((person, index) => (
          <SortableItem
            key={person.id}
            person={person}
            index={index}
            movePerson={movePerson}
            toggleCheck={toggleCheck}
          />
        ))}
      </ul>
    </DndProvider>
  )
}

export default PeopleList
