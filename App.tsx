import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Button,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppScreens } from "./utils/AppScreens";
import { CameraPreview } from "./screens/CameraPreview";
import { AppColors } from "./utils/AppColors";
import { Camera, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Provider } from "react-redux";
import { GalleryScreen } from "./screens/GalleryScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name={AppScreens.HomeScreen} component={HomeScreen} />
        <Stack.Screen
          name={AppScreens.CameraPreview}
          component={CameraPreview}
          options={{
            title: "Camera",
          }}
        />
        <Stack.Screen
          name={AppScreens.GalleryScreen}
          component={GalleryScreen}
          options={{
            title: "Gallery",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoPermission, requestPhotoPermission] =
    MediaLibrary.usePermissions();


  const checkPresmissionAndRedirect = () => {
    if (!permission.granted) {
      // Camera permissions are not granted yet.
      Alert.alert(
        "Camera Access Needed",
        "To show the camera, we need your permission.",
        [
          {
            text: "allow",
            onPress: () => {
              requestPermission();
            },
          },
        ]
      );
      return;
    }

    if (!photoPermission.granted) {
      // Camera permissions are not granted yet.
      Alert.alert(
        "Camera and Storage Access Needed",
        "To take and save pictures, we need your permission.",
        [
          {
            text: "allow",
            onPress: () => {
              requestPermission();
            },
          },
        ]
      );
      return;
    }

    if (
      (permission.expires && !permission.granted) ||
      (photoPermission.expires && !photoPermission.granted)
    ) {
      Alert.alert(
        "Permissions Needed!",
        "To provide the best experience, we need your permission to access certain features.",
        [
          {
            text: "allow",
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
      return;
    }

    if (permission.granted && photoPermission.granted) {
      navigation.replace(AppScreens.CameraPreview);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          checkPresmissionAndRedirect();
        }}
        style={({ pressed }) => [pressed && { opacity: 0.5 }]}
      >
        <View style={styles.btnContainer}>
          <Text style={styles.btnText}>Open Camera</Text>
        </View>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  btnContainer: {
    padding: 16,
    backgroundColor: AppColors.teal,
    borderRadius: 8,
  },

  btnText: {
    fontSize: 18,
    color: AppColors.lightTeal,
  },

  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
