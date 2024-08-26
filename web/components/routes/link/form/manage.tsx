"use client"

import { Button } from "@/components/ui/button"
import { linkEditIdAtom, linkShowCreateAtom } from "@/store/link"
import { useAtom } from "jotai"
import React, { useEffect, useRef, useState } from "react"
import { useKey } from "react-use"
import { globalLinkFormExceptionRefsAtom, LinkForm } from "./link-form"
import { LaIcon } from "@/components/custom/la-icon"
import LinkOptions from "@/components/LinkOptions"
// import { FloatingButton } from "./partial/floating-button"

const LinkManage: React.FC = () => {
	const [showCreate, setShowCreate] = useAtom(linkShowCreateAtom)
	const [editId, setEditId] = useAtom(linkEditIdAtom)
	const [, setGlobalExceptionRefs] = useAtom(globalLinkFormExceptionRefsAtom)

	const [showOptions, setShowOptions] = useState(false)

	const optionsRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

	const toggleForm = (event: React.MouseEvent) => {
		event.stopPropagation()
		if (showCreate) return
		setShowCreate(prev => !prev)
	}

	const clickOptionsButton = (e: React.MouseEvent) => {
		e.preventDefault()
		setShowOptions(prev => !prev)
	}

	const handleFormClose = () => {
		setShowCreate(false)
	}

	const handleFormFail = () => {}

	// wipes the data from the form when the form is closed
	React.useEffect(() => {
		if (!showCreate) {
			setEditId(null)
		}
	}, [showCreate, setEditId])

	useKey("Escape", handleFormClose)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
				setShowOptions(false)
			}
		}

		if (showOptions) {
			document.addEventListener("mousedown", handleClickOutside)
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [showOptions])

	/*
	 * This code means that when link form is opened, these refs will be added as an exception to the click outside handler
	 */
	React.useEffect(() => {
		setGlobalExceptionRefs([optionsRef, buttonRef])
	}, [setGlobalExceptionRefs])

	return (
		<>
			{showCreate && <LinkForm onClose={handleFormClose} onSuccess={handleFormClose} onFail={handleFormFail} />}
			<div className="absolute bottom-0 m-0 flex w-full list-none bg-inherit p-2.5 text-center align-middle font-semibold leading-[13px] no-underline">
				<div className="mx-auto flex flex-row items-center justify-center gap-2">
					<Button
						variant="ghost"
						onClick={toggleForm}
						className={editId || showCreate ? "text-red-500 hover:bg-red-500/50 hover:text-white" : ""}
					>
						<LaIcon name={showCreate ? "X" : editId ? "Trash" : "Plus"} />
					</Button>
					<div className="relative" ref={optionsRef}>
						{showOptions && <LinkOptions />}
						<Button ref={buttonRef} variant="ghost" onClick={clickOptionsButton}>
							<LaIcon name="Ellipsis" />
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}

LinkManage.displayName = "LinkManage"

export { LinkManage }

/* <FloatingButton ref={buttonRef} onClick={toggleForm} isOpen={showCreate} /> */
