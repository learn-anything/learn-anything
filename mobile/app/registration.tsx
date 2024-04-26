import React, { useState } from "react"
import {
	View,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	Image,
	TextInput,
} from "react-native"
import { SimpleLineIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

const { width } = Dimensions.get("window")

export default function Registration() {
	const [name, setName] = useState("")
	const [avatar, setAvatar] = useState<string | undefined>(undefined)
	const [username, setUsername] = useState("")
	const [bio, setBio] = useState("")
	const [website, setWebsite] = useState("")

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
		if (status !== "granted") {
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		})

		if (!result.canceled) {
			setAvatar(result.assets[0].uri)
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.view}>
				<Text style={styles.viewText}>Profile</Text>
				<TouchableOpacity>
					<SimpleLineIcons
						name="settings"
						size={18}
						color="rgba(255, 255, 255, 0.8)"
					/>
				</TouchableOpacity>
			</View>
			<TouchableOpacity onPress={pickImage} style={styles.placeholderAvatar}>
				{avatar ? (
					<Image
						source={{ uri: avatar }}
						style={{ width: 100, height: 100, borderRadius: 12.5 }}
					/>
				) : (
					<Text
						style={{
							color: "rgba(255, 255, 255, 0.5)",
							fontSize: 12,
							fontWeight: "500",
							textAlign: "center",
							width: 40,
						}}
					>
						{"+\nPhoto"}
					</Text>
				)}
			</TouchableOpacity>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					placeholder="Your name"
					placeholderTextColor="rgba(255, 255, 255, 0.5)"
					onChangeText={(text) => setName(text)}
					value={name}
				/>
				<TextInput
					style={styles.input}
					placeholder="Username"
					placeholderTextColor="rgba(255, 255, 255, 0.5)"
					onChangeText={(text) => setUsername(text)}
				/>
				<View style={styles.urlContainer}>
					<Text style={styles.urlText}>learn-anything.xyz/@{username}</Text>
				</View>
				<TextInput
					style={styles.input}
					placeholder="Website"
					placeholderTextColor="rgba(255, 255, 255, 0.5)"
					autoCapitalize="none"
					onChangeText={(text) => {
						const filteredText = text.replace(/[^a-z]/g, "")
						setWebsite(filteredText)
					}}
					value={website}
				/>
				<TextInput
					style={[styles.input, styles.bioInput]}
					placeholder="Bio"
					placeholderTextColor="rgba(255, 255, 255, 0.5)"
					multiline={true}
					numberOfLines={4}
					onChangeText={(text) => setBio(text)}
					value={bio}
				/>
			</View>
			<TouchableOpacity style={styles.makePublicButton}>
				<Text style={styles.makePublicButtonText}>Make public</Text>
			</TouchableOpacity>
			<Text style={styles.publicContentText}>
				Your public content will appear here
			</Text>
		</SafeAreaView>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F0F0F",
		alignItems: "center",
	},
	view: {
		width: width * 0.9,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	viewText: {
		color: "rgba(255, 255, 255, 1)",
		fontSize: 16,
		fontWeight: "700",
	},
	placeholderAvatar: {
		marginTop: 10,
		width: 100,
		height: 100,
		borderRadius: 12.5,
		borderColor: "rgba(255, 255, 255, 0.1)",
		borderWidth: 1,
		borderStyle: "dashed",
		backgroundColor: "transparent",
		alignItems: "center",
		justifyContent: "center",
	},
	inputContainer: {
		width: "100%",
		marginTop: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		height: 50,
		width: width * 0.95,
		backgroundColor: "#121212",
		marginVertical: 10,
		paddingHorizontal: 10,
		color: "white",
		borderRadius: 5,
	},
	bioInput: {
		height: 140,
		textAlignVertical: "top",
		paddingTop: 13,
	},
	urlContainer: {
		marginVertical: 10,
		paddingLeft: 10,
		alignSelf: "flex-start",
	},
	urlText: {
		color: "rgba(255, 255, 255, 0.5)",
		fontSize: 16,
	},
	makePublicButton: {
		marginTop: 20,
		backgroundColor: "#121212",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		alignSelf: "flex-start",
		marginLeft: width * 0.025,
	},
	makePublicButtonText: {
		color: "rgba(255, 255, 255, 0.5)",
		fontSize: 16,
		fontWeight: "500",
	},
	publicContentText: {
		borderTopWidth: 2,
		borderTopColor: "rgba(255, 255, 255, 0.1)",
		paddingTop: 40,
		color: "rgba(255, 255, 255, 0.5)",
		fontSize: 16,
		textAlign: "center",
		width: width * 0.9,
	},
})
