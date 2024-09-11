import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const linkSortAtom = atomWithStorage("sort", "manual")
export const linkEditIdAtom = atom<string | null>(null)
export const linkLearningStateSelectorAtom = atom(false)
export const linkOpenPopoverForIdAtom = atom<string | null>(null)
