"use client"

import { Provider } from "jotai"

export const JotaiProvider = ({ children }: { children: React.ReactNode }) => {
	return <Provider>{children}</Provider>
}
