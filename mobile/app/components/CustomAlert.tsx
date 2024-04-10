import React, { useState } from "react"
import { Modal, StyleSheet, Text, Pressable, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const CustomAlertModal = () => {
	const [modalVisible, setModalVisible] = useState(false)

	return (
		<View style={styles.centeredView}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible)
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>
							We need camera roll permissions to pick an image
						</Text>
						<Pressable onPress={() => setModalVisible(!modalVisible)}>
							<Text style={styles.textStyle}>Hide Modal</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
			<Pressable
				style={[styles.button, styles.buttonOpen]}
				onPress={() => setModalVisible(true)}
			>
				<Ionicons name="close-outline" size={24} color="white" />
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
	},
	modalView: {
		margin: 20,
		backgroundColor: "rgba(255, 255, 255, 0.6)",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
})

export default CustomAlertModal
