import React, { useState, useRef, useEffect, useMemo } from "react"
import * as gql from "../../graphql_react"
import {
	View,
	StyleSheet,
	Dimensions,
	Animated,
	Linking,
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
// import {
// 	PanGestureHandler,
// 	State,
// 	HandlerStateChangeEvent,
// 	PanGestureHandlerEventPayload,
// } from "react-native-gesture-handler"

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import DraggableFlatList from "react-native-draggable-flatlist"
import { AntDesign } from "@expo/vector-icons"
import {
	ArrowIcon,
	LinkIcon,
	FilterIcon,
	FilterActiveIcon,
	CrossIcon,
	LeftArrowIcon,
	HeartIcon,
	NoteIcon,
} from "../../assets/svg/icons"

const { width } = Dimensions.get("window")

type ProfileData = {
	links: { title: string; url: string; topic: string; id: string }[]
	showLinksStatus: "Learning" | "To Learn" | "Learned"
	filterOrder: "Custom" | "RecentlyAdded"
	filter: "Liked" | "None" | "Topic"
	filterTopic?: string
	userTopics: string[]
	user: {
		email: string
		name: string
	}
	editingLink?: {
		title: string
		url: string
		description?: string
		status?: "Learning" | "To Learn" | "Learned"
		topic?: string
		note?: string
		year?: number
		addedAt?: string
	}
	linkToEdit?: string
	searchQuery?: string
}

export default function Home() {
	const data = gql.useResource(gql.query_mobileIndex, {})
	console.log(data, "data back")
	const [local, setLocal] = useState<ProfileData>({
		links: [
			{
				id: "1",
				title: "Modern JavaScript Tutorial",
				topic: "Solid",
				url: "https://solidjs.com",
			},
			{
				id: "2",
				title: "Learn Kubernetes with Google",
				topic: "GraphQL",
				url: "https://graphql.org",
			},
			{
				id: "3",
				title: "Everything New in Figma",
				topic: "Figma",
				url: "https://figma.com",
			},
		],
		showLinksStatus: "Learning",
		filterOrder: "Custom",
		filter: "None",
		userTopics: ["Solid", "GraphQL", "Figma"],
		user: {
			email: "github@nikiv.dev",
			name: "Nikita",
		},
	})

	const [selectedTab, setSelectedTab] = useState("links")
	const [noteText, setNoteText] = useState<{ [key: string]: string }>({})
	const [animationButtons, setAnimationButtons] = useState<Animated.Value[]>([])
	const [searchTopicInputFocused, setSearchTopicInputFocused] = useState(false)
	const [takeNoteInputFocused, setTakeNoteInputFocused] = useState(false)

	// bottomsheets
	const [filterTitle, setFilterTitle] = useState("Filters")
	const [likedSelected, setLikedSelected] = useState(false)
	const [topicClicked, setTopicClicked] = useState(false)
	const topicRef = useRef<BottomSheet>(null)
	const filterRef = useRef<BottomSheet>(null)
	const [topicSheetIndex, setTopicSheetIndex] = useState(-1)
	const [filterBottomSheetIndex, setFilterBottomSheetIndex] = useState(-1)
	const [firstNoteSentence, setFirstNoteSentence] = useState("")

	//bottomsheet learning button
	const [showSheetLearningButtons, setShowSheetLearningButtons] =
		useState(false)
	const [sheetAnimationButtons, setSheetAnimationButtons] = useState<
		Animated.Value[]
	>([])
	const [sheetLearningStatus, setSheetLearningStatus] = useState("Learning")

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

	const snapFilterPoints = useMemo(() => {
		return topicClicked ? ["90%"] : ["20%"]
	}, [topicClicked])

	const snapTopicPoints = useMemo(() => {
		return takeNoteInputFocused ? ["90%"] : ["45%"]
	}, [takeNoteInputFocused])

	useEffect(() => {
		if (topicSheetIndex === 0) {
			setTakeNoteInputFocused(false)
		}
	}, [topicSheetIndex])

	const openTopicSheet = () => {
		setTopicSheetIndex(0)
		filterRef.current?.close()
	}

	const openFilterSheet = () => {
		setFilterBottomSheetIndex(0)
		setTopicClicked(false)
		topicRef.current?.close()
	}

	function formatText(text: string, maxLength: number = 30): string {
		return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
	}

	useEffect(() => {
		setAnimationButtons([new Animated.Value(0), new Animated.Value(0)])
	}, [])

	const [selectedItem, setSelectedItem] = useState<{
		title: string
		topic: string
		url: string
		id: string
	} | null>(null)

	const handleLikedPress = () => {
		setFilterTitle((currentTitle) =>
			currentTitle === "Filters" ? "Filters 1" : "Filters",
		)
		setLikedSelected((currentValue) => !currentValue)
	}

	const getLinkIcon = (url: string) => {
		return require("../../assets/favicon.png")
	}

	const renderItem = ({
		item,
		drag,
		isActive,
	}: {
		item: { title: string; topic: string; url: string; id: string }
		drag: any
		isActive: boolean
	}) => (
		<TouchableOpacity
			style={styles.itemContainer}
			onLongPress={drag}
			disabled={isActive}
			onPress={() => {
				setSelectedItem(item)
				openTopicSheet()
			}}
		>
			<Image source={getLinkIcon(item.url)} style={styles.itemImage} />
			<Text style={styles.itemTitle}>{item.title}</Text>
			<TouchableOpacity
				style={{ marginLeft: 20, opacity: 0.2 }}
				onPress={() => Linking.openURL(item.url)}
			>
				<LinkIcon />
			</TouchableOpacity>
		</TouchableOpacity>
	)
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<View style={styles.parentContainer}>
						<View style={styles.tabContainer}>
							<TouchableOpacity
								style={[
									styles.tab,
									selectedTab === "links"
										? styles.selectedTab
										: styles.unselectedTab,
								]}
								onPress={() => setSelectedTab("links")}
							>
								<Text style={styles.tabText}>Links</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.tab,
									selectedTab === "pages"
										? styles.selectedTab
										: styles.unselectedTab,
								]}
								onPress={() => setSelectedTab("pages")}
							>
								<Text style={styles.tabText}>Pages</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.tab,
									selectedTab === "topics"
										? styles.selectedTab
										: styles.unselectedTab,
								]}
								onPress={() => setSelectedTab("topics")}
							>
								<Text style={styles.tabText}>Topics</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.optionsContainer}>
						<TouchableOpacity
							onPress={openFilterSheet}
							style={{ padding: 3, position: "relative" }}
						>
							<View style={{ position: "relative", height: 30, width: 30 }}>
								<FilterIcon />
								{likedSelected && <FilterActiveIcon />}
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<DraggableFlatList
					data={local.links}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					onDragEnd={({ data }) =>
						setLocal((prevState) => ({ ...prevState, links: data }))
					}
					style={styles.list}
				/>
			</SafeAreaView>
			{/* filter bottomsheet  */}
			<BottomSheet
				ref={filterRef}
				index={filterBottomSheetIndex}
				snapPoints={snapFilterPoints}
				onChange={(index) => {
					setFilterBottomSheetIndex(index)
					if (index === -1) Keyboard.dismiss()
				}}
				enablePanDownToClose={true}
				enableContentPanningGesture={true}
				enableHandlePanningGesture={true}
				backgroundStyle={{ backgroundColor: "#171A21", borderRadius: 10 }}
			>
				<BottomSheetView style={styles.filterSheetContainer}>
					<View style={{ alignSelf: "flex-start" }}>
						{!topicClicked && (
							<Text style={styles.filterSheetTitle}>{filterTitle}</Text>
						)}
					</View>
					<View
						style={
							likedSelected
								? styles.filterSheetView
								: topicClicked
									? [styles.filterActiveSearch, styles.filterBorder]
									: [styles.filterSheetView, styles.filterBorder]
						}
					>
						{!topicClicked && (
							<TouchableOpacity
								onPress={() => {
									handleLikedPress()
									filterRef.current?.close()
								}}
								style={likedSelected ? styles.likedButtonSelected : {}}
							>
								<Text style={styles.filterSheetText}>Liked</Text>
								{likedSelected && <CrossIcon />}
							</TouchableOpacity>
						)}
						<View
							style={
								likedSelected
									? [
											styles.filterChooseTopic,
											{
												marginTop: 10,
												paddingRight: 5,
												backgroundColor: "#1d1f26",
												borderRadius: 7,
												borderColor: "rgba(55, 55, 55, 0.16)",
												borderWidth: 1,
											},
										]
									: styles.filterChooseTopic
							}
						>
							{!topicClicked ? (
								<View
									style={{
										width: "100%",
										alignItems: "center",
										flexDirection: "row",
										justifyContent: "space-between",
									}}
								>
									<TouchableOpacity onPress={() => setTopicClicked(true)}>
										<Text style={styles.filterSheetText}>Choose topic</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={{ opacity: 0.5 }}
										onPress={() => setTopicClicked(true)}
									>
										<LeftArrowIcon />
									</TouchableOpacity>
								</View>
							) : (
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										width: "100%",
										height: 35,
									}}
								>
									<TouchableOpacity
										style={{
											justifyContent: "center",
											position: "absolute",
											left: 5,
											top: "50%",
											transform: [{ translateY: -9 }],
										}}
									>
										<AntDesign
											name="search1"
											size={15}
											color="rgba(255, 255, 255, 0.4)"
										/>
									</TouchableOpacity>
									<TouchableWithoutFeedback
										onPress={Keyboard.dismiss}
										accessible={false}
									>
										<TextInput
											style={
												(styles.filterSheetText,
												{ paddingLeft: 30, color: "white", fontSize: 16 })
											}
											placeholder="Search topic"
											placeholderTextColor={"rgba(255, 255, 255, 0.4)"}
											autoFocus={false}
											onPressIn={() => setSearchTopicInputFocused(true)}
											onBlur={() => setSearchTopicInputFocused(false)}
										/>
									</TouchableWithoutFeedback>
								</View>
							)}
						</View>
					</View>
				</BottomSheetView>
			</BottomSheet>
			{/* topic bottomsheet */}
			<BottomSheet
				ref={topicRef}
				index={topicSheetIndex}
				snapPoints={snapTopicPoints}
				onChange={(index) => {
					setTopicSheetIndex(index)
					if (index === -1) Keyboard.dismiss()
				}}
				onClose={() => Keyboard.dismiss()}
				enablePanDownToClose={true}
				enableContentPanningGesture={true}
				enableHandlePanningGesture={true}
				backgroundStyle={{ backgroundColor: "#171A21", borderRadius: 10 }}
			>
				{selectedItem ? (
					<BottomSheetView style={{ alignItems: "center" }}>
						{takeNoteInputFocused ? (
							<View style={styles.sheetNoteContainer}>
								<View style={styles.noteText}>
									<TouchableOpacity style={{ marginLeft: 20, opacity: 0.3 }}>
										<NoteIcon />
									</TouchableOpacity>
									<KeyboardAwareScrollView
										contentContainerStyle={{
											height: Dimensions.get("window").height / 2,
										}}
									>
										<TextInput
											style={[
												styles.sheetNoteTextFocused,
												{ height: Dimensions.get("window").height / 2 },
											]}
											value={
												selectedItem ? noteText[selectedItem.id] || "" : ""
											}
											placeholder="Take a note..."
											autoFocus={true}
											multiline={true}
											placeholderTextColor="rgba(255, 255, 255, 0.3)"
											onFocus={() => setTakeNoteInputFocused(true)}
											onBlur={() => setTakeNoteInputFocused(false)}
											onChangeText={(text) => {
												setFirstNoteSentence(text.split("\n")[0])
												if (selectedItem) {
													setNoteText((notes) => ({
														...notes,
														[selectedItem.id]: text,
													}))
												}
											}}
										/>
									</KeyboardAwareScrollView>
								</View>
							</View>
						) : (
							<>
								<View style={styles.sheetTitleContainer}>
									<View style={styles.titleContainer}>
										<Image
											source={getLinkIcon(selectedItem.url)}
											style={styles.itemImage}
										/>
										<Text
											style={{
												color: "white",
												fontSize: 16,
												fontWeight: "500",
												marginLeft: 8,
											}}
										>
											{selectedItem.title}
										</Text>
									</View>
									<TouchableOpacity style={styles.sheetButton}>
										<Text style={styles.sheetButtonText}>Open</Text>
									</TouchableOpacity>
								</View>
								<View style={styles.sheetLinkContainer}>
									<TouchableOpacity style={{ marginRight: 5 }}>
										<LinkIcon />
									</TouchableOpacity>
									<Text style={styles.sheetLink}>{selectedItem.url}</Text>
								</View>
								<View style={styles.sheetDescriptionContainer}>
									<Text style={styles.sheetInfo}>
										The installation of Nix on macOS Catalina has faced
										challenges due to the root file system becoming read-only
									</Text>
									<Text style={styles.sheetDate}>
										2023 · Added: Mar 20, 2024
									</Text>
								</View>
								<View style={styles.sheetStatusContainer}>
									<TouchableOpacity style={styles.sheetTopicButton}>
										<Text style={styles.sheetButtonText}>
											{selectedItem.topic}
										</Text>
									</TouchableOpacity>
									<View style={styles.sheetHeartIconContainer}>
										<TouchableOpacity
											style={{
												marginRight: 10,
												opacity: 0.4,
											}}
										>
											<HeartIcon />
										</TouchableOpacity>
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
													{ paddingLeft: 15 },
												]}
												onPress={() => showSheetButtons()}
											>
												<Text style={styles.sheetLearningText}>
													{sheetLearningStatus}
												</Text>
												<ArrowIcon />
											</TouchableOpacity>
										</View>
									</View>
								</View>
								<View style={styles.sheetNoteContainer}>
									<View style={styles.noteText}>
										<TouchableOpacity style={{ marginLeft: 20, opacity: 0.3 }}>
											<NoteIcon />
										</TouchableOpacity>
										<TextInput
											style={styles.sheetNoteText}
											value={
												selectedItem ? noteText[selectedItem.id] || "" : ""
											}
											placeholder={firstNoteSentence || "Take a note..."}
											multiline={true}
											placeholderTextColor="rgba(255, 255, 255, 0.9)"
											autoFocus={false}
											onFocus={() => setTakeNoteInputFocused(true)}
											onBlur={() => setTakeNoteInputFocused(false)}
											onChangeText={(text) => {
												if (selectedItem) {
													setNoteText((notes) => ({
														...notes,
														[selectedItem.id]: text,
													}))
												}
											}}
										/>
									</View>
								</View>
							</>
						)}
					</BottomSheetView>
				) : null}
			</BottomSheet>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#0F0F0F",
		flex: 1,
		margin: "auto",
		alignItems: "center",
		width,
	},
	header: {
		marginVertical: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "90%",
		zIndex: 20,
	},
	parentContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	tabContainer: {
		flexDirection: "row",
		overflow: "hidden",
		backgroundColor: "#222222",
		borderRadius: 10,
		width: 206,
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
		color: "white",
		opacity: 0.7,
	},
	optionsContainer: {
		flexDirection: "row",
	},
	learningButtonsContainer: {
		flexDirection: "column",
		position: "relative",
	},
	learningButton: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: "#232323",
		borderRadius: 7,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		marginRight: 8,
	},
	learningText: {
		color: "white",
		opacity: 0.7,
		paddingRight: 5,
	},
	twoButtons: {
		flexDirection: "column",
	},
	learningButtonsDropdown: {
		position: "absolute",
		zIndex: 10,
		top: 27,
		left: 0,
		right: 0,
		paddingVertical: 5,
		borderRadius: 7,
	},
	anotherLearningButton: {
		borderRadius: 7,
		backgroundColor: "rgba(50, 50, 50, 0.5)",
		opacity: 0.8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		maxHeight: 34,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 10,
		marginRight: 8,
	},
	list: {
		flex: 1,
		margin: "auto",
		width: "95%",
		zIndex: 0,
	},
	itemContainer: {
		padding: 8,
		marginHorizontal: 5,
		flexDirection: "row",
		backgroundColor: "#121212",
		borderRadius: 8,
		marginBottom: 2,
		justifyContent: "space-between",
		alignItems: "center",
		height: 40,
	},
	itemImage: {
		width: 16,
		height: 16,
		marginRight: 4,
	},
	itemTitle: {
		color: "white",
		fontSize: 16,
		fontWeight: "500",
		width: 280, // ?
	},
	// topic bottomsheet

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
		width: 105,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginRight: 8,
	},
	sheetLearningText: {
		color: "#D29752",
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
		minHeight: 20,
	},
	sheetNoteTextFocused: {
		color: "white",
		fontSize: 16,
		opacity: 0.8,
		marginLeft: 5,
		minHeight: 20,
		paddingBottom: 60,
	},

	// filter bottomsheet

	filterSheetContainer: {
		alignItems: "center",
	},
	filterSheetTitle: {
		color: "white",
		fontSize: 16,
		opacity: 0.7,
		marginLeft: 10,
		marginBottom: 13,
	},
	filterSheetView: {
		height: 82,
		flexDirection: "column",
		alignItems: "flex-start",
	},
	filterActiveSearch: {
		height: 35,
		flexDirection: "column",
		alignItems: "flex-start",
	},

	filterBorder: {
		backgroundColor: "#1d1f26",
		borderRadius: 7,
		borderColor: "rgba(55, 55, 55, 0.16)",
		borderWidth: 1,
		width: "95%",
	},
	filterChooseTopic: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		alignSelf: "flex-start",
		width: "95%",
	},
	filterSheetText: {
		color: "white",
		fontSize: 16,
		fontWeight: "300",
		opacity: 0.7,
		marginLeft: 10,
		marginVertical: 8,
	},
	likedButtonSelected: {
		backgroundColor: "rgba(255, 255, 255, 0.04)",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 7,
		paddingHorizontal: 8,
	},
})
