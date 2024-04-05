import React from "react"
import {
	View,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	TextInput,
} from "react-native"

const { width } = Dimensions.get("window")
const { height } = Dimensions.get("window")

export default function Personal() {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.text}>Personal info</Text>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F0F0F",
	},
	text: {
		color: "rgba(255, 255, 255, 0.2)",
	},
})
