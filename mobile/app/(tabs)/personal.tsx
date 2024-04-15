import React, { useState } from "react"
import {
	View,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	Image,
} from "react-native"
import Svg, { Path, G } from "react-native-svg"
import * as ImagePicker from "expo-image-picker"
import { SimpleLineIcons } from "@expo/vector-icons"
import CustomAlertModal from "../components/CustomAlert"

const { width } = Dimensions.get("window")

export default function Personal() {
	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
	const [isCustomAlertVisible, setIsCustomAlertVisible] = useState(false)

	const sections = [
		{ key: "Links", title: "Links" },
		{ key: "Pages", title: "Pages" },
		{ key: "Courses", title: "Courses" },
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
			<View style={styles.personalContainer}>
				<View style={styles.personalInfo}>
					<Text style={styles.personalUsername}>@username</Text>
					<View style={styles.personalAvatarName}>
						<TouchableOpacity onPress={pickImage}>
							{avatarUrl ? (
								<Image
									source={{ uri: avatarUrl }}
									style={styles.personalAvatar}
								/>
							) : (
								<View style={styles.placeholderAvatar}>
									<SimpleLineIcons name="paper-clip" size={17} color="white" />
								</View>
							)}
						</TouchableOpacity>
						<View style={styles.personalInformation}>
							<Text style={styles.personalName}>Profile Name</Text>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									height: 25,
								}}
							>
								<Svg
									width="21"
									height="24"
									viewBox="0 0 21 24"
									fill="none"
									style={{ marginRight: 2 }}
								>
									<Path
										opacity="0.2"
										d="M8.79545 17.0312H5.98864L0.536932 8.93466V8.66477H3.61364L8.79545 17.0312ZM8.79545 0.460227L3.61364 8.8267H0.536932V8.55682L5.98864 0.460227H8.79545ZM15.7045 17.0312H12.8977L7.44602 8.93466V8.66477H10.5227L15.7045 17.0312ZM15.7045 0.460227L10.5227 8.8267H7.44602V8.55682L12.8977 0.460227H15.7045Z"
										fill="white"
									/>
								</Svg>
								<Text style={styles.personalJob}>Figma expert</Text>
							</View>

							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									height: 25,
									marginTop: 10,
								}}
							>
								<Svg
									width="18"
									height="18"
									viewBox="0 0 18 18"
									fill="none"
									style={{ marginRight: 4, marginBottom: 2 }}
								>
									<G opacity="0.2">
										<Path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M12.6592 7.18364C12.9846 7.50908 12.9838 8.03753 12.6619 8.35944L7.94245 13.0789C7.61851 13.4028 7.09435 13.4039 6.76665 13.0762C6.44121 12.7508 6.44203 12.2223 6.76393 11.9004L11.4834 7.18093C11.8073 6.85699 12.3315 6.85593 12.6592 7.18364ZM6.76666 16.6117C5.79136 17.587 4.20579 17.5864 3.23111 16.6117C2.25561 15.6362 2.25611 14.0512 3.23112 13.0762L5.58813 10.7192C5.91357 10.3937 5.91357 9.8661 5.58813 9.54066C5.2627 9.21522 4.73506 9.21522 4.40962 9.54066L2.05261 11.8977C0.426886 13.5234 0.426063 16.1637 2.0526 17.7902C3.67795 19.4156 6.31879 19.4166 7.94517 17.7902L10.3022 15.4332C10.6276 15.1078 10.6276 14.5801 10.3022 14.2547C9.97674 13.9293 9.44911 13.9293 9.12367 14.2547L6.76666 16.6117ZM17.3732 8.36216C18.9996 6.73578 18.9986 4.09494 17.3732 2.46959C15.7467 0.843055 13.1064 0.843878 11.4807 2.46961L9.12367 4.82662C8.79823 5.15205 8.79823 5.67969 9.12367 6.00513C9.44911 6.33056 9.97674 6.33056 10.3022 6.00513L12.6592 3.64812C13.6342 2.6731 15.2192 2.6726 16.1947 3.6481C17.1694 4.62278 17.17 6.20835 16.1947 7.18365L13.8377 9.54066C13.5123 9.8661 13.5123 10.3937 13.8377 10.7192C14.1631 11.0446 14.6908 11.0446 15.0162 10.7192L17.3732 8.36216Z"
											fill="white"
										/>
									</G>
								</Svg>
								<Text style={styles.personalSite}>example@gmail.com</Text>
							</View>
						</View>
					</View>
				</View>
				<View style={styles.settingsContainer}>
					<TouchableOpacity>
						<SimpleLineIcons
							name="settings"
							size={18}
							color="rgba(255, 255, 255, 0.8)"
						/>
					</TouchableOpacity>
				</View>
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
					{sections.map((section) => (
						<View key={section.key} style={styles.sectionTitleContainer}>
							<Text style={styles.sectionText}>{section.title}</Text>
						</View>
					))}
				</View>
			</View>
			<CustomAlertModal
				modalVisible={isCustomAlertVisible}
				setModalVisible={setIsCustomAlertVisible}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F0F0F",
		alignItems: "center",
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
		marginTop: 20,
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
		top: 300,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "100%",
	},
	sectionTitleContainer: {
		borderColor: "#121212",
		borderRadius: 10,
		borderWidth: 1,
		backgroundColor: "#121212",
		marginVertical: 0.5,
		paddingHorizontal: 5,
		width: width * 0.95,
	},
	sectionText: {
		color: "white",
		fontSize: 18,
		fontWeight: "700",
		paddingVertical: 10,
		alignSelf: "flex-start",
	},
})
