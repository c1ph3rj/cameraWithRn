import { CameraType, CameraView } from "expo-camera";
import { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "../utils/AppColors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as MediaLibrary from "expo-media-library";
import { AppScreens } from "../utils/AppScreens";
import { AppStrings } from "../utils/AppStrings";

export const CameraPreview = ({ navigation }) => {
  const [cameraFacing, setCameraFacing] = useState<CameraType>("back");
  const [cameraRef, setCameraRef] = useState<CameraView>(null);
  const [isCapturing, setCapturing] = useState(false);

  function toggleCameraFacing() {
    setCameraFacing((current) => (current === "back" ? "front" : "back"));
  }

  const captureImage = async () => {
    if (cameraRef != null) {
      if (isCapturing) {
        alert("Please wait while we save the captured image.");
      } else {
        setCapturing(true);
        const data = await cameraRef.takePictureAsync();
        // Create an asset from the given URI
        const asset = await MediaLibrary.createAssetAsync(data.uri);
        const appAlbum = await MediaLibrary.getAlbumAsync(AppStrings.ALBUM_NAME);

        if (appAlbum == null) {
          await MediaLibrary.createAlbumAsync(AppStrings.ALBUM_NAME, asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync(asset, appAlbum);
        }

        setCapturing(false);
      }
    }
  };

  const navigateToGallery = () => {
    navigation.navigate(AppScreens.GalleryScreen);
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={(ref) => {
          setCameraRef(ref);
        }}
        style={styles.camera}
        facing={cameraFacing}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={40} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={captureImage}>
            <Ionicons name="camera" size={70} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToGallery}>
            <MaterialIcons name="photo-library" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    marginHorizontal: 20,
    marginVertical: 35,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: 14,
    alignItems: "center",
    backgroundColor: AppColors.lightTeal,
    borderRadius: 180,
  },
});
