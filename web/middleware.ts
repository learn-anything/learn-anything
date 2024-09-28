import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const ROUTE_PATTERNS = {
	public: ["/sign-in(.*)", "/sign-up(.*)", "/", "/:topicName(.*)"],
	protected: [
		"/edit-profile(.*)",
		"/links(.*)",
		"/pages(.*)",
		"/profile(.*)",
		"/search(.*)",
		"/settings(.*)",
		"/tauri(.*)",
		"/onboarding(.*)",
		"/tasks(.*)",
		"/journal(.*)"
	]
}

const isPublicRoute = createRouteMatcher(ROUTE_PATTERNS.public)
const isProtectedRoute = createRouteMatcher(ROUTE_PATTERNS.protected)

export default clerkMiddleware((auth, request) => {
	if (isProtectedRoute(request) || !isPublicRoute(request)) {
		auth().protect()
	}
})

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)"
	]
}
