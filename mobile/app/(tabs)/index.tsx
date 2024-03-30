import React, { useState, useRef } from "react"
import {
	View,
	FlatList,
	Text,
	TouchableOpacity,
	Image,
	StyleSheet,
	Dimensions,
} from "react-native"
import DraggableFlatList from "react-native-draggable-flatlist"
import Svg, { Path } from "react-native-svg"
import { Octicons, Ionicons, AntDesign } from "@expo/vector-icons"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { BlurView } from "@react-native-community/blur"
import icon from "../../assets/favicon.png"

const { width } = Dimensions.get("window")

type ProfileData = {
	links: { title: string; url: string; id: string }[]
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
	const [selectedTab, setSelectedTab] = useState("links")
	const [isBottomSheetVisible, setBottomSheetVisible] = useState(false)
	const bottomSheetRef = useRef(null)
	const [data, setData] = useState<ProfileData>({
		links: [
			{ id: "1", title: "Solid", url: "https://solidjs.com" },
			{ id: "2", title: "GraphQL", url: "https://graphql.org" },
			{ id: "3", title: "Figma", url: "https://figma.com" },
			{ id: "4", title: "Solid", url: "https://solidjs.com" },
			{ id: "5", title: "Solid", url: "https://solidjs.com" },
			{ id: "6", title: "Figma", url: "https://figma.com" },
			{ id: "7", title: "GraphQL", url: "https://graphql.org" },
			{ id: "8", title: "Solid", url: "https://solidjs.com" },
		],
		showLinksStatus: "Learning",
		filterOrder: "Custom",
		filter: "None",
		userTopics: ["Solid", "GraphQL"],
		user: {
			email: "github@nikiv.dev",
			name: "Nikita",
		},
	})
	const [selectedItem, setSelectedItem] = useState<{
		title: string
		url: string
		id: string
	} | null>(null)

	const getLinkIcon = (url: string) => {
		if (url.includes("solidjs")) {
			return icon
		} else {
			return icon
		}
	}

	// 	const renderItem = ({ item, drag }: { item: { title: string; url: string; id: string }, drag: () => void }) => (
	// 	<TouchableOpacity
	// 			style={styles.itemContainer}
	// 			onPress={() => {
	// 					setSelectedItem(item);
	// 					setBottomSheetVisible(true);
	// 			}}
	// 			onLongPress={drag}
	// 	>
	// 			<Image source={getLinkIcon(item.url)} style={styles.itemImage} />
	// 			<Text style={styles.itemTitle}>{item.title}</Text>
	// 			<TouchableOpacity style={{ marginLeft: 20 }}>
	// 					<LinkIcon />
	// 			</TouchableOpacity>
	// 	</TouchableOpacity>
	// );

	// const onDragEnd = ({ data }: { data: { title: string; url: string; id: string }[] }) => {
	// 	setData((prevData) => ({
	// 			...prevData,
	// 			links: data,
	// 	}));
	// };

	const renderItem = ({
		item,
	}: {
		item: { title: string; url: string; id: string }
	}) => (
		<TouchableOpacity
			style={styles.itemContainer}
			onPress={() => {
				setSelectedItem(item)
				setBottomSheetVisible(true)
			}}
		>
			<Image source={getLinkIcon(item.url)} style={styles.itemImage} />
			<Text style={styles.itemTitle}>{item.title}</Text>
			<TouchableOpacity style={{ marginLeft: 20 }}>
				<LinkIcon />
			</TouchableOpacity>
		</TouchableOpacity>
	)

	const FilterIcon = () => (
		<Svg height="100" width="100" viewBox="0 0 100 100">
			<Path
				d="M10.6087 12.3272C10.8248 12.4993 11 12.861 11 13.1393V18.8843L13 17.8018V13.1338C13 12.8604 13.173 12.501 13.3913 12.3272L17.5707 9H6.42931L10.6087 12.3272ZM20 7L20 4.99791L4.00001 5L4.00003 7H20ZM15 18.0027C15 18.5535 14.6063 19.2126 14.1211 19.4747L10.7597 21.2904C9.78783 21.8154 9 21.3499 9 20.2429V13.6L2.78468 8.62775C2.35131 8.28105 2 7.54902 2 6.99573V4.99791C2 3.8945 2.89821 3 4.00001 3H20C21.1046 3 22 3.89826 22 4.99791V6.99573C22 7.55037 21.65 8.28003 21.2153 8.62775L15 13.6V18.0027Z"
				fill="grey"
				strokeWidth="2"
			/>
		</Svg>
	)

	const LinkIcon = () => (
		<Svg height="100" width="100" viewBox="0 0 100 100">
			<Path
				d="M12.6592 7.18364C12.9846 7.50908 12.9838 8.03753 12.6619 8.35944L7.94245 13.0789C7.61851 13.4028 7.09435 13.4039 6.76665 13.0762C6.44121 12.7508 6.44203 12.2223 6.76393 11.9004L11.4834 7.18093C11.8073 6.85699 12.3315 6.85593 12.6592 7.18364ZM6.76666 16.6117C5.79136 17.587 4.20579 17.5864 3.23111 16.6117C2.25561 15.6362 2.25611 14.0512 3.23112 13.0762L5.58813 10.7192C5.91357 10.3937 5.91357 9.8661 5.58813 9.54066C5.2627 9.21522 4.73506 9.21522 4.40962 9.54066L2.05261 11.8977C0.426886 13.5234 0.426063 16.1637 2.0526 17.7902C3.67795 19.4156 6.31879 19.4166 7.94517 17.7902L10.3022 15.4332C10.6276 15.1078 10.6276 14.5801 10.3022 14.2547C9.97674 13.9293 9.44911 13.9293 9.12367 14.2547L6.76666 16.6117ZM17.3732 8.36216C18.9996 6.73578 18.9986 4.09494 17.3732 2.46959C15.7467 0.843055 13.1064 0.843878 11.4807 2.46961L9.12367 4.82662C8.79823 5.15205 8.79823 5.67969 9.12367 6.00513C9.44911 6.33056 9.97674 6.33056 10.3022 6.00513L12.6592 3.64812C13.6342 2.6731 15.2192 2.6726 16.1947 3.6481C17.1694 4.62278 17.17 6.20835 16.1947 7.18365L13.8377 9.54066C13.5123 9.8661 13.5123 10.3937 13.8377 10.7192C14.1631 11.0446 14.6908 11.0446 15.0162 10.7192L17.3732 8.36216Z"
				fill-rule="evenodd"
				fill="grey"
				strokeWidth="2"
			/>
		</Svg>
	)

	const ArrowIcon = () => (
		<Svg width="15" height="12">
			<Path
				d="M12.613 4.79031C12.9303 4.48656 13.4447 4.48656 13.762 4.79031C14.0793 5.09405 14.0793 5.58651 13.762 5.89025L8.07452 11.3347C7.75722 11.6384 7.24278 11.6384 6.92548 11.3347L1.23798 5.89025C0.920674 5.58651 0.920674 5.09405 1.23798 4.79031C1.55528 4.48656 2.06972 4.48656 2.38702 4.79031L7.5 9.68478L12.613 4.79031Z"
				fill="grey"
			/>
		</Svg>
	)

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={styles.container}>
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
						<TouchableOpacity style={styles.optionsButton}>
							<Text style={styles.optionText}>Learning</Text>
							<ArrowIcon />
						</TouchableOpacity>
						<TouchableOpacity style={styles.optionIcon}>
							<FilterIcon />
						</TouchableOpacity>
					</View>
				</View>
				<FlatList
					data={data.links}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					style={styles.list}
				/>
			</View>
			<View style={styles.bottomBar}>
				<View style={styles.bottomFrame}>
					<Octicons name="list-unordered" size={24} color="grey" />
					<AntDesign name="search1" size={24} color="grey" />
					<AntDesign name="pluscircleo" size={24} color="grey" />
					<Ionicons name="person-outline" size={24} color="grey" />
				</View>
			</View>
			<BottomSheet
				ref={bottomSheetRef}
				index={isBottomSheetVisible ? 0 : -1}
				snapPoints={["50%"]}
				backgroundStyle={{ backgroundColor: "#171A21", borderRadius: 10 }}
				onChange={(index) => {
					if (index === -1) setBottomSheetVisible(false)
				}}
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
									<LinkIcon />
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
										{selectedItem.title}
									</Text>
								</TouchableOpacity>
								<View style={styles.sheetHeartIconContainer}>
									<TouchableOpacity // heart
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
									<TouchableOpacity style={styles.sheetLearningButton}>
										<TouchableOpacity
											style={{ width: 20, height: 20, marginRight: 6 }}
										>
											<Svg height="100" width="100" viewBox="0 0 100 100">
												<Path
													d="M5.8139 14.2822C5.9787 14.4615 6.25896 14.7205 6.54299 14.909C7.38682 15.4692 8.51466 15.811 9.9837 15.811C11.4525 15.811 12.5789 15.4693 13.4206 14.9094C13.7039 14.7211 14.041 14.4504 14.1472 14.2831V10.7892L11.0902 12.2439C10.4487 12.5492 9.51229 12.5489 8.87278 12.2434L5.8139 10.782V14.2822ZM4.14724 9.98573L0.474098 8.23088C-0.158499 7.92866 -0.157899 7.02793 0.4751 6.72655L8.86989 2.72964C9.5112 2.4243 10.4485 2.42341 11.0892 2.72724L19.5214 6.726C20.1559 7.02692 20.1565 7.92968 19.5224 8.23144L19.1472 8.40996V12.3806C19.403 12.6095 19.5639 12.9421 19.5639 13.3123C19.5639 14.0026 19.0043 14.5623 18.3139 14.5623C17.6235 14.5623 17.0639 14.0026 17.0639 13.3123C17.0639 12.9421 17.2248 12.6095 17.4806 12.3806V9.20305L15.8139 9.99614V14.5488C15.8165 14.7007 15.7776 14.8552 15.693 14.9946C15.6269 15.1034 15.512 15.2599 15.3425 15.447C15.0765 15.7407 14.7452 16.0301 14.3437 16.2972C13.229 17.0386 11.7816 17.4776 9.9837 17.4776C8.18601 17.4776 6.73767 17.0387 5.62123 16.2976C5.21917 16.0307 4.88726 15.7415 4.62057 15.448C4.45065 15.261 4.33536 15.1048 4.26911 14.9962C4.18384 14.8564 4.14465 14.7014 4.14724 14.5489V9.98573ZM9.58636 4.23445L2.7649 7.47822L9.59125 10.7395C9.77692 10.8282 10.1862 10.8283 10.374 10.739L17.2178 7.48233L10.375 4.23315C10.1873 4.14409 9.77531 4.14449 9.58636 4.23445Z"
													fill="#D29752"
													strokeWidth="2"
												/>
											</Svg>
										</TouchableOpacity>
										<Text style={styles.sheetLearningText}>Learning</Text>
										<ArrowIcon />
									</TouchableOpacity>
								</View>
							</View>
						</View>
					)}
					<View style={styles.sheetNoteContainer}>
						<View style={styles.noteText}>
							<TouchableOpacity>
								<Svg height="100" width="100" viewBox="0 0 100 100">
									<Path
										d="M3.33408 14.2927L3.33532 15.0743C3.77266 14.9243 4.27659 15.0239 4.62554 15.3728C4.976 15.7233 5.07486 16.2301 4.92209 16.6687L5.69561 16.6707L6.98804 15.3783L4.61936 13.0096C3.84148 13.7862 3.33408 14.2927 3.33408 14.2927ZM12.6425 5.00085L15.0051 7.3612L8.16655 14.1998L5.79887 11.8321C8.55649 9.07914 12.6425 5.00085 12.6425 5.00085ZM15.4877 2.15567L17.8492 4.51715C18.5 5.16802 18.5008 6.22251 17.8503 6.87304L6.68573 18.0376C6.5235 18.1998 6.20677 18.3313 5.97268 18.3313H2.50085C2.04032 18.3313 1.66699 17.9606 1.66699 17.4976V14.0262C1.66699 13.7946 1.80042 13.4736 1.96088 13.3133L13.1312 2.154C13.7818 1.50405 14.8367 1.5047 15.4877 2.15567Z"
										fill="grey"
										strokeWidth="2"
									/>
								</Svg>
							</TouchableOpacity>
							<Text style={styles.sheetNoteText}>Take a note...</Text>
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
	},
	header: {
		marginVertical: 10,
		marginHorizontal: 10,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		width: width,
	},
	tabContainer: {
		flexDirection: "row",
	},
	tab: {
		backgroundColor: "#222222",
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
	selectedTab: {
		backgroundColor: "rgba(255, 255, 255, 0.04)",
		height: 34,
	},
	unselectedTab: {
		backgroundColor: "rgba(255, 255, 255, 0.0)",
		height: 34,
	},
	tabText: {
		color: "white",
		opacity: 0.7,
	},
	optionsContainer: {
		flexDirection: "row",
	},
	optionsButton: {
		borderRadius: 7,
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.55,
		shadowRadius: 1,
		maxHeight: 34,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
		marginRight: 8,
	},
	optionText: {
		color: "white",
		opacity: 0.7,
		paddingRight: 5,
	},
	optionIcon: {
		width: 16,
		height: 16,
	},
	list: {
		flex: 1,
		margin: "auto",
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
		marginRight: 8,
	},
	itemTitle: {
		color: "white",
		fontSize: 16,
		fontWeight: "500",
		width: 280, // ?
	},
	bottomBar: {
		backgroundColor: "#151515",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		width: width,
		height: 82,
		paddingHorizontal: 15,
	},
	bottomFrame: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		width: "100%",
		height: "100%",
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
		backgroundColor: "#232323",
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
		maxHeight: 34,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
		marginRight: 8,
	},
	sheetLearningText: {
		color: "#D29752",
		paddingRight: 5,
		marginRight: 6,
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
		marginLeft: 10,
		flexDirection: "row",
	},
	sheetNoteText: {
		color: "white",
		fontSize: 16,
		opacity: 0.2,
		marginLeft: 2,
	},
})
