"use client"

import React, { useState, useEffect, useRef } from "react"
import { useAtom } from "jotai"
import { linkEditIdAtom, linkShowCreateAtom } from "@/store/link"
import { useKey } from "react-use"
import { FloatingButton } from "./partial/floating-button"
import { LinkForm } from "./link-form"

const LinkManage: React.FC = () => {
	const [showCreate, setShowCreate] = useAtom(linkShowCreateAtom)
	const [, setEditId] = useAtom(linkEditIdAtom)
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)

	const formRef = useRef<HTMLFormElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

	const toggleForm = (event: React.MouseEvent) => {
		event.stopPropagation()
		setShowCreate(prev => !prev)
	}

	const handleFormClose = () => {
		setShowCreate(false)
	}

	useEffect(() => {
		if (!showCreate) {
			formRef.current?.reset()
			setEditId(null)
		}
	}, [showCreate, setEditId])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (formRef.current && !formRef.current.contains(event.target as Node) && !isPopoverOpen) {
				handleFormClose()
			}
		}

		if (showCreate) {
			document.addEventListener("mousedown", handleClickOutside)
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [showCreate, isPopoverOpen])

	useKey("Escape", handleFormClose)

	return (
		<>
			{showCreate && <LinkForm ref={formRef} onSuccess={handleFormClose} onCancel={handleFormClose} />}
			<FloatingButton ref={buttonRef} onClick={toggleForm} isOpen={showCreate} />
		</>
	)
}

LinkManage.displayName = "LinkManage"

export { LinkManage }
