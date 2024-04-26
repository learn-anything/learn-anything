import React, { useState, useRef } from "react"
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	TextInput,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
	BackgroundSvg,
	LearnAnythingIcon,
	LockIcon,
	SocialIcons,
} from "../assets/svg/icons"

const { width } = Dimensions.get("window")

const isValidEmail = (email: string): boolean => {
	const emailPattern =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return emailPattern.test(email.toLowerCase())
}

type InputProps = {
	length?: number
	onComplete: (pin: string) => void
}

const OTPInput = ({ length = 6, onComplete }: InputProps) => {
	const inputRef = useRef<Array<TextInput | null>>(Array(length).fill(null))
	const [OTP, setOTP] = useState<Array<string>>(Array(length).fill(""))
	const [currentInput, setCurrentInput] = useState(-1)

	const handleTextChange = (input: string, index: number) => {
		const newPin = [...OTP]
		newPin[index] = input.replace(/[^0-9]/g, "")
		setOTP(newPin)

		if (input) {
			if (index < length - 1) {
				inputRef.current[index + 1]?.focus()
			}
		} else {
			if (index > 0 && newPin.slice(0, index).some((digit) => digit !== "")) {
				inputRef.current[index - 1]?.focus()
			}
		}
		if (newPin.every((digit) => digit !== "")) {
			onComplete(newPin.join(""))
		}
	}

	const handleKeyPress = ({
		nativeEvent: { key },
		index,
	}: {
		nativeEvent: { key: string }
		index: number
	}) => {
		if (key === "Backspace" && index > 0 && OTP[index] === "") {
			const newOTP = [...OTP]
			newOTP[index - 1] = ""
			setOTP(newOTP)
			inputRef.current[index - 1]?.focus()
		}
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<View style={styles.numberBoxContainer}>
				{Array.from({ length }, (_, index) => (
					<TextInput
						key={index}
						keyboardType="numeric"
						maxLength={1}
						onChangeText={(text) => handleTextChange(text, index)}
						onKeyPress={(e) =>
							handleKeyPress({ nativeEvent: e.nativeEvent, index })
						}
						onFocus={() => setCurrentInput(index)}
						style={[
							styles.numberBox,
							index !== length - 1 ? { marginRight: 10 } : {},
							currentInput === index ? styles.currentInputColor : {},
						]}
						ref={(el) => (inputRef.current[index] = el)}
					/>
				))}
			</View>
		</TouchableWithoutFeedback>
	)
}

export default function TabTwoScreen() {
	const [email, setEmail] = useState("")
	const [isSubmitted, setIsSubmitted] = useState(false)

	return (
		<SafeAreaView style={styles.container}>
			<BackgroundSvg />
			<TouchableOpacity style={{ marginTop: 28 }}>
				<LearnAnythingIcon />
			</TouchableOpacity>
			<View style={styles.authContainer}>
				<View style={styles.titleContainer}>
					<TouchableOpacity
						style={{ marginTop: 30, marginBottom: 15, width: 20, height: 25 }}
					>
						<LockIcon />
					</TouchableOpacity>
					<Text style={styles.welcomeTitle}>Welcome</Text>
				</View>
				{/* number box */}
				{isSubmitted ? (
					<>
						<OTPInput
							length={6}
							onComplete={(pin) => {
								console.log("Entered PIN:", pin)
							}}
						/>
						<Text style={styles.textWarning}>
							Enter the code that was sent to user.Email
						</Text>
						<TouchableOpacity style={styles.resendCodeButton}>
							<Text style={styles.resendCodeText}>Resend code</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setIsSubmitted(false)
								setEmail("")
							}}
						>
							<Text style={styles.backText}>Back</Text>
						</TouchableOpacity>
					</>
				) : (
					<>
						<View style={styles.inputContainer}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
									height: 50,
									marginTop: 30,
									width: "95%",
								}}
							>
								<TextInput
									style={[
										styles.input,
										email.trim() !== "" ? styles.inputActive : {},
										isValidEmail(email) ? styles.inputValid : {},
									]}
									placeholder="Enter email"
									textAlign="center"
									placeholderTextColor="rgba(255, 255, 255, 0.2)"
									autoCapitalize="none"
									onChangeText={(text) => setEmail(text.toLowerCase())}
								/>
								{isValidEmail(email) && (
									<TouchableOpacity
										style={styles.continueButton}
										onPress={() => setIsSubmitted(true)}
									>
										<Text style={styles.continueText}>Continue</Text>
									</TouchableOpacity>
								)}
							</View>

							<Text
								style={{
									color: "rgba(255, 255, 255, 0.3)",
									marginVertical: 15,
								}}
							>
								or
							</Text>
							<TouchableOpacity style={styles.passkeyButton}>
								<Text style={styles.passkeyText}>Sign in with a passkey</Text>
							</TouchableOpacity>
						</View>
						<Text style={styles.textWarning}>
							By clicking on either button, you agree to the{" "}
							<Text
								style={{
									textDecorationLine: "underline",
									textDecorationStyle: "solid",
									paddingBottom: 2, // wtf doesnt work
									borderBottomWidth: 1,
									lineHeight: 24,
								}}
							>
								Terms of Service
							</Text>
						</Text>
					</>
				)}
			</View>
			<View style={styles.linkContainer}>
				<Text style={{ color: "white", opacity: 0.3 }}>Learn Anything</Text>
				<View style={styles.socialIcons}>
					<SocialIcons />
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		width,
		backgroundColor: "#0F0F0F",
		position: "relative",
	},
	authContainer: {
		flexDirection: `column`,
		alignItems: `center`,
		marginHorizontal: "auto",
		width: "95%",
		backgroundColor: "#0F0F0F",
		borderRadius: 7,
		borderWidth: 1,
		borderColor: "#191919",
		height: "50%",
		marginTop: 35,
	},
	titleContainer: {
		display: `flex`,
		flexDirection: `column`,
		alignItems: `center`,
		width,
	},
	welcomeTitle: {
		fontSize: 20,
		fontWeight: "800",
		color: "#fff",
	},
	inputContainer: {
		display: `flex`,
		flexDirection: `column`,
		alignItems: `center`,
		marginBottom: 30,
	},
	input: {
		width: 340,
		fontSize: 16,
		backgroundColor: "#191919",
		padding: 13,
		borderRadius: 7,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.10)",
		color: "white",
		fontWeight: "500",
		height: 50,
	},
	inputActive: {
		backgroundColor: "#111318",
	},
	inputValid: {
		width: 220,
		marginRight: 10,
	},
	passkeyButton: {
		width: 340,
		padding: 11,
		borderWidth: 1,
		backgroundColor: "#232323",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
	},
	passkeyText: {
		color: "rgba(255, 255, 255, 1)",
		opacity: 0.7,
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
	},
	textWarning: {
		fontSize: 14,
		color: "white",
		opacity: 0.3,
		width: 260,
		textAlign: "center",
		marginBottom: 30,
		lineHeight: 22,
	},
	linkContainer: {
		flexDirection: "column",
		position: "absolute",
		bottom: 40,
		width: "100%",
		alignItems: "center",
	},
	socialIcons: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15,
	},
	continueButton: {
		borderColor: "rgba(255, 255, 255, 0.10)",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 11,
		backgroundColor: "#232323",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		padding: 11,
		height: 50,
		width: 110,
	},
	continueText: {
		color: "rgba(255, 255, 255, 1)",
		opacity: 0.7,
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
	},
	numberBoxContainer: {
		marginTop: 30,
		marginBottom: 14,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	numberBox: {
		width: 48,
		height: 45,
		borderRadius: 7,
		borderColor: "rgba(255, 255, 255, 0.03)",
		borderWidth: 1,
		backgroundColor: "rgb(32 32 32)",
		color: "white",
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
	},
	currentInputColor: {
		backgroundColor: "#181a1f",
	},
	resendCodeButton: {
		width: "35%",
		padding: 8,
		borderWidth: 1,
		backgroundColor: "#232323",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
	},
	resendCodeText: {
		color: "rgba(255, 255, 255, 1)",
		opacity: 0.7,
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
	},
	backText: {
		fontSize: 16,
		fontWeight: "500",
		textAlign: "center",
		color: "white",
		opacity: 0.5,
		marginTop: 17,
	},
})
