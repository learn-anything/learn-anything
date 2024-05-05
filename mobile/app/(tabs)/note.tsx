import React, { useState, useRef, useEffect } from "react"
import {
	Animated,
	SafeAreaView,
	View,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
	TextInput,
	Keyboard,
	TouchableWithoutFeedback,
	Image,
} from "react-native"
// import {
// 	useEditorBridge,
// 	RichText,
// 	TenTapStartKit,
// } from "@10play/tentap-editor"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import {
	LeftArrowIcon,
	LinkIcon,
	ArrowIcon,
	HeartIcon,
	NoteIcon,
	FlagIcon,
} from "../../assets/svg/icons"
import { AntDesign } from "@expo/vector-icons"

const { width } = Dimensions.get("window")
const { height } = Dimensions.get("window")

export default function Note() {
	const [text, setText] = useState("")
	const inputRef = useRef<TextInput>(null)
	const [isFocused, setIsFocused] = useState(false)
	const [selectedTab, setSelectedTab] = useState("Page")
	const [searchQuery, setSearchQuery] = useState("")
	const [isInputFocused, setIsInputFocused] = useState(false)
	const [typing, setTyping] = useState(false)
	const [richTextContent, setRichTextContent] = useState("")
	const [isPrivate, setIsPrivate] = useState(true)

	//learning buttons
	const [showSheetLearningButtons, setShowSheetLearningButtons] =
		useState(false)
	const [sheetAnimationButtons, setSheetAnimationButtons] = useState<
		Animated.Value[]
	>([])
	const [sheetLearningStatus, setSheetLearningStatus] = useState("To Learn")

	useEffect(() => {
		setSheetAnimationButtons([new Animated.Value(0), new Animated.Value(0)])
	}, [])

	const showSheetButtons = (nextStatus?: string) => {
		setShowSheetLearningButtons(!showSheetLearningButtons)

		if (nextStatus) {
			setSheetLearningStatus(nextStatus)
		}

		const sheetAnimationsEnd = showSheetLearningButtons ? 0 : 1
		const staggeredSheetAnimations = sheetAnimationButtons.map((button) =>
			Animated.timing(button, {
				toValue: sheetAnimationsEnd,
				duration: 200,
				useNativeDriver: true,
			}),
		)

		Animated.parallel(staggeredSheetAnimations).start()
	}

	const toggleVisibility = () => {
		setIsPrivate(!isPrivate)
	}

	const position = useRef(new Animated.Value(height - 100)).current

	const animateToTop = () => {
		Animated.timing(position, {
			toValue: 0,
			duration: 300,
			useNativeDriver: false,
		}).start()
	}

	const animateToBottom = () => {
		position.setValue(height - 115)
	}

	useEffect(() => {
		if (isInputFocused) {
			animateToTop()
		} else {
			animateToBottom()
		}
	}, [isInputFocused])

	useEffect(() => {
		if (isInputFocused) {
			inputRef.current?.focus()
		}
	}, [isInputFocused])

	const handleRichTextChange = (newText: string) => {
		setRichTextContent(newText)
	}

	const getLinkIcon = (url: string) => {
		return require("../../assets/favicon.png")
	}

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss()
				setSearchQuery("")
				setIsInputFocused(false)
			}}
			accessible={false}
		>
			{isInputFocused ? (
				<SafeAreaView style={styles.container}>
					<View style={styles.tabContainer}>
						<TouchableOpacity
							style={[
								styles.tab,
								selectedTab === "Page"
									? styles.selectedTab
									: styles.unselectedTab,
							]}
							onPress={() => setSelectedTab("Page")}
						>
							<Text style={styles.tabText}>Page</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.tab,
								selectedTab === "Link"
									? styles.selectedTab
									: styles.unselectedTab,
							]}
							onPress={() => {
								setSelectedTab("Link")
							}}
						>
							<Text style={styles.tabText}>Link</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: 1, display: "flex", flexDirection: "column" }}>
						<Animated.View
							style={[styles.searchContainerOnly, { top: position }]}
						>
							{selectedTab === "Page" ? (
								<AntDesign
									name="search1"
									size={18}
									color="rgba(255, 255, 255, 0.3)"
									style={{
										position: "absolute",
										left: 20,
										top: 25,
										zIndex: 3,
									}}
								/>
							) : null}
							<TextInput
								ref={inputRef}
								style={[
									styles.searchInputOnly,
									selectedTab === "Link" ? { paddingLeft: 20 } : {},
								]}
								placeholder={
									selectedTab === "Page"
										? "Search for existing page"
										: "Paste a link"
								}
								placeholderTextColor="rgba(255, 255, 255, 0.1)"
								value={searchQuery}
								onChangeText={(text) => {
									if (selectedTab === "Link") {
										const filteredText = text
											.replace(/[^a-zA-Z0-9@.:/\-_+=%&?]/g, "")
											.toLowerCase()
										setSearchQuery(filteredText)
									} else {
										setSearchQuery(text)
									}
								}}
								autoCapitalize="none"
								onBlur={() => setIsInputFocused(false)}
							/>
							{selectedTab === "Page" ||
							(selectedTab === "Link" && searchQuery) ? (
								<AntDesign
									name="close"
									size={14}
									color="rgba(255, 255, 255, 0.2)"
									style={{ position: "absolute", right: 18, top: 28 }}
									onPress={() => setIsInputFocused(false)}
								/>
							) : null}
						</Animated.View>
						{selectedTab === "Page" ? (
							<View style={styles.searchSuggestions}>
								<Text
									style={{ color: "rgba(255, 255, 255, 0.5)", padding: 10 }}
								>
									Pages
								</Text>
								{Array.from({ length: 3 }, (_, i) => (
									<TouchableOpacity key={i} style={styles.suggestionElement}>
										<View style={styles.suggestinLeftContent}>
											<Image
												source={getLinkIcon("url")}
												style={styles.suggestionImage}
											/>
											<Text style={styles.suggestionElementText}>
												Page {i + 1}
											</Text>
										</View>
										<LeftArrowIcon />
									</TouchableOpacity>
								))}
							</View>
						) : (
							<View style={styles.linkContainer}>
								<View>
									<View style={styles.sheetTitleContainer}>
										<View style={styles.titleContainer}>
											<Text
												style={{
													color: "white",
													fontSize: 16,
													fontWeight: "500",
													marginLeft: 8,
												}}
											>
												Sample Title
											</Text>
										</View>
										<View style={styles.sheetButton}>
											<Text style={styles.sheetButtonText}>Open</Text>
										</View>
									</View>
									<View style={styles.sheetLinkContainer}>
										<View style={{ marginRight: 5 }}>
											<LinkIcon />
										</View>
										<Text style={styles.sheetLink}>www.example.com</Text>
									</View>

									<View style={styles.sheetDescriptionContainer}>
										<Text style={styles.sheetInfo}>
											Description text goes here.
										</Text>
										<Text style={styles.sheetDate}>Year · Date</Text>
									</View>
									<View style={styles.sheetStatusContainer}>
										<View style={styles.sheetTopicButton}>
											<Text style={styles.sheetButtonText}>Topic Name</Text>
										</View>
										<View style={styles.sheetHeartIconContainer}>
											<View style={{ marginRight: 10, opacity: 0.4 }}>
												<HeartIcon />
											</View>
											<View
												style={{
													position: "relative",
													flexDirection: "column",
													alignItems: "center",
												}}
											>
												<TouchableOpacity
													style={[
														styles.sheetLearningButton,
														{ paddingLeft: 3 },
													]}
													onPress={() => showSheetButtons()}
												>
													<FlagIcon />
													<Text style={styles.sheetLearningText}>
														{sheetLearningStatus}
													</Text>
													<ArrowIcon />
												</TouchableOpacity>
												{["Learning", "Learned", "To Learn"]
													.filter((s) => s !== sheetLearningStatus)
													.map((status, index) =>
														sheetAnimationButtons[index] ? (
															<Animated.View
																key={index}
																style={[
																	styles.sheetLearningButtonsDropdown,
																	{
																		opacity: sheetAnimationButtons[index],
																		transform: [
																			{
																				scale: sheetAnimationButtons[
																					index
																				].interpolate({
																					inputRange: [0, 1],
																					outputRange: [0.5, 1],
																				}),
																			},
																		],
																		top: 30 + index * 35,
																	},
																]}
															>
																<TouchableOpacity
																	style={styles.sheetAnotherLearningButton}
																	onPress={() => showSheetButtons(status)}
																>
																	<Text
																		style={[
																			styles.sheetLearningText,
																			{ lineHeight: 20 },
																		]}
																	>
																		{status}
																	</Text>
																</TouchableOpacity>
															</Animated.View>
														) : null,
													)}
											</View>
										</View>
									</View>
								</View>
								<View style={styles.sheetNoteContainer}>
									<View style={styles.noteText}>
										<View style={{ marginLeft: 20, opacity: 0.3 }}>
											<NoteIcon />
										</View>
										<TextInput
											style={styles.sheetNoteText}
											value=""
											placeholder="Take a note..."
											placeholderTextColor="rgba(255, 255, 255, 0.9)"
										/>
									</View>
								</View>
							</View>
						)}
					</View>
					<TouchableOpacity style={styles.addLinkButton}>
						<Text style={{ color: "rgba(255, 255, 255, 0.7)" }}>Add link</Text>
					</TouchableOpacity>
				</SafeAreaView>
			) : (
				<SafeAreaView style={styles.container}>
					<View style={styles.tabContainer}>
						<TouchableOpacity
							style={[
								styles.tab,
								selectedTab === "Page"
									? styles.selectedTab
									: styles.unselectedTab,
							]}
							onPress={() => setSelectedTab("Page")}
						>
							<Text style={styles.tabText}>Page</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.tab,
								selectedTab === "Link"
									? styles.selectedTab
									: styles.unselectedTab,
							]}
							onPress={() => setSelectedTab("Link")}
						>
							<Text style={styles.tabText}>Link</Text>
						</TouchableOpacity>
					</View>
					{selectedTab === "Page" ? (
						<View style={styles.noteContainer}>
							<View style={styles.inputContainer}>
								<TextInput
									ref={inputRef}
									style={[
										styles.input,
										!text && !isFocused ? styles.placeholderStyle : {},
									]}
									multiline
									placeholder="New Page"
									placeholderTextColor="rgba(255, 255, 255, 0.3)"
									value={text}
									onChangeText={setText}
								/>

								<View style={{ flex: 1 }}>
									<View>
										<TextInput
											ref={inputRef}
											style={[
												styles.secondInput,
												!text && !isFocused ? styles.smallPlaceholderStyle : {},
											]}
											multiline
											placeholder="Take a note..."
											placeholderTextColor="rgba(255, 255, 255, 0.3)"
											value={richTextContent}
											onChangeText={handleRichTextChange}
										/>
										{!typing ? (
											<Text style={styles.commandsText}>
												Type / to see commands
											</Text>
										) : null}
									</View>
								</View>
							</View>
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={styles.privateButton}
									onPress={toggleVisibility}
								>
									<MaterialCommunityIcons
										name={isPrivate ? "eye-off-outline" : "eye-outline"}
										size={22}
										color="rgba(255, 255, 255, 0.4)"
									/>
								</TouchableOpacity>
								<TouchableOpacity style={styles.settingsButton}>
									<MaterialCommunityIcons
										name="dots-horizontal"
										size={24}
										color="rgba(255, 255, 255, 0.4)"
									/>
								</TouchableOpacity>
							</View>
						</View>
					) : null}

					<Animated.View style={[styles.searchContainer, { top: position }]}>
						<View style={{ position: "relative" }}>
							<AntDesign
								name="search1"
								size={18}
								color="rgba(255, 255, 255, 0.3)"
								style={{
									position: "absolute",
									left: 65,
									top: 24,
									zIndex: 3,
								}}
							/>
							<TextInput
								style={[
									styles.searchInput,
									isInputFocused ? styles.focusedInput : styles.unfocusedInput,
								]}
								placeholder={
									selectedTab === "Page"
										? "Search for existing page"
										: "Search or Paste a link"
								}
								placeholderTextColor="rgba(255, 255, 255, 0.1)"
								value={searchQuery}
								onChangeText={(text) => {
									setSearchQuery(text)
								}}
								onFocus={() => setIsInputFocused(true)}
								onBlur={() => setIsInputFocused(false)}
							/>
						</View>
					</Animated.View>
				</SafeAreaView>
			)}
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F0F0F",
	},

	tabContainer: {
		alignSelf: "center",
		flexDirection: "row",
		overflow: "hidden",
		backgroundColor: "#222222",
		borderRadius: 10,
		width: 120,
	},
	tab: {
		backgroundColor: "#222222",
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 10,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	selectedTab: {
		backgroundColor: "rgba(255, 255, 255, 0.04)",
		borderRadius: 7,
		borderColor: "#222222",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
	},
	unselectedTab: {
		backgroundColor: "rgba(255, 255, 255, 0.0)",
		borderRadius: 7,
		borderColor: "#222222",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
	},
	tabText: {
		fontSize: 16,
		color: "white",
		opacity: 0.7,
	},

	noteContainer: {
		width: "90%",
		display: "flex",
		marginTop: 25,
		marginHorizontal: width * 0.05,
		position: "relative",
	},
	inputContainer: {
		position: "relative",
	},
	placeholderStyle: {
		fontSize: 21,
	},
	smallPlaceholderStyle: {
		fontSize: 15,
	},
	input: {
		fontSize: 22,
		fontWeight: "700",
		color: "rgba(255, 255, 255, 1)",
		paddingTop: 25,
		paddingHorizontal: 11,
		borderRadius: 10,
		backgroundColor: "transparent",
		maxHeight: height * 0.2,
		lineHeight: 20,
		paddingRight: width * 0.06,
	},
	secondInput: {
		fontSize: 14,
		fontWeight: "400",
		color: "rgba(255, 255, 255, 0.9)",
		paddingTop: 20,
		paddingHorizontal: 11,
		borderRadius: 10,
		backgroundColor: "transparent",
		minHeight: height * 0.1,
		maxHeight: height * 0.9,
		lineHeight: 20,
		paddingRight: width * 0.06,
	},
	commandsText: {
		color: "rgba(255, 255, 255, 0.3)",
		fontSize: 16,
		paddingTop: 2,
		paddingLeft: 11,
	},
	buttonContainer: {
		position: "absolute",
		flexDirection: "row",
		top: 0,
		left: 0,
		right: 20,
	},
	privateButton: {
		position: "absolute",
		top: 10,
		right: -10,
		width: "20%",
		backgroundColor: "transparent",
		padding: 8,
	},
	settingsButton: {
		position: "absolute",
		top: 10,
		right: -50,
		width: "20%",
		backgroundColor: "transparent",
		padding: 8,
	},
	borderContainer: {
		width: "100%",
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	addContainer: {
		width: "40%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		marginHorizontal: width * 0.07,
	},
	addText: {
		color: "rgba(255, 255, 255, 0.6)",
		position: "absolute",
		left: 30,
		top: 20,
	},
	optionButton: {
		marginTop: 5,
	},
	button: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		color: "#1c1c1c",
	},
	searchContainer: {
		width: "100%",
		paddingHorizontal: 6,
		flexDirection: "row",
		alignItems: "center",
		position: "absolute",
		bottom: 40,
		justifyContent: "center",
	},
	searchContainerOnly: {
		zIndex: 2,
		width: "100%",
		position: "absolute",
		top: 0,
		paddingHorizontal: 6,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	searchInput: {
		flex: 1,
		marginVertical: 10,
		borderColor: "rgba(255, 255, 255, 0.15)",
		borderWidth: 1,
		borderRadius: 10,
		paddingVertical: 22,
		paddingHorizontal: 15,
		color: "rgba(255, 255, 255, 1)",
		fontSize: 16,
		paddingRight: 40,
		justifyContent: "center",
		backgroundColor: "#131519",
	},
	searchInputOnly: {
		flex: 1,
		marginVertical: 10,
		borderColor: "rgba(255, 255, 255, 0.15)",
		borderWidth: 1,
		borderRadius: 10,
		paddingVertical: 14,
		paddingHorizontal: 15,
		color: "rgba(255, 255, 255, 1)",
		fontSize: 16,
		paddingLeft: 40,
		justifyContent: "center",
		backgroundColor: "#131519",
	},
	focusedInput: {
		textAlign: "left",
	},
	unfocusedInput: {
		textAlign: "center",
		backgroundColor: "#191919",
	},
	searchSuggestions: {
		width: "100%",
		position: "absolute",
		top: 70,
		flexDirection: "column",
		justifyContent: "space-between",
	},
	suggestionElement: {
		padding: 10,
		marginBottom: 2,
		borderRadius: 5,
		backgroundColor: "#121212",
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
	},
	suggestinLeftContent: {
		flexDirection: "row",
		textAlign: "left",
	},
	suggestionImage: {
		width: 16,
		height: 16,
		marginRight: 10,
	},
	suggestionElementText: {
		color: "rgba(255, 255, 255, 1)",
		fontSize: 16,
		alignItems: "flex-start",
		textAlign: "left",
		fontWeight: "500",
	},
	linkContainer: {
		paddingTop: 20,
		position: "absolute",
		top: 80,
		left: 0,
		right: 0,
		backgroundColor: "#171A21",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		width: width * 0.95,
		marginHorizontal: width * 0.025,
	},
	sheetTitleContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "90%",
	},
	titleContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	sheetButton: {
		height: 34,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 11,
		backgroundColor: "#232323",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
	},
	sheetButtonText: {
		textAlign: "center",
		color: "white",
		fontSize: 16,
		opacity: 0.7,
	},
	sheetLinkContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginTop: 0,
		marginBottom: 20,
	},
	sheetLink: {
		color: "white",
		fontSize: 16,
		opacity: 0.4,
	},
	sheetDescriptionContainer: {
		marginTop: 10,
		marginBottom: 20,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		width: "90%",
	},
	sheetInfo: {
		color: "white",
		fontSize: 16,
		opacity: 0.7,
		marginBottom: 10,
	},
	sheetDate: {
		color: "white",
		fontSize: 16,
		opacity: 0.1,
		fontWeight: "400",
		lineHeight: 24,
	},
	sheetStatusContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "90%",
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
		alignItems: "center",
	},
	sheetTopicButton: {
		height: 34,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 11,
		backgroundColor: "rgba(31, 34, 41, 255)",
		borderRadius: 7,
	},
	sheetHeartIconContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	sheetLearningButton: {
		borderRadius: 7,
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		paddingVertical: 8,
		paddingHorizontal: 10,
		width: 110,
		display: "flex",
		flexDirection: "row",
		alignItems: "flex-start",
	},
	sheetLearningText: {
		color: "rgba(255, 255, 255, 0.5)",
		paddingLeft: 5,
		marginRight: 6,
		alignItems: "center",
	},
	sheetLearningButtonsDropdown: {
		position: "absolute",
		top: 27,
		left: 0,
		right: 0,
		paddingVertical: 2,
		borderRadius: 7,
	},
	sheetAnotherLearningButton: {
		borderRadius: 7,
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		paddingVertical: 8,
		width: 105,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	sheetNoteContainer: {
		width,
		display: "flex",
		flexDirection: "row",
		paddingTop: 12,
		paddingBottom: 12,
	},
	noteText: {
		display: "flex",
		flexDirection: "row",
		flex: 1,
	},
	sheetNoteText: {
		color: "white",
		fontSize: 16,
		opacity: 0.2,
		marginLeft: 5,
	},
	addLinkButton: {
		position: "absolute",
		bottom: 50,
		alignSelf: "center",
		justifyContent: "center",
		paddingVertical: 8,
		paddingHorizontal: 11,
		backgroundColor: "#232323",
		borderRadius: 7,
	},
})
