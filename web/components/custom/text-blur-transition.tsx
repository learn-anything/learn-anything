import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function TextBlurTransition(props: { children: string; className?: string }) {
	const words = props.children.split(" ")

	return (
		<motion.div className={cn("flex w-full justify-center gap-3 transition-all", props.className)}>
			{words.map((word, index) => {
				return (
					<motion.div
						key={index}
						initial={{ filter: "blur(8px)", translateY: "18px", opacity: 0 }}
						animate={{ filter: "blur(0px)", translateY: "0px", opacity: 1 }}
						transition={{
							duration: index * 0.4 + 0.7,
							easings: "cubic-bezier(.77, 0, .175, 1)"
						}}
					>
						{word}
					</motion.div>
				)
			})}
		</motion.div>
	)
}
