import { ReactNode, useState } from "react"
import { motion } from "framer-motion"

export function Keybind({ keys, children }: { keys: string[]; children: ReactNode }) {
	const [hovered, setHovered] = useState(false)
	const variants = {
		hidden: { opacity: 0, y: 6, x: "-50%" },
		visible: { opacity: 1, y: 0, x: "-50%" }
	}
	return (
		<div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="group relative h-full">
			<motion.div
				initial="hidden"
				animate={hovered ? "visible" : "hidden"}
				variants={variants}
				transition={{ duration: 0.2, delay: 0.4 }}
				className="absolute left-[50%] top-[-30px] flex h-fit w-fit items-center rounded-[7px] border border-slate-400/30 bg-gray-100 p-[3px] px-2 text-[10px] drop-shadow-sm dark:border-slate-400/10 dark:bg-[#191919]"
				style={{
					boxShadow: "inset 0px 0px 6px 2px var(--boxShadow)"
				}}
			>
				{keys.map((key, index) => (
					<span key={key}>
						{index > 0 && <span className="mx-1">+</span>}
						{(() => {
							switch (key.toLowerCase()) {
								case "cmd":
									return "⌘"
								case "shift":
									return "⇪"

								default:
									return key
							}
						})()}
					</span>
				))}
			</motion.div>
			{children}
		</div>
	)
}
