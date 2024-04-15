import React, { useState, useRef, useEffect } from "react"
import {
	SafeAreaView,
	View,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	TextInput,
	Keyboard,
	TouchableWithoutFeedback,
	ScrollView,
	Animated,
} from "react-native"
import AntDesign from "@expo/vector-icons/AntDesign"
import suggestions from "../constants/suggestions"

const { width, height } = Dimensions.get("window")

export default function Search() {
	const [searchQuery, setSearchQuery] = useState("")
	const [isInputFocused, setIsInputFocused] = useState(false)
	const [showSuggestions, setShowSuggestions] = useState(false)
	const animations = useRef(new Animated.Value(0)).current

	const handleSearch = () => {
		console.log("search:", searchQuery)
	}

	const filteredSuggestions = suggestions.filter((suggestion: string) =>
		suggestion.toUpperCase().startsWith(searchQuery.toUpperCase()),
	)

	const handleSuggestionClick = (suggestion: string) => {
		setSearchQuery(suggestion)
		setShowSuggestions(false)
	}

	const suggestionHeight = 50
	const suggestionsMaxHeight = 200

	const dynamicHeight = Math.min(
		filteredSuggestions.length * suggestionHeight,
		suggestionsMaxHeight,
	)

	useEffect(() => {
		if (searchQuery === "") {
			animations.setValue(0)
		} else {
			Animated.timing(animations, {
				toValue: showSuggestions && searchQuery ? dynamicHeight : 0,
				duration: 200,
				useNativeDriver: false,
			}).start()
		}
	}, [showSuggestions, searchQuery, filteredSuggestions.length])

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss()
				setShowSuggestions(false)
			}}
			accessible={false}
		>
			<SafeAreaView style={styles.container}>
				<View style={styles.searchContainer}>
					<TextInput
						style={[
							styles.searchInput,
							isInputFocused ? styles.focusedInput : styles.unfocusedInput,
						]}
						placeholder="Search or Paste a link"
						placeholderTextColor="rgba(255, 255, 255, 0.1)"
						value={searchQuery}
						onChangeText={(text) => {
							setSearchQuery(text)
							setShowSuggestions(true)
						}}
						onFocus={() => {
							setShowSuggestions(true)
							setIsInputFocused(true)
						}}
						onBlur={() => setIsInputFocused(false)}
					/>
					<TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
						<AntDesign
							name="search1"
							size={20}
							color="rgba(255, 255, 255, 0.4)"
						/>
					</TouchableOpacity>
				</View>
				<Animated.View
					style={[
						styles.suggestionContainer,
						{ height: animations, top: height * 0.16 },
					]}
				>
					<ScrollView>
						{filteredSuggestions.map((suggestion: string, index: number) => (
							<TouchableOpacity
								key={index}
								style={styles.suggestionTopic}
								onPress={() => handleSuggestionClick(suggestion)}
							>
								<Text style={styles.suggestionText}>
									{suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</Animated.View>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#0F0F0F",
	},
	searchContainer: {
		width: "100%",
		paddingHorizontal: 6,
		flexDirection: "row",
		alignItems: "center",
		position: "absolute",
		top: 60,
		zIndex: 1,
		justifyContent: "center",
	},
	searchInput: {
		flex: 1,
		marginVertical: 10,
		borderColor: "rgba(255, 255, 255, 0.15)",
		borderWidth: 1,
		borderRadius: 10,
		paddingVertical: 14,
		paddingHorizontal: 15,
		color: "rgba(255, 255, 255, 0.6)",
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
	searchButton: {
		justifyContent: "center",
		position: "absolute",
		right: 20,
		top: "50%",
		transform: [{ translateY: -9 }],
	},
	suggestionContainer: {
		width: width * 0.98,
		position: "absolute",
		borderRadius: 5,
		overflow: "hidden",
		zIndex: 0,
	},
	suggestionTopic: {
		padding: 10,
		borderColor: "#333",
		borderWidth: 1,
		borderRadius: 7,
		marginBottom: 2,
	},
	suggestionText: {
		color: "rgba(255, 255, 255, 0.8)",
		fontSize: 16,
	},
})
