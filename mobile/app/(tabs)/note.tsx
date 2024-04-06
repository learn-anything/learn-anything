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
import { Feather, FontAwesome, AntDesign, Ionicons, Foundation } from "@expo/vector-icons"

const { width } = Dimensions.get("window")
const { height } = Dimensions.get("window")

export default function Note() {
	const [text, setText] = useState("")
	const [secondText, setSecondText] = useState("")
	const inputRef = useRef<TextInput>(null)
	const [isFocused, setIsFocused] = useState(false)
	//buttons
	const [noteType, setNoteType] = useState("private")

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	const handlePress = (type: string) => {
		setNoteType(type === "private" ? "public" : "private")
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.addContainer}>
				<Text style={styles.addText}>add to:</Text>
				{/* <View style={styles.buttonContainer}> */}
				{noteType !== "public" ? (
					<TouchableOpacity style={styles.selectButton} onPress={() => handlePress("private")}>
						<View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<FontAwesome name="lock" size={18} color="gray" style={{ marginRight: 5 }} />
							<Text style={styles.selectText}>private notes</Text>
						</View>
					</TouchableOpacity>
				) : (
					<TouchableOpacity style={styles.selectButton} onPress={() => handlePress("public")}>
						<View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<AntDesign name="eye" size={18} color="gray" style={{ marginRight: 5 }} />
							<Text style={styles.selectText}>public notes</Text>
						</View>
					</TouchableOpacity>
				)}
				{/* </View> */}
			</View>
			<View style={styles.optionContainer}>
				<TouchableOpacity style={styles.option}>
					<Ionicons name="image" size={16} color="gray" />
					<Text style={styles.optionText}>add cover</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.option}>
					<Foundation name="comments" size={16} color="gray" />
					<Text style={styles.optionText}>add comment</Text>
				</TouchableOpacity>
			</View>
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
		width: "90%",
		display: "flex",
		marginTop: 40,
		marginHorizontal: width * 0.05,
		position: "relative",
	},
	inputContainer: {
		position: "relative",
	},
	placeholderStyle: {
		fontSize: 21,
	},
	smallPlaceholderStyle: {
		fontSize: 15,
	},
	input: {
		fontSize: 18,
		fontWeight: "500",
		color: "rgba(255, 255, 255, 0.5)",
		paddingTop: 25,
		paddingHorizontal: 11,
		borderRadius: 10,
		backgroundColor: "transparent",
		maxHeight: height * 0.2,
		lineHeight: 20,
		paddingRight: width * 0.06,
	},
	secondInput: {
		fontSize: 14,
		fontWeight: "400",
		color: "rgba(255, 255, 255, 0.7)",
		paddingTop: 15,
		paddingHorizontal: 11,
		borderRadius: 10,
		backgroundColor: "transparent",
		minHeight: height * 0.1,
		maxHeight: height * 0.9,
		lineHeight: 20,
		paddingRight: width * 0.06,
	},
	createButton: {
		alignItems: "center",
		justifyContent: "center",
		width: "20%",
		marginLeft: 10,
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
	borderContainer: {
		width: "100%",
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	addContainer: {
		width: "40%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		marginHorizontal: width * 0.07,
	},
	addText: {
		color: "rgba(255, 255, 255, 0.6)",
	},
	// buttonContainer: {
	// 	marginLeft: 40,
	// 	display: "flex",
	// 	flexDirection: "column",
	// 	alignItems: "flex-start",
	// },
	selectButton: {
		marginLeft: 40,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 8,
		backgroundColor: "#232323",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		padding: 8,
		marginBottom: 5,
	},
	selectText: {
		color: "rgba(255, 255, 255, 0.7)",
		fontSize: 16,
		fontWeight: "400",
	},
	optionContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 15,
		width: "60%",
	},
	option: {
		backgroundColor: "transparent",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	optionText: {
		marginLeft: 5,
		fontSize: 14,
		color: "rgba(255, 255, 255, 0.5)",
	},
})
