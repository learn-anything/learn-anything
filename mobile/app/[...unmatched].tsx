import { Link, Stack } from "expo-router"
import { Text, View, StyleSheet } from "react-native"

const HeaderBackground = () => (
	<View style={{ flex: 1, justifyContent: "center", backgroundColor: "#0F0F0F" }}></View>
)

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen
				options={{
					// headerShown: false,
					title: "Go to home screen",
					headerTitleStyle: {
						fontWeight: "bold",
						fontSize: 18,
						color: "rgba(255, 255, 255, 0.5)",
					},
					headerBackground: () => <HeaderBackground />,
				}}
			/>
			<View style={styles.container}>
				<Link href="/" style={styles.link}>
					<Text style={styles.linkText}>404</Text>
				</Link>
				<Text style={styles.title}>it seems this page doesn't exist :(</Text>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#0F0F0F",
		display: "flex",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		color: "rgba(255, 255, 255, 0.2)",
		marginTop: 20,
	},
	link: {
		color: "rgba(255, 255, 255, 0.2)",
	},
	linkText: {
		color: "rgba(255, 255, 255, 0.5)",
		fontSize: 24,
	},
})
