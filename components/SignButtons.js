import React from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "./CustomButton";

function SignButtons({isSignUp, onSubmit}) {
	const navigation = useNavigation();
	const primaryTitle = isSignUp ? "회원가입" : "로그인";
	const secondaryTitle = isSignUp ? "뒤로가기" : "회원가입";

	const onSecondaryButtonPress = () => {
		if (isSignUp) {
			navigation.goBack();
		} else {
			navigation.push("SignIn", {isSignUp: true});
		}
	}

	return (
		<View style={styles.buttons}>
			<CustomButton title={primaryTitle} onPress={onSubmit} hasMarginBottom/>
			<CustomButton title={secondaryTitle} theme="secondary" onPress={onSecondaryButtonPress}/>
		</View>
	);
}

const styles = StyleSheet.create({
	buttons: {
		marginTop: 64,
	},
});

export default SignButtons;