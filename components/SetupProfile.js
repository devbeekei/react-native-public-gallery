import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {createUser} from "../lib/users";
import { signOut } from "../lib/auth";
import { Platform, Pressable, StyleSheet, View, Image, ActivityIndicator } from "react-native";
import BorderedInput from "./BorderedInput";
import CustomButton from "./CustomButton";
import { useUserContext } from "../contexts/UserContext";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";


function SetupProfile() {
	const [displayName, setDisplayName] = useState("");
	const navigation = useNavigation();
	const {setUser} = useUserContext();
	const {params} = useRoute();
	const {uid} = params || {};
	const [response, setResponse] = useState(null);
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		setLoading(true);
		let photoUrl = null;
		if (response) {
			try {
				const asset = response.assets[0];
				const extension = asset.fileName.split(".").pop(); // 확장자
				const reference = storage().ref(`/profile/${uid}.${extension}`); // 업로드할 경로 지정
				console.log("run");
				if (Platform.OS === "android") { // 안드로이드
					await reference.putString(asset.base64, "base64", {
						contentType: asset.type
					});
				} else { // iOS
					await reference.putFile(asset.uri);
				}
				photoUrl = response ? await reference.getDownloadURL() : null;
				console.log("imageUrl", photoUrl);
			} catch (e) {
				setLoading(false);
				throw e;
			}
		}

		const profile = {
			id: uid,
			displayName,
			photoURL: photoUrl,
		};
		createUser(profile);
		setUser(profile);
		setLoading(false);
	};

	const onCancel = () => {
		signOut();
		navigation.goBack();
	};

	const onSelectImage = () => {
		launchImageLibrary(
			{
				mediaType: "photo",
				maxWidth: 512,
				maxHeight: 512,
				includeBase64: Platform.OS === 'android',
			},
			(res) => {
				console.log(res);
				if (res.didCancel) {
					return;
				}
				setResponse(res);
			},
		)
	}

	return (
		<View style={styles.block}>
			<Pressable style={styles.circle} onPress={onSelectImage}>
				<Image style={styles.circle} source={{uri: response?.assets[0]?.uri}} />
			</Pressable>
			<View style={styles.form}>
				<BorderedInput
					placeholder="닉네임"
					value={displayName}
					onChangeText={setDisplayName}
					onSubmitEditing={onSubmit}
					returnKeyType="next"
					/>
				{loading ? (
					<ActivityIndicator size={32} color="#6200ee" style={styles.spinner} />
				) : (
					<View style={styles.buttons}>
						<CustomButton title="다음" onPress={onSubmit} hasMarginBottom />
						<CustomButton title="취소" onPress={onCancel} theme="secondary" />
					</View>
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	block: {
		alignItems: "center",
		marginTop: 24,
		paddingHorizontal: 16,
		width: "100%",
	},
	circle: {
		backgroundColor: "#cdcdcd",
		borderRadius: 64,
		width: 128,
		height: 128,
	},
	form: {
		marginTop: 16,
		width: "100%",
	},
	buttons: {
		marginTop: 48,
	},
});

export default SetupProfile;