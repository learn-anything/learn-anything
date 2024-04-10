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

const { width } = Dimensions.get("window")

export default function Search() {
	const [searchQuery, setSearchQuery] = useState("")
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
						style={styles.searchInput}
						placeholder="search or enter topic name..."
						placeholderTextColor="rgba(255, 255, 255, 0.5)"
						value={searchQuery}
						onChangeText={(text) => {
							setSearchQuery(text)
							setShowSuggestions(true)
						}}
						onFocus={() => setShowSuggestions(true)}
					/>
					<TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
						<AntDesign
							name="search1"
							size={18}
							color="rgba(255, 255, 255, 0.8)"
						/>
					</TouchableOpacity>
				</View>
				<Animated.View
					style={[styles.suggestionsContainer, { height: animations }]}
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
		width: width * 0.9,
		flexDirection: "row",
		alignItems: "center",
		position: "absolute",
		top: 250,
		zIndex: 1,
	},
	searchInput: {
		flex: 1,
		marginVertical: 10,
		borderColor: "#DDD",
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		color: "rgba(255, 255, 255, 0.8)",
	},
	searchButton: {
		marginLeft: 5,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#232323",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		padding: 10,
	},
	suggestionsContainer: {
		marginTop: 10,
		width: width * 0.9,
		height: 100,
		position: "absolute",
		top: 300,
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
