import { SignUp } from "@clerk/nextjs"

export const SignUpClient = () => {
	return (
		<div className="flex justify-center">
			<SignUp
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
