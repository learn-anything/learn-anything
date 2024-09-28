import { useMedia } from "@/hooks/use-media"

export const useColumnStyles = () => {
	const isTablet = useMedia("(max-width: 640px)")

	return {
		title: {
			"--width": "69px",
			"--min-width": "200px",
			"--max-width": isTablet ? "none" : "auto"
		},
		content: { "--width": "auto", "--min-width": "200px", "--max-width": "200px" },
		topic: { "--width": "65px", "--min-width": "120px", "--max-width": "120px" },
		updated: { "--width": "82px", "--min-width": "82px", "--max-width": "82px" }
	}
}
