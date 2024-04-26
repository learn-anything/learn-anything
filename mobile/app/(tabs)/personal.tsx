import React, { useState } from "react"
import {
	View,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	Image,
	ScrollView,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { SimpleLineIcons } from "@expo/vector-icons"
import CustomAlertModal from "../components/CustomAlert"
import {
	PersonalLinkIcon,
	JobIcon,
	LeftArrowIcon,
} from "../../assets/svg/icons"
import Rive from "rive-react-native"

const { width } = Dimensions.get("window")

export default function Personal() {
	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
	const [isCustomAlertVisible, setIsCustomAlertVisible] = useState(false)

	const sections = [
		{ key: "Links", title: "Links" },
		{ key: "Pages", title: "Ableton 12" },
		{ key: "Courses", title: "ADHD" },
		{ key: "A", title: "Householding" },
	]

	const links = [
		{ key: "w", title: "Links" },
		{ key: "s", title: "Ableton 12" },
		{ key: "c", title: "ADHD" },
		{ key: "v", title: "Householding" },
	]

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
		if (status !== "granted") {
			setIsCustomAlertVisible(true)
			return
		}

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
			<View style={styles.fixedBar}>
				<Text style={styles.personalUsername}>@username</Text>
				<TouchableOpacity>
					{/* <SimpleLineIcons
						name="settings"
						size={18}
						color="rgba(255, 255, 255, 0.5)"
					/> */}
					<Rive
						url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
						artboardName="Avatar 1"
						stateMachineName="avatar"
						style={{ width: 20, height: 20 }}
					/>
				</TouchableOpacity>
			</View>
			<ScrollView>
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
									<View style={styles.placeholderAvatar}></View>
								)}
							</TouchableOpacity>
							<View style={styles.personalInformation}>
								<Text style={styles.personalName}>Profile Name</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										height: 25,
										marginBottom: 10,
									}}
								>
									<JobIcon />
									<Text style={styles.personalJob}>Figma expert</Text>
								</View>

								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										height: 20,
									}}
								>
									<PersonalLinkIcon />
									<Text style={styles.personalSite}>example@gmail.com</Text>
								</View>
							</View>
						</View>
					</View>
					{/* <View style={styles.settingsContainer}>
						<TouchableOpacity>
							<SimpleLineIcons
								name="settings"
								size={18}
								color="rgba(255, 255, 255, 0.5)"
							/>
						</TouchableOpacity>
					</View> */}
					<View style={styles.numbers}>
						<View style={styles.numberContainer}>
							<Text style={styles.numberQuantity}>32</Text>
							<Text style={styles.numberText}>Learning</Text>
						</View>
						<View style={styles.numberContainer}>
							<Text style={styles.numberQuantity}>43</Text>
							<Text style={styles.numberText}>To Learn</Text>
						</View>
						<View style={styles.numberContainer}>
							<Text style={styles.numberQuantity}>3</Text>
							<Text style={styles.numberText}>Learned</Text>
						</View>
					</View>
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Public Pages</Text>
						{sections.map((section) => (
							<View key={section.key} style={styles.sectionTitleContainer}>
								<Text style={styles.sectionText}>{section.title}</Text>
								<TouchableOpacity style={{ alignSelf: "center" }}>
									<LeftArrowIcon />
								</TouchableOpacity>
							</View>
						))}
					</View>
					<View style={styles.link}>
						<Text style={styles.sectionTitle}>Public Links</Text>
						{links.map((link) => (
							<View key={link.key} style={styles.sectionTitleContainer}>
								<Text style={styles.sectionText}>{link.title}</Text>
								<TouchableOpacity style={{ alignSelf: "center" }}>
									<LeftArrowIcon />
								</TouchableOpacity>
							</View>
						))}
					</View>
				</View>
				<CustomAlertModal
					modalVisible={isCustomAlertVisible}
					setModalVisible={setIsCustomAlertVisible}
				/>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F0F0F",
		alignItems: "center",
	},
	fixedBar: {
		width: width * 0.9,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		position: "absolute",
		top: 25,
		left: "5%",
		right: "5%",
		marginTop: 30,
		marginBottom: 40,
		backgroundColor: "#0F0F0F",
		zIndex: 1,
	},
	settingsContainer: {
		position: "absolute",
		top: 0,
		right: -15,
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
		width: width * 0.95,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 18,
		alignItems: "center",
		paddingBottom: 20,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
		borderBottomWidth: 1,
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
	personalInformation: {
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		paddingLeft: 15,
	},
	personalName: {
		color: "white",
		fontSize: 25,
		alignSelf: "flex-start",
		fontWeight: "700",
		paddingTop: 10,
		paddingBottom: 20,
	},
	personalJob: {
		color: "rgba(255, 255, 255, 1)",
		fontSize: 16,
		alignSelf: "flex-start",
		paddingBottom: 15,
	},
	personalSite: {
		color: "rgba(255, 255, 255, 0.5)",
		fontSize: 16,
		alignSelf: "flex-start",
		paddingBottom: 10,
	},
	personalUsername: {
		color: "rgba(255, 255, 255, 1)",
		fontSize: 14,
		alignSelf: "flex-start",
		paddingBottom: 10,
		fontWeight: "600",
	},
	placeholderAvatar: {
		marginTop: 10,
		width: 100,
		height: 100,
		borderRadius: 12.5,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		alignItems: "center",
		justifyContent: "center",
	},
	personalAvatar: {
		marginTop: 10,
		width: 100,
		height: 100,
		borderRadius: 12.5,
	},
	numbers: {
		position: "absolute",
		top: 180,
		left: "10%",
		width: "80%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	numberContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	numberQuantity: {
		fontSize: 40,
		fontWeight: "700",
		color: "white",
	},
	numberText: {
		color: "rgba(255, 255, 255, 0.6)",
		fontSize: 16,
		fontWeight: "700",
	},
	section: {
		position: "absolute",
		top: 280,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "100%",
	},
	sectionTitle: {
		color: "rgba(255, 255, 255, 0.5)",
		fontSize: 14,
		alignSelf: "flex-start",
		fontStyle: "normal",
		fontWeight: "400",
		paddingBottom: 5,
	},
	sectionTitleContainer: {
		borderColor: "#121212",
		borderRadius: 10,
		borderWidth: 1,
		backgroundColor: "#121212",
		marginVertical: 0.5,
		paddingHorizontal: 5,
		width: width * 0.95,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	sectionText: {
		color: "white",
		fontSize: 16,
		fontWeight: "500",
		paddingVertical: 10,
		alignSelf: "flex-start",
	},
	link: {
		position: "absolute",
		bottom: -550,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "100%",
	},
})
