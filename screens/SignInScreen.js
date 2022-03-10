import React, { useRef, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignForm from "../components/SignForm";
import SignButtons from "../components/SignButtons";
import { signIn, signUp } from "../lib/auth";
import { getUser } from "../lib/users";

function SignInScreen({navigation, route}) {
	const {isSignUp} = route.params ?? {};
	const [form, setForm] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	
	const createChangeTextHandler = (name) => (value) => {
		setForm({...form, [name]: value});
	}

	const messages = {
		"auth/email-already-in-use": "이미 가입된 이메일입니다.",
		"auth/wrong-password": "잘못된 비밀번호입니다.",
		"auth/user-not-found": "존재하지 않는 계정입니다.",
		"auth/invalid-email": "유효하지 않은 이메일 주소입니다."
	}

	const onSubmit = async () => {
		Keyboard.dismiss();
		const {email, password} = form;
		const info = {email, password};
		setLoading(true);
		try {
			const {user} = isSignUp ? await signUp(info) : await signIn(info);
			const profile = await getUser(user.uid);
			if (!profile) {
				navigation.navigate("Welcome", {uid: user.uid});
			}
		} catch (e) {
			const resultMessage = messages[e.code] ? 
				messages[e.code] : 
				isSignUp ? "알 수 없는 이유로 회원가입에 실패하였습니다." : "알 수 없는 이유로 로그인에 실패하였습니다.";
			Alert.alert(isSignUp ? "회원가입 실패" : "로그인 실패", resultMessage);
		} finally {
			setLoading(false);
		}
	}

	return (
		<KeyboardAvoidingView 
			style={styles.keyboardAvoidingView}
			behavior={Platform.select({ios: "padding"})}>
			<SafeAreaView style={styles.fullscreen}>
				<Text style={styles.text}>PublicGallery</Text>
				<View style={styles.from}>
					<SignForm 
						isSignUp={isSignUp}
						onSubmit={onSubmit}
						form={form}
						createChangeTextHandler={createChangeTextHandler}
						/>
					<SignButtons
						isSignUp={isSignUp}
						onSubmit={onSubmit}
						loading={loading}
						/>
				</View>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
	},
	fullscreen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		fontSize: 32,
		fontWeight: "bold",
	},
	from: {
		marginTop: 64,
		width: "100%",
		paddingHorizontal: 16,
	},
});

export default SignInScreen;