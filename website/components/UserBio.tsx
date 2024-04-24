export default function UserBio(props: {
	bio: string
	updateBio: (bio: string) => void
}) {
	return (
		<>
			<div>User bio: {props.bio}</div>
			<input
				style={{ color: "black" }}
				type="text"
				placeholder="Change bio"
				onKeyDown={async (e) => {
					if (e.key === "Enter") {
						const updatedBio = (e.target as HTMLInputElement).value
						props.updateBio(updatedBio)
					}
				}}
			/>
		</>
	)
}
