import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LinkForm } from "./-link-form"
import { useNavigate, useSearch } from "@tanstack/react-router"

interface LinkManageProps {}

const LinkManage: React.FC<LinkManageProps> = () => {
  const { create } = useSearch({ from: "/_layout/_pages/_protected/links/" })
  const navigate = useNavigate()

  const handleFormClose = () => {
    navigate({
      to: "/links",
      search: { create: undefined },
    })
  }

  return (
    <AnimatePresence>
      {create && (
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
