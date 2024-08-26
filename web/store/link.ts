import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const linkSortAtom = atomWithStorage("sort", "manual")
export const linkShowCreateAtom = atom(false)
export const linkEditIdAtom = atom<string | number | null>(null)
export const linkLearningStateSelectorAtom = atom(false)
export const linkTopicSelectorAtom = atom(false)
