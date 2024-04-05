import React, { useState, useEffect, useRef } from "react"
import {
	SafeAreaView,
	View,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	TextInput,
} from "react-native"
import { Feather } from "@expo/vector-icons"

const { width } = Dimensions.get("window")
const { height } = Dimensions.get("window")

export default function Note() {
	const [text, setText] = useState("")
	const [secondText, setSecondText] = useState("")
	const inputRef = useRef<TextInput>(null)
	const [isFocused, setIsFocused] = useState(false)

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.noteContainer}>
				<View style={styles.inputContainer}>
					<TextInput
						ref={inputRef}
						style={[styles.input, !text && !isFocused ? styles.placeholderStyle : {}]}
						multiline
						placeholder="Untitled"
						placeholderTextColor="rgba(255, 255, 255, 0.3)"
						value={text}
						onChangeText={setText}
					/>
					<TextInput
						ref={inputRef}
						style={[styles.secondInput, !text && !isFocused ? styles.smallPlaceholderStyle : {}]}
						multiline
						placeholder="tap here to add a note..."
						placeholderTextColor="rgba(255, 255, 255, 0.3)"
						value={secondText}
						onChangeText={setSecondText}
					/>
					<TouchableOpacity
						style={styles.clearButton}
						onPress={() => {
							setText("")
							setSecondText("")
						}}
					>
						<Feather name="delete" size={24} color="gray" />
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={[styles.createButton, text ? {} : styles.disabledButton]}
					onPress={() => {
						console.log(text)
						console.log(secondText)
						setText("")
						setSecondText("")
					}}
					disabled={!text}
				>
					<Text style={styles.buttonText}>Create</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F0F0F",
	},
	noteContainer: {
		display: "flex",
		marginTop: 40,
		marginHorizontal: width * 0.05,
		width: "90%",
		position: "relative",
	},
	inputContainer: {
		position: "relative",
	},
	placeholderStyle: {
		fontSize: 20,
	},
	smallPlaceholderStyle: {
		fontSize: 15,
	},
	input: {
		fontSize: 18,
		fontWeight: "500",
		color: "white",
		paddingTop: 25,
		paddingHorizontal: 11,
		borderRadius: 10,
		backgroundColor: "rgba(31, 31, 31, 0.2)",
		// minHeight: height * 0.1,
		maxHeight: height * 0.2,
		lineHeight: 20,
		paddingRight: width * 0.06,
	},
	secondInput: {
		fontSize: 14,
		fontWeight: "400",
		color: "white",
		paddingTop: 15,
		paddingHorizontal: 11,
		borderRadius: 10,
		backgroundColor: "rgba(31, 31, 31, 0.2)",
		minHeight: height * 0.1,
		maxHeight: height * 0.9,
		lineHeight: 20,
		paddingRight: width * 0.06,
	},
	createButton: {
		alignItems: "center",
		justifyContent: "center",
		width: "20%",
		paddingHorizontal: 11,
		backgroundColor: "#232323",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		padding: 8,
		marginTop: 15,
		marginRight: 10,
	},
	disabledButton: {
		opacity: 0.5,
	},
	clearButton: {
		position: "absolute",
		top: 0,
		right: -15,
		alignItems: "center",
		justifyContent: "center",
		width: "20%",
		paddingHorizontal: 11,
		backgroundColor: "transparent",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		padding: 8,
	},
	buttonText: {
		color: "white",
		opacity: 0.7,
		paddingRight: 5,
	},
})
