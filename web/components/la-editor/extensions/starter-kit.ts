import { Extension } from '@tiptap/core'
import { Bold, BoldOptions } from '@tiptap/extension-bold'
import { Document } from '@tiptap/extension-document'
import { Gapcursor } from '@tiptap/extension-gapcursor'
import { HardBreak, HardBreakOptions } from '@tiptap/extension-hard-break'
import { Italic, ItalicOptions } from '@tiptap/extension-italic'
import { ListItem, ListItemOptions } from '@tiptap/extension-list-item'
import { Strike, StrikeOptions } from '@tiptap/extension-strike'
import { Text } from '@tiptap/extension-text'
import { FocusClasses, FocusOptions } from '@tiptap/extension-focus'
import { Typography, TypographyOptions } from '@tiptap/extension-typography'
import { Placeholder, PlaceholderOptions } from '@tiptap/extension-placeholder'
import { History, HistoryOptions } from '@tiptap/extension-history'

export interface StarterKitOptions {
  /**
   * If set to false, the bold extension will not be registered
   * @example bold: false
   */
  bold: Partial<BoldOptions> | false

  /**
   * If set to false, the document extension will not be registered
   * @example document: false
   */
  document: false

  /**
   * If set to false, the gapcursor extension will not be registered
   * @example gapcursor: false
   */
  gapcursor: false

  /**
   * If set to false, the hardBreak extension will not be registered
   * @example hardBreak: false
   */
  hardBreak: Partial<HardBreakOptions> | false

  /**
   * If set to false, the history extension will not be registered
   * @example history: false
   */
  history: Partial<HistoryOptions> | false

  /**
   * If set to false, the italic extension will not be registered
   * @example italic: false
   */
  italic: Partial<ItalicOptions> | false

  /**
   * If set to false, the listItem extension will not be registered
   * @example listItem: false
   */
  listItem: Partial<ListItemOptions> | false

  /**
   * If set to false, the strike extension will not be registered
   * @example strike: false
   */
  strike: Partial<StrikeOptions> | false

  /**
   * If set to false, the text extension will not be registered
   * @example text: false
   */
  text: false

  /**
   * If set to false, the typography extension will not be registered
   * @example typography: false
   */
  typography: Partial<TypographyOptions> | false

  /**
   * If set to false, the placeholder extension will not be registered
   * @example placeholder: false
   */

  placeholder: Partial<PlaceholderOptions> | false

  /**
   * If set to false, the focus extension will not be registered
   * @example focus: false
   */
  focus: Partial<FocusOptions> | false
}

/**
 * The starter kit is a collection of essential editor extensions.
 *
 * It’s a good starting point for building your own editor.
 */
export const StarterKit = Extension.create<StarterKitOptions>({
  name: 'starterKit',

  addExtensions() {
    const extensions = []

    if (this.options.bold !== false) {
      extensions.push(Bold.configure(this.options?.bold))
    }

    if (this.options.document !== false) {
      extensions.push(Document.configure(this.options?.document))
    }

    if (this.options.gapcursor !== false) {
      extensions.push(Gapcursor.configure(this.options?.gapcursor))
    }

    if (this.options.hardBreak !== false) {
      extensions.push(HardBreak.configure(this.options?.hardBreak))
    }

    if (this.options.history !== false) {
      extensions.push(History.configure(this.options?.history))
    }

    if (this.options.italic !== false) {
      extensions.push(Italic.configure(this.options?.italic))
    }

    if (this.options.listItem !== false) {
      extensions.push(ListItem.configure(this.options?.listItem))
    }

    if (this.options.strike !== false) {
      extensions.push(Strike.configure(this.options?.strike))
    }

    if (this.options.text !== false) {
      extensions.push(Text.configure(this.options?.text))
    }

    if (this.options.typography !== false) {
      extensions.push(Typography.configure(this.options?.typography))
    }

    if (this.options.placeholder !== false) {
      extensions.push(Placeholder.configure(this.options?.placeholder))
    }

    if (this.options.focus !== false) {
      extensions.push(FocusClasses.configure(this.options?.focus))
    }

    return extensions
  },
})

export default StarterKit
