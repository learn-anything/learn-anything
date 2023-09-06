import { Editor, Extension } from "@tiptap/core"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state"
import { Node as PMNode } from "@tiptap/pm/model"
import { keymap } from "@tiptap/pm/keymap"

import { defaultKeymap, KeyType } from "./defaultKeymap"
import { Action, Actions, Motion, Motions, VimModes } from "./types"

const mappedDefaultKeyMap: Record<string, KeyType> = {}

for (const key of defaultKeymap) {
  mappedDefaultKeyMap[key.keys] = key
}

let editor: Editor

let decorationSet: DecorationSet

let prosemirror: HTMLDivElement

const { log } = console

const VimModesList = [
  VimModes.Normal,
  VimModes.Insert,
  VimModes.Visual,
  VimModes.Command,
  VimModes.Replace,
]

const wordSeparators = "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/? "

enum TransactionMeta {
  ChangeModeTo = "changeModeTo",
  SetShowCursor = "setShowCursor",
}

let currentVimMode: VimModes = VimModes.Normal

let showCursor: boolean = false

let cursorDecoration: Decoration

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    vim: {
      /**
       * Example Command description.
       */
      // exampleCommand: () => ReturnType,
    }
    history: {
      /**
       * Undo recent changes
       */
      undo: () => ReturnType
      /**
       * Reapply reverted changes
       */
      redo: () => ReturnType
    }
  }
}

type MotionsInterface = {
  [key in Motions]: Motion
}

const motions: MotionsInterface = {
  [Motions.MoveToRight]: ({
    editor: {
      state,
      view: { dispatch },
    },
  }) => {
    if (currentVimMode === VimModes.Insert) return false

    const { doc } = state

    const { from, to } = state.selection

    const [$from, $to] = [doc.resolve(from + 1), doc.resolve(to + 1)]

    const selection = new TextSelection($from, $to)

    dispatch(state.tr.setSelection(selection))

    return true
  },
  [Motions.MoveToLeft]: ({
    editor: {
      state,
      view: { dispatch },
    },
  }) => {
    if (currentVimMode === VimModes.Insert) return false

    const { doc } = state

    const { from, to } = state.selection

    const [$from, $to] = [doc.resolve(from - 1), doc.resolve(to - 1)]

    const selection = new TextSelection($from, $to)

    dispatch(state.tr.setSelection(selection))

    return true
  },
  [Motions.FocusStart]: ({ editor }) => {
    if (currentVimMode === VimModes.Insert) return false

    return editor.commands.focus("start")
  },
  [Motions.FocusEnd]: ({ editor }) => {
    if (currentVimMode === VimModes.Insert) return false

    return editor.commands.focus("end")
  },

  [Motions.WordJumpForward]: ({
    editor: {
      state,
      view: { dispatch },
    },
  }) => {
    if (currentVimMode === VimModes.Insert) return false

    const { doc, selection } = state

    const { from, to } = selection

    if (from !== to) return false

    const nodeWithPos = {
      node: undefined,
      pos: 0,
      to: 0,
    } as { node?: PMNode; pos: number; to: number }

    doc.descendants((node, pos, parent) => {
      if (!node.isBlock || nodeWithPos.node) return

      const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize]

      if (nodeFrom <= from && from <= nodeTo) {
        nodeWithPos.node = node
        nodeWithPos.pos = pos
        nodeWithPos.to = nodeTo
      }
    })

    const content = nodeWithPos.node?.textContent

    if (!content)
      throw new Error(
        "If theres no content, where the hell are you pressing the W from?"
      )

    const inlineSelectionIndex = from - nodeWithPos.pos

    let foundSeparator = false
    let indexToJump: number | undefined = undefined

    for (let i = inlineSelectionIndex; i < nodeWithPos.to; i += 1) {
      const currentChar = content[i]

      if (wordSeparators.includes(currentChar)) foundSeparator = true

      if (foundSeparator) {
        indexToJump = i + 2
        break // breaking since we already found the index we want to jump to
      }
    }

    if (!indexToJump) return false

    const newPos = doc.resolve(nodeWithPos.pos + indexToJump)

    const newSelection = new TextSelection(newPos, newPos)

    dispatch(state.tr.setSelection(newSelection))

    return true
  },
  [Motions.WordJumpBackward]: ({
    editor: {
      state,
      view: { dispatch },
    },
  }) => {
    if (currentVimMode === VimModes.Insert) return false

    const { doc, selection } = state

    const { from, to } = selection

    if (from !== to) return false

    const nodeWithPos = {
      node: undefined,
      pos: 0,
      to: 0,
    } as { node?: PMNode; pos: number; to: number }

    doc.descendants((node, pos, parent) => {
      if (!node.isBlock || nodeWithPos.node) return

      const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize]

      if (nodeFrom <= from && from <= nodeTo) {
        nodeWithPos.node = node
        nodeWithPos.pos = pos
        nodeWithPos.to = nodeTo
      }
    })

    const content = nodeWithPos.node?.textContent

    if (!content)
      throw new Error(
        'If theres no content, where the hell are you pressing the "b" from?'
      )

    const inlineSelectionIndex = from - nodeWithPos.pos

    let foundSeparator = false
    let indexToJump: number | undefined = undefined

    for (let i = inlineSelectionIndex - 3; i > 0; i -= 1) {
      const currentChar = content[i]

      if (
        wordSeparators.includes(currentChar) &&
        !wordSeparators.includes(content[i + 1])
      ) {
        foundSeparator = true
        indexToJump = i + 1
        break // breaking since we already found the index we want to jump to
      }
    }

    if (!indexToJump) return false

    const newPos = doc.resolve(nodeWithPos.pos + indexToJump + 1)

    const newSelection = new TextSelection(newPos, newPos)

    dispatch(state.tr.setSelection(newSelection))

    return true
  },
}

type ActionsInterface = {
  [key in Actions]: Action
}

const actions: ActionsInterface = {
  [Actions.EnterInsertMode]: ({
    editor: {
      state: { tr },
      view: { dispatch },
    },
  }) => {
    dispatch(tr.setMeta(TransactionMeta.ChangeModeTo, VimModes.Insert))

    return true
  },
  [Actions.EnterNormalMode]: ({
    editor: {
      state: { selection, doc, tr },
      view: { dispatch },
    },
  }) => {
    let { from, to } = selection

    from = from - 1
    to = to - 1

    if (from <= 0 && to <= 0) {
      from = 1
      to = 1
    }

    const [$from, $to] = [doc.resolve(from), doc.resolve(to)]

    const newSelection = new TextSelection($from, $to)

    tr = tr.setMeta(TransactionMeta.ChangeModeTo, VimModes.Normal)
    tr = tr.setMeta(TransactionMeta.SetShowCursor, false)

    if (currentVimMode === VimModes.Insert) tr = tr.setSelection(newSelection)

    dispatch(tr)

    return true
  },
  [Actions.Undo]: ({ editor }) => {
    if (currentVimMode === VimModes.Insert) return false

    return editor.commands.undo()
  },
  [Actions.Redo]: () => {
    if (currentVimMode === VimModes.Insert) return false

    return editor.commands.redo()
  },
}

interface VimirrorOptions {
  updateValue: ({ mode }: { mode: string }) => void
}

const Vimirror = Extension.create<VimirrorOptions>({
  name: "vimirror",

  addOptions() {
    return {
      // allowing user to be informed about updates about VIM modes/keys and stuff
      updateValue: () => {},
    }
  },

  addStorage() {
    return {

    }
  }

  addProseMirrorPlugins() {
    editor = this.editor
    const options = this.options

    const vimModesPlugin = new Plugin({
      key: new PluginKey("vimPlugin"),

      props: {
        decorations(state) {
          return this.getState(state).decorationSet
        },
        attributes() {
          return {
            "vim-active": "true",
            mode: currentVimMode,
            "show-cursor": showCursor ? "true" : "false",
          }
        },
        handleDOMEvents: {
          keypress: (view, event) => {
            // this only serves purpose of not letting any keys work while escape mode
            if (currentVimMode !== VimModes.Insert) event.preventDefault()

            return true

            // if (event.key === 'i') mode = VimModes.Insert

            // debugger
            // if (event.key === 'Escape') mode = VimModes.Normal

            // event.stopImmediatePropagation()
            // event.stopPropagation()

            // if (mode === VimModes.Insert) {
            //   return false
            // }

            // return false
          },
        },
      },

      state: {
        init: (_, state) => {
          const { from, to } = state.selection

          cursorDecoration = Decoration.inline(from, to + 1, {
            class: "vim-cursor",
          })

          options.updateValue({ mode: currentVimMode })

          decorationSet = DecorationSet.create(state.doc, [cursorDecoration])

          return { mode: currentVimMode, decorationSet }
        },
        apply: (tr, _, __, newState) => {
          let { from, to } = newState.selection

          cursorDecoration = Decoration.inline(from, to + 1, {
            class: "vim-cursor",
          })

          // log(from, to)

          const changeModeTo: VimModes = tr.getMeta(
            TransactionMeta.ChangeModeTo
          )

          if (VimModesList.includes(changeModeTo)) {
            currentVimMode = changeModeTo
            // console.log('newMode:- ', mode)

            options.updateValue({ mode: currentVimMode })
          }

          const showCursorVal: boolean = tr.getMeta(
            TransactionMeta.SetShowCursor
          )

          if ([true, false].includes(showCursorVal)) showCursor = showCursorVal

          decorationSet = DecorationSet.create(newState.doc, [cursorDecoration])

          return { mode: currentVimMode, decorationSet }
        },
      },

      view(view) {
        return {
          update() {
            const pm = document.querySelector("div.ProseMirror")

            if (pm) prosemirror = pm as HTMLDivElement
          },
        }
      },
    })

    // const vimKeyMapPlugin = keymap({
    //   'a': (state, dispatch, view) => {
    //     if (mode === VimModes.Insert || !dispatch) return false

    //     const { selection, doc} = state

    //     const { from, to } = selection

    //     const [$from, $to] = [doc.resolve(from + 1), doc.resolve(to + 1)]

    //     const newSelection = new TextSelection($from, $to)

    //     const tr = state.tr.setSelection(newSelection)

    //     tr.setMeta(TransactionMeta.ChangeModeTo, VimModes.Insert)

    //     {
    //       const nodeWithPos = {
    //         node: undefined,
    //         pos: 0,
    //         to: 0
    //       } as { node?: PMNode, pos: number, to: number }

    //       doc.descendants((node, pos, parent) => {
    //         if (!node.isBlock || nodeWithPos.node) return

    //         const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize]

    //         if ((nodeFrom <= from) && (from <= nodeTo)) {
    //           nodeWithPos.node = node
    //           nodeWithPos.pos = pos
    //           nodeWithPos.to = nodeTo
    //         }
    //       })

    //       if (nodeWithPos.node) {
    //         if (to + 1 === nodeWithPos.to - 1) tr.setMeta(TransactionMeta.SetShowCursor, true)
    //         debugger
    //       }
    //     }

    //     dispatch(tr)

    //     return true
    //   },

    //   'j': (state, dispatch, view) => {
    //     if (!dispatch) return false

    //     const modesOfJ = [VimModes.Normal, VimModes.Visual, VimModes.Command]

    //     if (modesOfJ.includes(mode)) {
    //       // TODO: go down
    //       return true
    //     }

    //     return false
    //   },
    //   'k': (state, dispatch, view) => {
    //     if (!dispatch) return false

    //     const modesOfK = [VimModes.Normal, VimModes.Visual, VimModes.Command]

    //     if (modesOfK.includes(mode)) {
    //       // TODO: go up
    //       return true
    //     }

    //     return false
    //   },

    //   'I': (state, dispatch, view) => {
    //     if (mode === VimModes.Insert || !dispatch) return false

    //     const { doc, selection } = state

    //     const { from, to } = selection

    //     if (from !== to) return false

    //     const nodeWithPos = {
    //       node: undefined,
    //       pos: 0,
    //       to: 0
    //     } as { node?: PMNode, pos: number, to: number }

    //     doc.descendants((node, pos, parent) => {
    //       if (!node.isBlock || nodeWithPos.node) return

    //       const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize]

    //       if ((nodeFrom <= from) && (from <= nodeTo)) {
    //         nodeWithPos.node = node
    //         nodeWithPos.pos = pos
    //         nodeWithPos.to = nodeTo
    //       }
    //     })

    //     const newPos = doc.resolve(nodeWithPos.pos + 1)

    //     const newSelection = new TextSelection(newPos, newPos)

    //     const tr = state.tr.setSelection(newSelection)
    //     tr.setMeta(TransactionMeta.ChangeModeTo, VimModes.Insert)

    //     dispatch(tr)

    //     return true
    //   },

    //   'A': (state, dispatch, view) => {
    //     if (mode === VimModes.Insert || !dispatch) return false

    //     const { doc, selection } = state

    //     const { from, to } = selection

    //     const nodeWithPos = {
    //       node: undefined,
    //       pos: 0,
    //       to: 0
    //     } as { node?: PMNode, pos: number, to: number }

    //     doc.descendants((node, pos, parent) => {
    //       if (!node.isBlock || nodeWithPos.node) return

    //       const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize]

    //       if ((nodeFrom <= from) && (from <= nodeTo)) {
    //         nodeWithPos.node = node
    //         nodeWithPos.pos = pos
    //         nodeWithPos.to = nodeTo
    //       }
    //     })

    //     if (!nodeWithPos.node) return false

    //     const newPos = doc.resolve(nodeWithPos.to - 1)

    //     const newSelection = new TextSelection(newPos, newPos)

    //     const tr = state.tr.setSelection(newSelection)
    //     tr.setMeta(TransactionMeta.ChangeModeTo, VimModes.Insert)
    //     tr.setMeta(TransactionMeta.SetShowCursor, true)

    //     dispatch(tr)

    //     return true
    //   },

    //   /**
    //    * delete only the current character under cursor
    //    */
    //   'x':  (state, dispatch, view) => {
    //     if (mode === VimModes.Insert || !dispatch) return false

    //     const { selection, doc } = state

    //     const { from, to, $from, $to } = selection

    //     dispatch(state.tr.delete(from, to + 1))

    //     return true
    //   },

    //   // undo
    //   'u': (state, dispatch, view) => {
    //     if (mode === VimModes.Insert || !dispatch) return false

    //     editor.commands.undo?.()

    //     return true
    //   },

    //   // redo
    //   'Ctrl-r': (state, dispatch, view) => {
    //     if (mode === VimModes.Insert || !dispatch) return false

    //     editor.commands.redo?.()

    //     return true
    //   }
    // })

    const handleKey = ({
      keys,
      type,
      motion,
      mode,
      action,
    }: KeyType): boolean => {
      if (mode && mode !== currentVimMode) return false

      if (type === "motion" && motion && motions[motion])
        return motions[motion]({ editor })

      if (type === "action" && action && actions[action])
        return actions[action]({ editor })

      return false
    }

    const baseVimKeyMap: Record<string, Function> = {}

    for (const [keyString, key] of Object.entries(mappedDefaultKeyMap)) {
      baseVimKeyMap[keyString] = () => handleKey(key)
    }

    const vimKeyMap = keymap(baseVimKeyMap as any)

    return [vimModesPlugin, vimKeyMap]
  },

  addCommands() {
    return {
      // getMode: () => () => mode
    }
  },
})

export { Vimirror }
