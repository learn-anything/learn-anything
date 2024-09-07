## LA Editor

This folder should not contain any changes. It is a copy of the original LA Editor component from the [LA Editor](https://github.com/learn-anything/la-editor) repository.

> This component is a temporary solution until the original repository publish the component to npm.

## Clerk Middleware for Route Protection

This middleware manages authentication and protects routes in our Next.js application using Clerk.

## Key Concepts

- **Public Routes**: Accessible to all users
- **Protected Routes**: Require authentication

## Important: Route Registration

The middleware uses a catch-all public route `"/:topicName(.*)"`. This means:

1. New routes are public by default
2. Protected routes MUST be explicitly registered

## How to Register Routes

Update the `ROUTE_PATTERNS` object in the middleware file:

```typescript
const ROUTE_PATTERNS = {
	public: ["/sign-in(.*)", "/sign-up(.*)", "/", "/:topicName(.*)"],
	protected: [
		"/edit-profile(.*)",
		"/links(.*)",
		// Add new protected routes here
		"/new-protected-feature(.*)"
	]
}
```

## Best Practices

1. Always add new protected routes to `ROUTE_PATTERNS.protected`
2. Regularly review routes to ensure proper protection
3. Be cautious when modifying the `"/:topicName(.*)"` catch-all route
