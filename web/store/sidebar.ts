import { atom } from "jotai"

export const isCollapseAtom = atom(false)
export const toggleCollapseAtom = atom(
	get => get(isCollapseAtom),
	(get, set) => set(isCollapseAtom, !get(isCollapseAtom))
)
export const showHotkeyPanelAtom = atom(false)
