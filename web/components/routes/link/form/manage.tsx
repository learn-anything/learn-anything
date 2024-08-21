"use client"

import { Button } from "@/components/ui/button"
import { linkEditIdAtom, linkLearningStateSelectorAtom, linkShowCreateAtom, linkTopicSelectorAtom } from "@/store/link"
import { useAtom } from "jotai"
import React, { useEffect, useRef, useState } from "react"
import { useKey } from "react-use"
import { LinkForm } from "./link-form"
import { FloatingButton } from "./partial/floating-button"
import { LaIcon } from "@/components/custom/la-icon"
import { motion } from "framer-motion"

const LinkManage: React.FC = () => {
	const [showCreate, setShowCreate] = useAtom(linkShowCreateAtom)
	const [, setEditId] = useAtom(linkEditIdAtom)
	const [islearningStateSelectorOpen] = useAtom(linkLearningStateSelectorAtom)
	const [istopicSelectorOpen] = useAtom(linkTopicSelectorAtom)
	const [showTooltip, setShowTooltip] = useState(false)

	const formRef = useRef<HTMLFormElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

	const toggleForm = (event: React.MouseEvent) => {
		event.stopPropagation()
		if (showCreate) return
		setShowCreate(prev => !prev)
	}

	const handleFormClose = () => {
		setShowCreate(false)
	}

	// wipes the data from the form when the form is closed
	useEffect(() => {
		if (!showCreate) {
			formRef.current?.reset()
			setEditId(null)
		}
	}, [showCreate, setEditId])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				formRef.current &&
				!formRef.current.contains(event.target as Node) &&
				!istopicSelectorOpen &&
				!islearningStateSelectorOpen
			) {
				handleFormClose()
			}
		}

		if (showCreate) {
			document.addEventListener("mousedown", handleClickOutside)
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [showCreate, islearningStateSelectorOpen, istopicSelectorOpen])

	useKey("Escape", handleFormClose)

	return (
		<>
			{showCreate && <LinkForm ref={formRef} onSuccess={handleFormClose} onCancel={handleFormClose} />}

			<div className="absolute bottom-0 m-0 flex w-full list-none border-t border-[#dedede] bg-white p-2.5 text-center align-middle font-semibold leading-[13px] no-underline dark:border-slate-400/20 dark:bg-transparent">
				<div className="mx-auto flex flex-row items-center justify-center gap-2">
					{showCreate && (
						<Button variant={"ghost"} onClick={toggleForm}>
							<LaIcon name="Trash" />
						</Button>
					)}
					{!showCreate && (
						<Button
							onMouseEnter={() => setShowTooltip(true)}
							onMouseLeave={() => setShowTooltip(false)}
							variant={"ghost"}
							onClick={toggleForm}
						>
							<LaIcon name="Plus" />
						</Button>
					)}
					{showTooltip && !showCreate && (
						<motion.div
							initial={{ opacity: 0, y: 50, scale: 0.3, x: "-50%" }}
							animate={{
								opacity: 1,
								y: 0,
								scale: 1
							}}
							transition={{
								type: "spring",
								stiffness: 400,
								damping: 30
							}}
							className="absolute left-1/2 top-[-116px] flex w-[250px] flex-col items-start gap-3 rounded-xl border border-slate-400/10 bg-white p-5 drop-shadow-lg dark:bg-[#101010]"
						>
							<div className="flex w-full justify-between">
								<div className="font-semibold">New To-Do</div>
								<div className="opacity-60">⌘N</div>
							</div>
							<div className="text-start text-[14px] leading-5 opacity-60">You can also just press your spacebar.</div>
						</motion.div>
					)}
				</div>
			</div>
			{/* <FloatingButton ref={buttonRef} onClick={toggleForm} isOpen={showCreate} /> */}
		</>
	)
}

LinkManage.displayName = "LinkManage"

export { LinkManage }
