import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const linkSortAtom = atomWithStorage("sort", "manual")
export const linkShowCreateAtom = atom(false)
