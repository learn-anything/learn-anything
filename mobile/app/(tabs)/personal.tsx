import React, { useState, useEffect } from "react"
import {
	View,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	Image,
	Alert,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { SimpleLineIcons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function Personal() {
	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)

	useEffect(() => {
		;(async () => {
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
			if (status !== "granted") {
				Alert.alert("we need camera roll permissions to pick an image")
			}
		})()
	}, [])

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		})
		if (!result.canceled) {
			setAvatarUrl(result.assets[0].uri)
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.personalContainer}>
				<View style={styles.personalInfo}>
					<View style={styles.personalAvatarName}>
						<TouchableOpacity onPress={pickImage}>
							{avatarUrl ? (
								<Image
									source={{ uri: avatarUrl }}
									style={styles.personalAvatar}
								/>
							) : (
								<View style={styles.placeholderAvatar}>
									<SimpleLineIcons name="paper-clip" size={20} color="white" />
								</View>
							)}
						</TouchableOpacity>
						<View>
							<Text style={styles.personalName}>My Name</Text>
							<Text style={styles.personalUsername}>
								@username · 5 Following
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.settingsContainer}>
					<TouchableOpacity>
						<SimpleLineIcons
							name="share-alt"
							size={18}
							color="rgba(255, 255, 255, 1)"
						/>
					</TouchableOpacity>
					<TouchableOpacity>
						<SimpleLineIcons
							name="settings"
							size={18}
							color="rgba(255, 255, 255, 1)"
						/>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F0F0F",
	},
	settingsContainer: {
		position: "absolute",
		top: 10,
		right: 2,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "15%",
		shadowColor: "#FFF",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 5,
	},
	personalContainer: {
		width: width * 0.9,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
		alignItems: "center",
	},
	personalInfo: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		paddingLeft: 10,
	},
	personalAvatarName: {
		display: "flex",
		flexDirection: "row",
		alignItems: "flex-start",
	},
	personalName: {
		color: "white",
		fontSize: 20,
		alignSelf: "flex-start",
		paddingLeft: 10,
		fontWeight: "300",
		paddingTop: 10,
	},
	personalUsername: {
		color: "rgba(255, 255, 255, 0.6)",
		fontSize: 14,
		alignSelf: "flex-start",
		paddingLeft: 10,
		fontWeight: "400",
		paddingTop: 5,
	},
	placeholderAvatar: {
		width: 70,
		height: 70,
		borderRadius: 50,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		alignItems: "center",
		justifyContent: "center",
	},
	personalAvatar: {
		width: 50,
		height: 50,
		borderRadius: 50,
	},
})
