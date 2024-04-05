import { Octicons, AntDesign, Ionicons } from "@expo/vector-icons"
import { Link, Tabs } from "expo-router"
import { StyleSheet, Pressable } from "react-native"

function TabBarIcon(props: {
	name:
		| React.ComponentProps<typeof Octicons>["name"]
		| React.ComponentProps<typeof AntDesign>["name"]
		| React.ComponentProps<typeof Ionicons>["name"]
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
	} else if (props.name.startsWith("ionicon-")) {
		const iconName = props.name.replace("ionicon-", "") as React.ComponentProps<
			typeof Ionicons
		>["name"]
		return <Ionicons name={iconName} size={28} style={styles.tabBarIcon} color={props.color} />
	}
}

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					backgroundColor: "#151515",
					paddingHorizontal: 15,
					height: 82,
				},
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					headerShown: false,
					title: "learning",
					tabBarIcon: ({ color }) => <Octicons name="list-unordered" size={24} color="grey" />,
					headerRight: () => (
						<Link href="/search" asChild>
							<Pressable>
								{({ pressed }) => (
									<Octicons
										name="list-unordered"
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

			<Tabs.Screen
				name="two"
				options={{
					title: "search",
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
			{/* another tabs  */}
			<Tabs.Screen
				name="three"
				options={{
					title: "Tab",
					tabBarIcon: ({ color }) => <AntDesign name="pluscircleo" size={24} color="grey" />,
					headerRight: () => (
						<Link href="/index" asChild>
							<Pressable>
								{({ pressed }) => (
									<AntDesign
										name="pluscircleo"
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

			<Tabs.Screen
				name="four"
				options={{
					title: "Tab",
					tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color="grey" />,
					headerRight: () => (
						<Link href="/index" asChild>
							<Pressable>
								{({ pressed }) => (
									<Ionicons
										name="person-outline"
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
