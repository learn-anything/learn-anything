"use client"

import React from "react"
import { LinkForm } from "./partials/form/link-form"
import { motion, AnimatePresence } from "framer-motion"
import { parseAsBoolean, useQueryState } from "nuqs"

interface LinkManageProps {}

const LinkManage: React.FC<LinkManageProps> = () => {
	const [createMode, setCreateMode] = useQueryState("create", parseAsBoolean)

	const handleFormClose = () => setCreateMode(false)

	return (
		<AnimatePresence>
			{createMode && (
				<motion.div
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: "auto", opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.1 }}
				>
					<LinkForm onClose={handleFormClose} onSuccess={handleFormClose} />
				</motion.div>
			)}
		</AnimatePresence>
	)
}

LinkManage.displayName = "LinkManage"

export { LinkManage }
