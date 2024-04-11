import React, { useState, useRef, useEffect, useMemo } from "react"
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
} from "react-native"
import Svg, { G, Path } from "react-native-svg"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import DraggableFlatList from "react-native-draggable-flatlist"
// import * as gql from "../../../shared/graphql_react"

const { width } = Dimensions.get("window")

type ProfileData = {
	links: { title: string; url: string; topic: string; id: string }[]
	showLinksStatus: "Learning" | "To Learn" | "Learned"
	filterOrder: "Custom" | "RecentlyAdded"
	filter: "Liked" | "None" | "Topic"
	filterTopic?: string // used when filter is set to "Topic"
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
	linkToEdit?: string // TODO: id of link? how to know what link is opened for editing
	searchQuery?: string // what is typed in the search input on bottom
}

export default function Home() {
	// const gqlData = gql.useResource(gql.query_mobileIndex, {})
	// console.log(gqlData, "gql data")

	const [data, setData] = useState<ProfileData>({
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
	const [showLearningButtons, setShowLearningButtons] = useState(false)
	const [animationButtons, setAnimationButtons] = useState<Animated.Value[]>([])
	const [learningStatus, setLearningStatus] = useState("Learning")

	// bottomsheets
	const [filterTitle, setFilterTitle] = useState("Filters")
	const [likedSelected, setLikedSelected] = useState(false)

	const topicRef = useRef<BottomSheet>(null)
	const filterRef = useRef<BottomSheet>(null)
	const snapFilterPoints = useMemo(() => ["23%"], [])
	const snapTopicPoints = useMemo(() => ["45%"], [])
	const [topicSheetIndex, setTopicSheetIndex] = useState(-1)
	const [filterBottomSheetIndex, setFilterBottomSheetIndex] = useState(-1)

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

	const openTopicSheet = () => {
		setTopicSheetIndex(0)
		filterRef.current?.close()
	}
	const openFilterSheet = () => {
		setFilterBottomSheetIndex(0)
		topicRef.current?.close()
	}

	useEffect(() => {
		setAnimationButtons([new Animated.Value(0), new Animated.Value(0)])
	}, [])

	const showButtons = (nextStatus?: string) => {
		setShowLearningButtons(!showLearningButtons)

		if (nextStatus) {
			setLearningStatus(nextStatus)
		}

		const animationsEnd = showLearningButtons ? 0 : 1
		const staggeredAnimations = animationButtons.map((button) =>
			Animated.timing(button, {
				toValue: animationsEnd,
				duration: 300,
				useNativeDriver: true,
			}),
		)

		Animated.parallel(staggeredAnimations).start()
	}

	const [selectedItem, setSelectedItem] = useState<{
		title: string
		topic: string
		url: string
		id: string
	} | null>(null)

	const handleLikedPress = () => {
		setFilterTitle("Filters 1")
		setLikedSelected(true)
	}

	const getLinkIcon = (url: string) => {
		return require("../../assets/favicon.png")
	}

	const ArrowIcon = () => (
		<Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
			<Path
				d="M12.613 4.79031C12.9303 4.48656 13.4447 4.48656 13.762 4.79031C14.0793 5.09405 14.0793 5.58651 13.762 5.89025L8.07452 11.3347C7.75722 11.6384 7.24278 11.6384 6.92548 11.3347L1.23798 5.89025C0.920674 5.58651 0.920674 5.09405 1.23798 4.79031C1.55528 4.48656 2.06972 4.48656 2.38702 4.79031L7.5 9.68478L12.613 4.79031Z"
				fill="grey"
			/>
		</Svg>
	)

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
				style={{ marginLeft: 20, opacity: 0.2, width: 20, height: 20 }}
				onPress={() => Linking.openURL(item.url)}
			>
				<Svg height="100" width="100" viewBox="0 0 100 100">
					<Path
						d="M12.6592 7.18364C12.9846 7.50908 12.9838 8.03753 12.6619 8.35944L7.94245 13.0789C7.61851 13.4028 7.09435 13.4039 6.76665 13.0762C6.44121 12.7508 6.44203 12.2223 6.76393 11.9004L11.4834 7.18093C11.8073 6.85699 12.3315 6.85593 12.6592 7.18364ZM6.76666 16.6117C5.79136 17.587 4.20579 17.5864 3.23111 16.6117C2.25561 15.6362 2.25611 14.0512 3.23112 13.0762L5.58813 10.7192C5.91357 10.3937 5.91357 9.8661 5.58813 9.54066C5.2627 9.21522 4.73506 9.21522 4.40962 9.54066L2.05261 11.8977C0.426886 13.5234 0.426063 16.1637 2.0526 17.7902C3.67795 19.4156 6.31879 19.4166 7.94517 17.7902L10.3022 15.4332C10.6276 15.1078 10.6276 14.5801 10.3022 14.2547C9.97674 13.9293 9.44911 13.9293 9.12367 14.2547L6.76666 16.6117ZM17.3732 8.36216C18.9996 6.73578 18.9986 4.09494 17.3732 2.46959C15.7467 0.843055 13.1064 0.843878 11.4807 2.46961L9.12367 4.82662C8.79823 5.15205 8.79823 5.67969 9.12367 6.00513C9.44911 6.33056 9.97674 6.33056 10.3022 6.00513L12.6592 3.64812C13.6342 2.6731 15.2192 2.6726 16.1947 3.6481C17.1694 4.62278 17.17 6.20835 16.1947 7.18365L13.8377 9.54066C13.5123 9.8661 13.5123 10.3937 13.8377 10.7192C14.1631 11.0446 14.6908 11.0446 15.0162 10.7192L17.3732 8.36216Z"
						fill-rule="evenodd"
						fill="grey"
						strokeWidth="2"
					/>
				</Svg>
			</TouchableOpacity>
		</TouchableOpacity>
	)

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
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
								selectedTab === "topics"
									? styles.selectedTab
									: styles.unselectedTab,
							]}
							onPress={() => setSelectedTab("topics")}
						>
							<Text style={styles.tabText}>Topics</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.optionsContainer}>
						<View style={styles.learningButtonsContainer}>
							<TouchableOpacity
								style={styles.learningButton}
								onPress={() => showButtons()}
							>
								<Text style={styles.learningText}>{learningStatus}</Text>
								<ArrowIcon />
							</TouchableOpacity>
							{["Learning", "Learned", "To Learn"]
								.filter((s) => s !== learningStatus)
								.map((status, index) =>
									animationButtons[index] ? (
										<Animated.View
											key={index}
											style={[
												styles.learningButtonsDropdown,
												{
													opacity: animationButtons[index],
													transform: [
														{
															scale: animationButtons[index].interpolate({
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
												style={styles.anotherLearningButton}
												onPress={() => showButtons(status)}
											>
												<Text style={[styles.learningText, { lineHeight: 20 }]}>
													{status}
												</Text>
											</TouchableOpacity>
										</Animated.View>
									) : null,
								)}
						</View>
						<TouchableOpacity onPress={openFilterSheet}>
							<Svg height="30" width="30" viewBox="0 0 30 30">
								<Path
									d="M10.6087 12.3272C10.8248 12.4993 11 12.861 11 13.1393V18.8843L13 17.8018V13.1338C13 12.8604 13.173 12.501 13.3913 12.3272L17.5707 9H6.42931L10.6087 12.3272ZM20 7L20 4.99791L4.00001 5L4.00003 7H20ZM15 18.0027C15 18.5535 14.6063 19.2126 14.1211 19.4747L10.7597 21.2904C9.78783 21.8154 9 21.3499 9 20.2429V13.6L2.78468 8.62775C2.35131 8.28105 2 7.54902 2 6.99573V4.99791C2 3.8945 2.89821 3 4.00001 3H20C21.1046 3 22 3.89826 22 4.99791V6.99573C22 7.55037 21.65 8.28003 21.2153 8.62775L15 13.6V18.0027Z"
									fill="grey"
									strokeWidth="2"
								/>
							</Svg>
						</TouchableOpacity>
					</View>
				</View>
				<DraggableFlatList
					data={data.links}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					onDragEnd={({ data }) =>
						setData((prevState) => ({ ...prevState, links: data }))
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
				}}
				enablePanDownToClose={true}
				enableContentPanningGesture={true}
				enableHandlePanningGesture={true}
				backgroundStyle={{ backgroundColor: "#171A21", borderRadius: 10 }}
			>
				<BottomSheetView style={styles.filterSheetContainer}>
					<View style={{ alignSelf: "flex-start" }}>
						<Text style={styles.filterSheetTitle}>{filterTitle}</Text>
					</View>
					<View
						style={
							likedSelected
								? styles.filterSheetView
								: [styles.filterSheetView, styles.filterBorder]
						}
					>
						<TouchableOpacity
							onPress={handleLikedPress}
							style={likedSelected ? styles.likedButtonSelected : {}}
						>
							<Text style={styles.filterSheetText}>Liked</Text>
							{likedSelected && (
								<Svg
									style={{ marginLeft: 10 }}
									width="15"
									height="16"
									viewBox="0 0 15 16"
									fill="none"
								>
									<G opacity="0.4">
										<Path
											d="M12.3169 4.06695C12.561 3.82288 12.561 3.42715 12.3169 3.18307C12.0729 2.93898 11.6771 2.93898 11.4331 3.18305L7.5 7.11598L3.56693 3.18305C3.32285 2.93898 2.92712 2.93898 2.68305 3.18307C2.43898 3.42715 2.43898 3.82288 2.68307 4.06695L6.6161 7.99985L2.68307 11.9327C2.43898 12.1768 2.43898 12.5725 2.68305 12.8166C2.92712 13.0607 3.32285 13.0607 3.56693 12.8166L7.5 8.88372L11.4331 12.8166C11.6771 13.0607 12.0729 13.0607 12.3169 12.8166C12.561 12.5725 12.561 12.1768 12.3169 11.9327L8.3839 7.99985L12.3169 4.06695Z"
											fill="white"
										/>
									</G>
								</Svg>
							)}
						</TouchableOpacity>
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
							<Text style={styles.filterSheetText}>Choose topic</Text>
							<TouchableOpacity style={{ opacity: 0.5, width: 15, height: 15 }}>
								<Svg height="100" width="100" viewBox="0 0 100 100">
									<Path
										d="M4.29031 2.38702C3.98656 2.06972 3.98656 1.55528 4.29031 1.23798C4.59405 0.920675 5.08651 0.920675 5.39025 1.23798L10.8347 6.92548C11.1384 7.24278 11.1384 7.75722 10.8347 8.07452L5.39025 13.762C5.08651 14.0793 4.59405 14.0793 4.29031 13.762C3.98656 13.4447 3.98656 12.9303 4.29031 12.613L9.18478 7.5L4.29031 2.38702Z"
										fill="white"
										strokeWidth="2"
									/>
								</Svg>
							</TouchableOpacity>
						</View>
					</View>
				</BottomSheetView>
			</BottomSheet>
			{/* topic bottomsheet */}
			<BottomSheet
				ref={topicRef}
				index={topicSheetIndex}
				snapPoints={snapTopicPoints}
				onChange={(index) => setTopicSheetIndex(index)}
				enablePanDownToClose={true}
				enableContentPanningGesture={true}
				enableHandlePanningGesture={true}
				backgroundStyle={{ backgroundColor: "#171A21", borderRadius: 10 }}
			>
				<BottomSheetView style={{ alignItems: "center" }}>
					{selectedItem && (
						<View>
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
								<TouchableOpacity
									style={{ width: 20, height: 20, marginRight: 5 }}
								>
									<Svg height="100" width="100" viewBox="0 0 100 100">
										<Path
											d="M12.6592 7.18364C12.9846 7.50908 12.9838 8.03753 12.6619 8.35944L7.94245 13.0789C7.61851 13.4028 7.09435 13.4039 6.76665 13.0762C6.44121 12.7508 6.44203 12.2223 6.76393 11.9004L11.4834 7.18093C11.8073 6.85699 12.3315 6.85593 12.6592 7.18364ZM6.76666 16.6117C5.79136 17.587 4.20579 17.5864 3.23111 16.6117C2.25561 15.6362 2.25611 14.0512 3.23112 13.0762L5.58813 10.7192C5.91357 10.3937 5.91357 9.8661 5.58813 9.54066C5.2627 9.21522 4.73506 9.21522 4.40962 9.54066L2.05261 11.8977C0.426886 13.5234 0.426063 16.1637 2.0526 17.7902C3.67795 19.4156 6.31879 19.4166 7.94517 17.7902L10.3022 15.4332C10.6276 15.1078 10.6276 14.5801 10.3022 14.2547C9.97674 13.9293 9.44911 13.9293 9.12367 14.2547L6.76666 16.6117ZM17.3732 8.36216C18.9996 6.73578 18.9986 4.09494 17.3732 2.46959C15.7467 0.843055 13.1064 0.843878 11.4807 2.46961L9.12367 4.82662C8.79823 5.15205 8.79823 5.67969 9.12367 6.00513C9.44911 6.33056 9.97674 6.33056 10.3022 6.00513L12.6592 3.64812C13.6342 2.6731 15.2192 2.6726 16.1947 3.6481C17.1694 4.62278 17.17 6.20835 16.1947 7.18365L13.8377 9.54066C13.5123 9.8661 13.5123 10.3937 13.8377 10.7192C14.1631 11.0446 14.6908 11.0446 15.0162 10.7192L17.3732 8.36216Z"
											fill-rule="evenodd"
											fill="grey"
											strokeWidth="2"
										/>
									</Svg>
								</TouchableOpacity>
								<Text style={styles.sheetLink}>{selectedItem.url}</Text>
							</View>

							<View style={styles.sheetDescriptionContainer}>
								<Text style={styles.sheetInfo}>
									The installation of Nix on macOS Catalina has faced challenges
									due to the root file system becoming read-only
								</Text>
								<Text style={styles.sheetDate}>2023 · Added: Mar 20, 2024</Text>
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
											width: 20,
											height: 20,
										}}
									>
										<Svg height="100" width="100" viewBox="0 0 100 100">
											<Path
												d="M2 6C2 9.12421 5.06067 12.9005 10.0057 16.1333C14.9507 12.9005 18 9.20454 18 6C18 3.79086 16.2091 2 14 2C13.0005 2 12.0631 2.36538 11.3338 3.01806L10.3715 3.87932C10.1663 4.06298 9.83645 4.06548 9.62845 3.87932L8.66617 3.01806C7.93694 2.36538 6.99954 2 6 2C3.79086 2 2 3.79086 2 6ZM10 1.52779C11.0615 0.577707 12.4633 0 14 0C17.3137 0 20 2.68629 20 6C20 10.8362 14.994 15.5 10.4246 18.2363C10.1924 18.3809 9.81121 18.3828 9.57832 18.2383C4.97858 15.511 0 10.8365 0 6C0 2.68629 2.68629 0 6 0C7.53671 0 8.93849 0.577707 10 1.52779Z"
												fill="white"
												strokeWidth="2"
											/>
										</Svg>
									</TouchableOpacity>
									<View
										style={{
											position: "relative",
											flexDirection: "column",
											alignItems: "center",
										}}
									>
										<TouchableOpacity
											style={[styles.sheetLearningButton, { paddingLeft: 15 }]}
											onPress={() => showSheetButtons()}
										>
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
					)}
					<View style={styles.sheetNoteContainer}>
						<View style={styles.noteText}>
							<TouchableOpacity
								style={{ marginLeft: 20, width: 20, height: 20, opacity: 0.3 }}
							>
								<Svg height="100" width="100" viewBox="0 0 100 100">
									<Path
										d="M3.33408 14.2927L3.33532 15.0743C3.77266 14.9243 4.27659 15.0239 4.62554 15.3728C4.976 15.7233 5.07486 16.2301 4.92209 16.6687L5.69561 16.6707L6.98804 15.3783L4.61936 13.0096C3.84148 13.7862 3.33408 14.2927 3.33408 14.2927ZM12.6425 5.00085L15.0051 7.3612L8.16655 14.1998L5.79887 11.8321C8.55649 9.07914 12.6425 5.00085 12.6425 5.00085ZM15.4877 2.15567L17.8492 4.51715C18.5 5.16802 18.5008 6.22251 17.8503 6.87304L6.68573 18.0376C6.5235 18.1998 6.20677 18.3313 5.97268 18.3313H2.50085C2.04032 18.3313 1.66699 17.9606 1.66699 17.4976V14.0262C1.66699 13.7946 1.80042 13.4736 1.96088 13.3133L13.1312 2.154C13.7818 1.50405 14.8367 1.5047 15.4877 2.15567Z"
										fill="grey"
										strokeWidth="2"
									/>
								</Svg>
							</TouchableOpacity>
							<TextInput
								style={styles.sheetNoteText}
								value={selectedItem ? noteText[selectedItem.id] || "" : ""}
								placeholder="Take a note..."
								placeholderTextColor="rgba(255, 255, 255, 0.9)"
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
				</BottomSheetView>
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
	tabContainer: {
		flexDirection: "row",
		overflow: "hidden",
		backgroundColor: "#222222",
		borderRadius: 10,
		width: 150,
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
		backgroundColor: "rgba(50, 50, 50, 0.2)",
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
