import React from "react"
import { Link, Tabs } from "expo-router"
import { StyleSheet, Pressable } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Octicons, AntDesign, Ionicons } from "@expo/vector-icons"

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
		return (
			<Octicons
				name={iconName}
				size={28}
				style={styles.tabBarIcon}
				color={props.color}
			/>
		)
	} else if (props.name.startsWith("antdesign-")) {
		const iconName = props.name.replace(
			"antdesign-",
			"",
		) as React.ComponentProps<typeof AntDesign>["name"]
		return (
			<AntDesign
				name={iconName}
				size={24}
				style={styles.tabBarIcon}
				color={props.color}
			/>
		)
	} else if (props.name.startsWith("ionicon-")) {
		const iconName = props.name.replace("ionicon-", "") as React.ComponentProps<
			typeof Ionicons
		>["name"]
		return (
			<Ionicons
				name={iconName}
				size={24}
				style={styles.tabBarIcon}
				color={props.color}
			/>
		)
	}
}

export default function TabLayout() {
	return (
		<>
			<StatusBar style="light" />
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
						title: "index",
						tabBarIcon: ({ color, focused }) => (
							<Octicons
								name="list-unordered"
								size={24}
								color={focused ? "white" : color}
							/>
						),
						headerRight: () => (
							<Link href="/index" asChild>
								<Pressable>
									{({ pressed }) => (
										<Octicons
											name="list-unordered"
											size={24}
											color="gray"
											style={[
												styles.headerRight,
												{ opacity: pressed ? 0.5 : 1 },
											]}
										/>
									)}
								</Pressable>
							</Link>
						),
					}}
				/>
				<Tabs.Screen
					name="search"
					options={{
						headerShown: false,
						title: "search",
						tabBarIcon: ({ color, focused }) => (
							<AntDesign
								name="search1"
								size={24}
								color={focused ? "white" : color}
							/>
						),
						headerRight: () => (
							<Link href="/search" asChild>
								<Pressable>
									{({ pressed }) => (
										<AntDesign
											name="search1"
											size={24}
											color="gray"
											style={[
												styles.headerRight,
												{ opacity: pressed ? 0.5 : 1 },
											]}
										/>
									)}
								</Pressable>
							</Link>
						),
					}}
				/>
				<Tabs.Screen
					name="note"
					options={{
						headerShown: false,
						title: "add note",
						tabBarIcon: ({ color, focused }) => (
							<AntDesign
								name="pluscircleo"
								size={24}
								color={focused ? "white" : color}
							/>
						),
						headerRight: () => (
							<Link href="/note" asChild>
								<Pressable>
									{({ pressed }) => (
										<AntDesign
											name="pluscircleo"
											size={24}
											color="gray"
											style={[
												styles.headerRight,
												{ opacity: pressed ? 0.5 : 1 },
											]}
										/>
									)}
								</Pressable>
							</Link>
						),
					}}
				/>
				<Tabs.Screen
					name="personal"
					options={{
						headerShown: false,
						title: "Tab",
						tabBarIcon: ({ color, focused }) => (
							<Ionicons
								name="person-outline"
								size={24}
								color={focused ? "white" : color}
							/>
						),
						headerRight: () => (
							<Link href="/personal" asChild>
								<Pressable>
									{({ pressed }) => (
										<Ionicons
											name="person-outline"
											size={24}
											color="gray"
											style={[
												styles.headerRight,
												{ opacity: pressed ? 0.5 : 1 },
											]}
										/>
									)}
								</Pressable>
							</Link>
						),
					}}
				/>
			</Tabs>
		</>
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
