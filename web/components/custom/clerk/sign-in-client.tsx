import { SignIn } from "@clerk/nextjs"

export const SignInClient = () => {
	return (
		<div className="flex justify-center">
			<SignIn
				appearance={{
					elements: {
						formButtonPrimary: "bg-primary text-primary-foreground",
						card: "shadow-none"
					}
				}}
			/>
		</div>
	)
}
