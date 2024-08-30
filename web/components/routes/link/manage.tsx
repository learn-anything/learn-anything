"use client"

import React from "react"
import { linkShowCreateAtom } from "@/store/link"
import { useAtom } from "jotai"
import { useKey } from "react-use"
import { LinkForm } from "./partials/form/link-form"
import { motion, AnimatePresence } from "framer-motion"

interface LinkManageProps {}

const LinkManage: React.FC<LinkManageProps> = () => {
	const [showCreate, setShowCreate] = useAtom(linkShowCreateAtom)

	const handleFormClose = () => setShowCreate(false)
	const handleFormFail = () => {}

	useKey("Escape", handleFormClose)

	return (
		<AnimatePresence>
			{showCreate && (
				<motion.div
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: "auto", opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.1 }}
				>
					<LinkForm onClose={handleFormClose} onSuccess={handleFormClose} onFail={handleFormFail} />
				</motion.div>
			)}
		</AnimatePresence>
	)
}

LinkManage.displayName = "LinkManage"

export { LinkManage }
