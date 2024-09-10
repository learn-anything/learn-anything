import type { Editor } from '@tiptap/core'
import type { MinimalTiptapProps } from './minimal-tiptap'

let isMac: boolean | undefined

interface Navigator {
  userAgentData?: {
    brands: { brand: string; version: string }[]
    mobile: boolean
    platform: string
    getHighEntropyValues: (hints: string[]) => Promise<{
      platform: string
      platformVersion: string
      uaFullVersion: string
    }>
  }
}

function getPlatform(): string {
  const nav = navigator as Navigator

  if (nav.userAgentData) {
    if (nav.userAgentData.platform) {
      return nav.userAgentData.platform
    }

    nav.userAgentData.getHighEntropyValues(['platform']).then(highEntropyValues => {
      if (highEntropyValues.platform) {
        return highEntropyValues.platform
      }
    })
  }

  if (typeof navigator.platform === 'string') {
    return navigator.platform
  }

  return ''
}

export function isMacOS() {
  if (isMac === undefined) {
    isMac = getPlatform().toLowerCase().includes('mac')
  }

  return isMac
}

interface ShortcutKeyResult {
  symbol: string
  readable: string
}

export function getShortcutKey(key: string): ShortcutKeyResult {
  const lowercaseKey = key.toLowerCase()
  if (lowercaseKey === 'mod') {
    return isMacOS() ? { symbol: '⌘', readable: 'Command' } : { symbol: 'Ctrl', readable: 'Control' }
  } else if (lowercaseKey === 'alt') {
    return isMacOS() ? { symbol: '⌥', readable: 'Option' } : { symbol: 'Alt', readable: 'Alt' }
  } else if (lowercaseKey === 'shift') {
    return isMacOS() ? { symbol: '⇧', readable: 'Shift' } : { symbol: 'Shift', readable: 'Shift' }
  } else {
    return { symbol: key, readable: key }
  }
}

export function getShortcutKeys(keys: string[]): ShortcutKeyResult[] {
  return keys.map(key => getShortcutKey(key))
}

export function getOutput(editor: Editor, format: MinimalTiptapProps['output']) {
  if (format === 'json') {
    return editor.getJSON()
  }

  if (format === 'html') {
    return editor.getText() ? editor.getHTML() : ''
  }

  return editor.getText()
}
