// import { SignInClient } from "@/components/custom/clerk/sign-in-client"

// export default async function Page() {
// 	return (
// 		<div className="flex justify-center py-24">
// 			<SignInClient />
// 		</div>
// 	)
// }

import { SignUpClient } from "@/components/custom/clerk/sign-up-client"

export default async function Page() {
	return (
		<div className="flex justify-center py-24">
			<SignUpClient />
		</div>
	)
}
