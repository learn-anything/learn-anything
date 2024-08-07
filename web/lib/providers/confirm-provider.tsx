"use client"

import { ConfirmDialogProvider, ConfirmOptions } from "@omit/react-confirm-dialog"

interface Props {
	children: React.ReactNode
	defaultOptions?: Partial<ConfirmOptions>
}

export const ConfirmProvider = ({ children, defaultOptions = {} }: Props) => {
	return <ConfirmDialogProvider defaultOptions={defaultOptions}>{children}</ConfirmDialogProvider>
}
