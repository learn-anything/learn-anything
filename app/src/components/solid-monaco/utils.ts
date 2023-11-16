import { Monaco } from '@monaco-editor/loader'

export const getModel = (monaco: Monaco, path: string) => {
  const pathUri = monaco.Uri.parse(path)
  return monaco.editor.getModel(pathUri)
}

export const createModel = (monaco: Monaco, value: string, language?: string, path?: string) => {
  const pathUri = path != null ? monaco.Uri.parse(path) : undefined
  return monaco.editor.createModel(value, language, pathUri)
}

export const getOrCreateModel = (
  monaco: Monaco,
  value: string,
  language?: string,
  path?: string,
) => {
  const existingModel = path != null ? getModel(monaco, path) : null
  return existingModel ?? createModel(monaco, value, language, path)
}
