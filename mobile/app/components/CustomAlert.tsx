import React, { useState, useEffect } from "react"
import { Modal, StyleSheet, Text, Pressable, View, Linking } from "react-native"

interface CustomAlertModalProps {
	modalVisible: boolean
	setModalVisible: (visible: boolean) => void
}

const CustomAlertModal = ({
	modalVisible,
	setModalVisible,
}: CustomAlertModalProps) => {
	useEffect(() => {
		let timerId: NodeJS.Timeout | null = null
		if (modalVisible) {
			timerId = setTimeout(() => {
				setModalVisible(false)
			}, 9000)
		}
		return () => {
			if (timerId) clearTimeout(timerId)
		}
	}, [modalVisible])

	return (
		<View style={styles.centeredView}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(!modalVisible)}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalWarning}>
							Learn Anything would like to access Your Photos.
						</Text>
						<Text style={[styles.modalWarning, { fontSize: 12 }]}>
							Open the app settings and allow photo sharing.
						</Text>
						<View
							style={{ flexDirection: "row", justifyContent: "space-around" }}
						>
							<Pressable
								onPress={() => setModalVisible(!modalVisible)}
								style={{ marginRight: 10 }}
							>
								<Text style={styles.textStyle}>Ok</Text>
							</Pressable>
							<Pressable onPress={() => Linking.openURL("app-settings:")}>
								<Text style={styles.textStyle}>Open settings</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
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
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalWarning: {
		marginBottom: 10,
		color: "black",
		fontSize: 16,
		textAlign: "center",
	},
})

export default CustomAlertModal
