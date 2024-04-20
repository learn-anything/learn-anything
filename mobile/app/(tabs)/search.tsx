import React, { useState } from "react"
import {
	SafeAreaView,
	View,
	StyleSheet,
	Image,
	Text,
	TouchableOpacity,
	TextInput,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native"
import AntDesign from "@expo/vector-icons/AntDesign"
import { LeftArrowIcon, LinkIcon } from "../../assets/svg/icons"

export default function Search() {
	const [searchQuery, setSearchQuery] = useState("")
	const [isInputFocused, setIsInputFocused] = useState(false)

	const getLinkIcon = (url: string) => {
		return require("../../assets/favicon.png")
	}

	const handleSearch = () => {
		console.log("search:", searchQuery)
	}

	const renderSection = (
		title: string,
		linkType: string,
		isFocused: boolean,
		length: number = 5,
	) => (
		<>
			<View style={styles.titleContainer}>
				<Text style={styles.searchTitle}>{title}</Text>
				{title !== "Recent Pages" && (
					<TouchableOpacity>
						<Text style={styles.showmore}>Show more</Text>
					</TouchableOpacity>
				)}
			</View>
			<View style={styles.element}>
				{Array.from({ length }, (_, i) => (
					<TouchableOpacity key={i} style={styles.elementContainer}>
						<View style={styles.leftContent}>
							{isFocused && (
								<Image source={getLinkIcon(linkType)} style={styles.icon} />
							)}
							<Text style={styles.elementText}>
								{linkType} {i + 1}
							</Text>
						</View>
						{title === "Popular Links" ? <LinkIcon /> : <LeftArrowIcon />}
					</TouchableOpacity>
				))}
			</View>
		</>
	)

	const renderContent = (isInputFocused: boolean) => (
		<View>
			{isInputFocused ? (
				<>
					{renderSection("Popular Topics", "Topic title", true)}
					{renderSection("Popular Links", "Link title", true)}
				</>
			) : (
				<>
					{renderSection("Recent Pages", "Page title", false, 4)}
					{renderSection("Recent Topics", "Topic title", true)}
				</>
			)}
		</View>
	)

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss()
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
						}}
						onFocus={() => {
							setIsInputFocused(true)
						}}
						onBlur={() => setIsInputFocused(false)}
					/>
					<TouchableOpacity
						style={[
							isInputFocused
								? styles.focusedSearchButton
								: styles.unfocusedSearchButton,
						]}
						onPress={handleSearch}
					>
						<AntDesign
							name="search1"
							size={20}
							color="rgba(255, 255, 255, 0.4)"
						/>
					</TouchableOpacity>
				</View>

				<View style={styles.pageContainer}>
					{renderContent(isInputFocused)}
				</View>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
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
		paddingLeft: 40,
	},
	unfocusedInput: {
		textAlign: "center",
		backgroundColor: "#191919",
	},
	focusedSearchButton: {
		justifyContent: "center",
		position: "absolute",
		top: "50%",
		left: "5%",
		transform: [{ translateY: -9 }],
	},
	unfocusedSearchButton: {
		justifyContent: "center",
		position: "absolute",
		top: "50%",
		left: "20%",
		transform: [{ translateY: -9 }],
	},
	pageContainer: {
		position: "absolute",
		top: 130,
		display: "flex",
		flexDirection: "column",
		width: "100%",
		alignSelf: "center",
	},
	titleContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		alignSelf: "center",
		width: "90%",
	},
	searchTitle: {
		color: "rgba(255, 255, 255, 0.6)",
		fontWeight: "400",
		fontSize: 14,
	},
	showmore: {
		color: "rgba(255, 255, 255, 0.3)",
		fontWeight: "400",
		fontSize: 14,
	},
	element: {
		marginVertical: 15,
		width: " 95%",
		alignSelf: "center",
	},
	elementContainer: {
		padding: 10,
		marginBottom: 2,
		borderRadius: 5,
		backgroundColor: "#121212",
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
	},
	leftContent: {
		flexDirection: "row",
		textAlign: "left",
	},
	icon: {
		width: 16,
		height: 16,
		marginRight: 10,
	},
	elementText: {
		color: "rgba(255, 255, 255, 1)",
		fontSize: 16,
		alignItems: "flex-start",
		textAlign: "left",
		fontWeight: "500",
	},
})
