import { atom } from "jotai"

export const keyboardDisableSourcesAtom = atom<Set<string>>(new Set<string>())
