import { Editor } from "@tiptap/core"

export enum VimModes {
  Normal = "normal",
  Insert = "insert",
  Visual = "visual",
  Command = "command",
  Replace = "replace",
}

export type Motion = ({ editor }: { editor: Editor }) => boolean

export enum Motions {
  MoveToRight = "moveToRight",
  MoveToLeft = "moveToLeft",
  FocusStart = "focusStart",
  FocusEnd = "focusEnd",
  WordJumpForward = "wordJumpForward",
  WordJumpBackward = "wordJumpBackward",
}

export type Action = ({ editor }: { editor: Editor }) => boolean

export enum Actions {
  EnterInsertMode = "enterInsertMode",
  EnterNormalMode = "enterNormalMode",
  Undo = "undo",
  Redo = "redo",
}
