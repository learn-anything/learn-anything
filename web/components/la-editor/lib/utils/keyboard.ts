import { isMacOS } from './platform'

export const getShortcutKey = (key: string) => {
  const lowercaseKey = key.toLowerCase()
  const macOS = isMacOS()

  switch (lowercaseKey) {
    case 'mod':
      return macOS ? '⌘' : 'Ctrl'
    case 'alt':
      return macOS ? '⌥' : 'Alt'
    case 'shift':
      return macOS ? '⇧' : 'Shift'
    default:
      return key
  }
}

export const getShortcutKeys = (keys: string | string[], separator: string = '') => {
  const keyArray = Array.isArray(keys) ? keys : keys.split(/\s+/)
  const shortcutKeys = keyArray.map(getShortcutKey)
  return shortcutKeys.join(separator)
}

export default { getShortcutKey, getShortcutKeys }
