"use client"

import { DndProvider as BaseDndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

export const DndProvider = ({ children }: { children: React.ReactNode }) => {
  return <BaseDndProvider backend={HTML5Backend}>{children}</BaseDndProvider>
}
