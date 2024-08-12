import ForceGraph from "@/components/routes/force-graph"

export default function HomePage() {
	// if authenticated, show the <Home (<Links)

	return (
		<div className="flex min-h-full items-center justify-center">
			<ForceGraph />
		</div>
	)
}
