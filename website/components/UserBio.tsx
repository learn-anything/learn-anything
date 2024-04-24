import { createSignal } from "solid-js"

export default function UserBio(props: {
	bio: string
	updateBio: (bio: string) => void
}) {
	const [newBio, setNewBio] = createSignal("")
	const [bio, setBio] = createSignal(props.bio)

	return (
		<>
			<div>User bio: {bio()}</div>
			<input
				style={{ color: "black" }}
				type="text"
				placeholder="Change bio"
				onChange={(e) => {
					setNewBio(e.target.value)
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						const updatedBio = (e.target as HTMLInputElement).value
						props.updateBio(updatedBio)
						setBio(updatedBio)
					}
				}}
			/>
		</>
	)
}
