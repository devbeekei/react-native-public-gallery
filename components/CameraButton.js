import React from "react";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { circle } from "react-native/Libraries/Animated/Easing";

const TABBAT_HEIGHT = 49;

function CameraButton() {
	const insets = useSafeAreaInsets();

	const bottom = Platform.select({
		android: TABBAT_HEIGHT / 2,
		ios: TABBAT_HEIGHT / 2 + insets.bottom - 4,
	});

	return (
		<View style={[styles.wrapper, {bottom}]}>
			<Pressable
				android_ripple={{
					color: "#ffffff",
				}}
				style={styles.circle} >
				<Icon name="camera-alt" color="white" size={24} />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		zIndex: 5,
		borderRadius: 27,
		height: 54,
		width: 54,
		position: "absolute",
		left: "50%",
		transform: [
			{ translateX: -27 }
		],
		... Platform.select({
			ios: {
				shadowColor: "#4d4d4d",
				shadowOffset: {width: 0, height: 4},
				shadowOpacity: 0.3,
				shadowRadius: 4,
			},
			android: {
				elevation: 5,
				overflow: "hidden",
			}
		}),
	},
	circle: {
		backgroundColor: "#6200ee",
		borderRadius: 27,
		height: 54,
		width: 54,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default CameraButton;