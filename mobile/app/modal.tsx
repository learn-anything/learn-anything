import { StatusBar } from "expo-status-bar"
import { Platform, Text, View } from "react-native"

export default function ModalScreen() {
	return (
		<View className={styles.container}>
			<StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
			<Text className={styles.title}>Modal</Text>
		</View>
	)
}

const styles = {
	container: `items-center flex-1 justify-center`,
	title: `text-xl font-bold`,
}
