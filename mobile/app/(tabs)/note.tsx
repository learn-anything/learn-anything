import React, { useState, useRef, useEffect } from "react"
import {
	Animated,
	SafeAreaView,
	View,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	TextInput,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")
const { height } = Dimensions.get("window")

export default function Note() {
	const [text, setText] = useState("")
	const [secondText, setSecondText] = useState("")
	const inputRef = useRef<TextInput>(null)
	const [isFocused, setIsFocused] = useState(false)
	const [selectedTab, setSelectedTab] = useState("Page")
	const [searchQuery, setSearchQuery] = useState("")
	const [isInputFocused, setIsInputFocused] = useState(false)
	const [typing, setTyping] = useState(false)
	const typingTimeoutRef = useRef(null)

	const position = useRef(new Animated.Value(height - 100)).current

	const animateToTop = () => {
		Animated.timing(position, {
			toValue: 0,
			duration: 300,
			useNativeDriver: false,
		}).start()
	}

	const animateToBottom = () => {
		Animated.timing(position, {
			toValue: height - 115,
			duration: 300,
			useNativeDriver: false,
		}).start()
	}

	useEffect(() => {
		if (isInputFocused) {
			animateToTop()
		} else {
			animateToBottom()
		}
	}, [isInputFocused])

	const handleTextChange = (text: string) => {
		setSecondText(text)
		setTyping(true)
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current as NodeJS.Timeout)
		}
		typingTimeoutRef.current = setTimeout(() => {
			setTyping(false)
		}, 1500) as unknown as null
	}

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss()
				setSearchQuery("")
				setIsInputFocused(false)
			}}
			accessible={false}
		>
			{isInputFocused ? (
				<SafeAreaView style={styles.container}>
					<View style={{ flex: 1, display: "flex", flexDirection: "column" }}>
						<Animated.View
							style={[styles.searchContainerOnly, { top: position }]}
						>
							<TextInput
								style={styles.searchInputOnly}
								placeholder={
									selectedTab === "Page"
										? "Search for existing page"
										: "Search for existing link"
								}
								value={searchQuery}
								onChangeText={setSearchQuery}
								onBlur={() => setIsInputFocused(false)}
							/>
						</Animated.View>
						<View style={styles.searchSuggestions}>
							<Text style={{ color: "rgba(255, 255, 255, 0.5)", padding: 10 }}>
								{selectedTab === "Page" ? "Pages" : "Links"}
							</Text>
							{Array.from({ length: 3 }, (_, i) => (
								<TouchableOpacity key={i} style={styles.suggestionElement}>
									<Text style={styles.suggestionElementText}>
										{selectedTab === "Page" ? `Page ${i + 1}` : `Link ${i + 1}`}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</SafeAreaView>
			) : (
				<SafeAreaView style={styles.container}>
					<View style={styles.tabContainer}>
						<TouchableOpacity
							style={[
								styles.tab,
								selectedTab === "Page"
									? styles.selectedTab
									: styles.unselectedTab,
							]}
							onPress={() => setSelectedTab("Page")}
						>
							<Text style={styles.tabText}>Page</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.tab,
								selectedTab === "link"
									? styles.selectedTab
									: styles.unselectedTab,
							]}
							onPress={() => setSelectedTab("link")}
						>
							<Text style={styles.tabText}>Link</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.noteContainer}>
						<View style={styles.inputContainer}>
							<TextInput
								ref={inputRef}
								style={[
									styles.input,
									!text && !isFocused ? styles.placeholderStyle : {},
								]}
								multiline
								placeholder="New Page"
								placeholderTextColor="rgba(255, 255, 255, 0.3)"
								value={text}
								onChangeText={setText}
							/>
							<TextInput
								ref={inputRef}
								style={[
									styles.secondInput,
									!text && !isFocused ? styles.smallPlaceholderStyle : {},
								]}
								multiline
								placeholder="Take a note..."
								placeholderTextColor="rgba(255, 255, 255, 0.3)"
								value={secondText}
								onChangeText={handleTextChange}
							/>
							{secondText && !typing ? (
								<Text style={styles.commandsText}>Type / to see commands</Text>
							) : null}
						</View>
						<View style={styles.buttonContainer}>
							<TouchableOpacity style={styles.privateButton}>
								<MaterialCommunityIcons
									name="eye-off-outline"
									size={22}
									color="rgba(255, 255, 255, 0.4)"
								/>
							</TouchableOpacity>
							<TouchableOpacity style={styles.settingsButton}>
								<MaterialCommunityIcons
									name="dots-horizontal"
									size={24}
									color="rgba(255, 255, 255, 0.4)"
								/>
							</TouchableOpacity>
						</View>
					</View>

					<Animated.View style={[styles.searchContainer, { top: position }]}>
						<TextInput
							style={[
								styles.searchInput,
								isInputFocused ? styles.focusedInput : styles.unfocusedInput,
							]}
							placeholder={
								selectedTab === "Page"
									? "Search for existing page"
									: "Search for existing link"
							}
							placeholderTextColor="rgba(255, 255, 255, 0.1)"
							value={searchQuery}
							onChangeText={(text) => {
								setSearchQuery(text)
							}}
							onFocus={() => setIsInputFocused(true)}
							onBlur={() => setIsInputFocused(false)}
						/>
					</Animated.View>
				</SafeAreaView>
			)}
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F0F0F",
	},

	tabContainer: {
		alignSelf: "center",
		flexDirection: "row",
		overflow: "hidden",
		backgroundColor: "#222222",
		borderRadius: 10,
		width: 120,
	},
	tab: {
		backgroundColor: "#222222",
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 10,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	selectedTab: {
		backgroundColor: "rgba(255, 255, 255, 0.04)",
		borderRadius: 7,
		borderColor: "#222222",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
	},
	unselectedTab: {
		backgroundColor: "rgba(255, 255, 255, 0.0)",
		borderRadius: 7,
		borderColor: "#222222",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
	},
	tabText: {
		fontSize: 16,
		color: "white",
		opacity: 0.7,
	},

	noteContainer: {
		width: "90%",
		display: "flex",
		marginTop: 25,
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
		fontSize: 22,
		fontWeight: "700",
		color: "rgba(255, 255, 255, 1)",
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
		color: "rgba(255, 255, 255, 0.9)",
		paddingTop: 20,
		paddingHorizontal: 11,
		borderRadius: 10,
		backgroundColor: "transparent",
		minHeight: height * 0.1,
		maxHeight: height * 0.9,
		lineHeight: 20,
		paddingRight: width * 0.06,
	},
	commandsText: {
		color: "rgba(255, 255, 255, 0.3)",
		fontSize: 16,
		paddingTop: 2,
		paddingLeft: 11,
	},
	buttonContainer: {
		position: "absolute",
		flexDirection: "row",
		top: 0,
		left: 0,
		right: 20,
	},
	privateButton: {
		position: "absolute",
		top: 10,
		right: -10,
		width: "20%",
		backgroundColor: "transparent",
		padding: 8,
	},
	settingsButton: {
		position: "absolute",
		top: 10,
		right: -50,
		width: "20%",
		backgroundColor: "transparent",
		padding: 8,
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
		position: "absolute",
		left: 30,
		top: 20,
	},
	optionButton: {
		marginTop: 5,
	},
	button: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		color: "#1c1c1c",
	},
	searchContainer: {
		width: "100%",
		paddingHorizontal: 6,
		flexDirection: "row",
		alignItems: "center",
		position: "absolute",
		bottom: 40,
		justifyContent: "center",
	},
	searchContainerOnly: {
		width: "100%",
		position: "absolute",
		top: 0,
		paddingHorizontal: 6,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	searchInput: {
		flex: 1,
		marginVertical: 10,
		borderColor: "rgba(255, 255, 255, 0.15)",
		borderWidth: 1,
		borderRadius: 10,
		paddingVertical: 22,
		paddingHorizontal: 15,
		color: "rgba(255, 255, 255, 1)",
		fontSize: 16,
		paddingRight: 40,
		justifyContent: "center",
		backgroundColor: "#131519",
	},
	searchInputOnly: {
		flex: 1,
		marginVertical: 10,
		borderColor: "rgba(255, 255, 255, 0.15)",
		borderWidth: 1,
		borderRadius: 10,
		paddingVertical: 14,
		paddingHorizontal: 15,
		color: "rgba(255, 255, 255, 1)",
		fontSize: 16,
		paddingRight: 40,
		justifyContent: "center",
		backgroundColor: "#131519",
	},
	focusedInput: {
		textAlign: "left",
	},
	unfocusedInput: {
		textAlign: "center",
		backgroundColor: "#191919",
	},
	searchSuggestions: {
		width: "100%",
		position: "absolute",
		top: 90,
		flexDirection: "column",
		justifyContent: "space-between",
	},
	suggestionElement: {
		padding: 10,
		marginBottom: 2,
		borderRadius: 5,
		backgroundColor: "#121212",
	},
	suggestionElementText: {
		color: "rgba(255, 255, 255, 1)",
		fontSize: 16,
		fontWeight: "500",
	},
})
