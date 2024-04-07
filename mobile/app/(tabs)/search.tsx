import React, { useState, useRef } from "react"
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
} from "react-native"
import AntDesign from "@expo/vector-icons/AntDesign"
import Svg, {
	G,
	Path,
	Defs,
	LinearGradient as SvgLinearGradient,
	Stop,
	ClipPath,
	Rect,
	RadialGradient,
	Circle,
} from "react-native-svg"

const { width } = Dimensions.get("window")

export default function Search() {
	const [searchQuery, setSearchQuery] = useState("")

	const handleSearch = () => {
		console.log("search:", searchQuery)
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<SafeAreaView style={styles.container}>
				<View style={styles.searchContainer}>
					<TextInput
						style={styles.searchInput}
						placeholder="search or enter topic name..."
						placeholderTextColor="rgba(255, 255, 255, 0.5)"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					<TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
						<AntDesign
							name="search1"
							size={18}
							color="rgba(255, 255, 255, 0.8)"
						/>
					</TouchableOpacity>
				</View>
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
})
