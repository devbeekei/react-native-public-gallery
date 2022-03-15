import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./HomeStack";
import MyProfileStack from "./MyProfileStack";
import Icon from "react-native-vector-icons/MaterialIcons";
import CameraButton from "../components/CameraButton";
import { StyleSheet, View } from "react-native";

function MainTap() {
	const Tab = createBottomTabNavigator();

	return (
		<>
			<View style={styles.block}>
				<Tab.Navigator
					screenOptions={{
						headerShown: false,
						tabBarShowLabel: false,
						tabBarActiveTintColor: "#6200ee",
					}} >
					<Tab.Screen
						name="HomeStack"
						component={HomeStack}
						options={{
							title: '홈',
							tabBarIcon: ({color, size}) => (
								<Icon name="home" color={color} size={size} />
							),
						}} />
					<Tab.Screen 
						name="MyProfileStack"
						component={MyProfileStack}
						options={{
							tabBarIcon: ({color}) => <Icon name="person" size={24} color={color} />,
						}} />
				</Tab.Navigator>
			</View>
			<CameraButton />
		</>
	);
}

const styles = StyleSheet.create({
	block: {
		flex: 1,
		zIndex: 0,
	},
})

export default MainTap;