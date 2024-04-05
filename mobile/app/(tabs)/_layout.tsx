// import FontAwesome from "@expo/vector-icons/FontAwesome"
// import { Link, Tabs } from "expo-router"
// import { Pressable, StyleSheet } from "react-native"

// function TabBarIcon(props: {
// 	name: React.ComponentProps<typeof FontAwesome>["name"]
// 	color: string
// }) {
// 	return <FontAwesome size={28} style={styles.tabBarIcon} {...props} />
// }

// export default function TabLayout() {
// 	return (
// 		<Tabs
// 			screenOptions={{
// 				tabBarActiveTintColor: "black",
// 			}}
// 		>
// 			<Tabs.Screen
// 				name="index"
// 				options={{
// 					title: "Tab One",
// 					tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
// 					headerRight: () => (
// 						<Link href="/modal" asChild>
// 							<Pressable>
// 								{({ pressed }) => (
// 									<FontAwesome
// 										name="info-circle"
// 										size={25}
// 										color="gray"
// 										style={[styles.headerRight, { opacity: pressed ? 0.5 : 1 }]}
// 									/>
// 								)}
// 							</Pressable>
// 						</Link>
// 					),
// 				}}
// 			/>
// 			<Tabs.Screen
// 				name="two"
// 				options={{
// 					title: "Tab Two",
// 					tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
// 				}}
// 			/>
// 		</Tabs>
// 	)
// }

// const styles = StyleSheet.create({
// 	headerRight: {
// 		marginRight: 15,
// 	},
// 	tabBarIcon: {
// 		marginBottom: -3,
// 	},
// })

import { Octicons, AntDesign } from "@expo/vector-icons"
import { Link, Tabs } from "expo-router"
import { View, StyleSheet } from "react-native"

function TabBarIcon(props: {
	name:
		| React.ComponentProps<typeof Octicons>["name"]
		| React.ComponentProps<typeof AntDesign>["name"]
	color: string
}) {
	if (props.name.startsWith("octicon-")) {
		const iconName = props.name.replace("octicon-", "") as React.ComponentProps<
			typeof Octicons
		>["name"]
		return <Octicons name={iconName} size={28} style={styles.tabBarIcon} color={props.color} />
	} else if (props.name.startsWith("antdesign-")) {
		const iconName = props.name.replace("antdesign-", "") as React.ComponentProps<
			typeof AntDesign
		>["name"]
		return <AntDesign name={iconName} size={28} style={styles.tabBarIcon} color={props.color} />
	}
}

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					backgroundColor: "black",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					headerShown: false,
					// title: "Tab One",
					// tabBarIcon: ({ color }) => (
					// 	<TabBarIcon name="code" color={"#151515"} />
					// ),
					// headerRight: () => (
					// 	<Link href="/modal" asChild>
					// 		<Pressable>
					// 			{({ pressed }) => (
					// 				<Octicons
					// 					name="list-unordered"
					// 					size={24}
					// 					color="gray"
					// 					style={[styles.headerRight, { opacity: pressed ? 0.5 : 1 }]}
					// 				/>
					// 			)}
					// 		</Pressable>
					// 	</Link>
					// ),
				}}
			/>
			<Tabs.Screen
				name="two"
				options={{
					title: "Tab",
					// tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
					tabBarIcon: ({ color }) => <AntDesign name="search1" size={24} color="grey" />,
					headerRight: () => (
						<Link href="/search" asChild>
							<Pressable>
								{({ pressed }) => (
									<AntDesign
										name="search1"
										size={24}
										color="gray"
										style={[styles.headerRight, { opacity: pressed ? 0.5 : 1 }]}
									/>
								)}
							</Pressable>
						</Link>
					),
				}}
			/>
		</Tabs>
	)
}

const styles = StyleSheet.create({
	headerRight: {
		marginRight: 15,
	},
	tabBarIcon: {
		marginBottom: -3,
	},
})
