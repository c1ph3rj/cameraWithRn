import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { AppColors } from "../utils/AppColors";
import { FlashList } from "@shopify/flash-list";
import { AppStrings } from "../utils/AppStrings";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const deviceWidth = Dimensions.get("screen").width;

export const GalleryScreen = () => {
  const [recentImages, setRecentImages] = useState<MediaLibrary.Asset[]>([]);
  const [appAlbum, setAppAlbum] = useState<MediaLibrary.Album>(null);

  useEffect(() => {
    const getAlbum = async () => {
      const refAlbum = await MediaLibrary.getAlbumAsync(AppStrings.ALBUM_NAME);
      setAppAlbum(refAlbum);
      if (refAlbum != null) {
        const albumImages = await MediaLibrary.getAssetsAsync({
          album: refAlbum,
        });
        if (albumImages != null) {
          setRecentImages(() => [...albumImages.assets]);
        }
      }
    };
    getAlbum();
  }, []);

  const renderGalleryItem = (asset: MediaLibrary.Asset) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          transition={1000}
          source={{ uri: asset.uri }}
        />
        <TouchableOpacity
          style={styles.deleteBtnContainer}
          onPress={() => deleteImage(asset)}
        >
          <MaterialIcons style={styles.deleteBtn} name="delete" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  const deleteImage = async (asset: MediaLibrary.Asset) => {
    if (appAlbum != null) {
      const fileDeleted = await MediaLibrary.deleteAssetsAsync(asset);
      if (fileDeleted) {
        setRecentImages((oldImages) => [
          ...oldImages.filter((item) => item.id != asset.id),
        ]);
      }
    }
  };

  return (
    <View style={styles.rootContainer}>
      <FlashList
        estimatedItemSize={200}
        data={recentImages}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderGalleryItem(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },

  imageContainer: {
    flex: 1,
    height: deviceWidth / 3,
    margin: 1,
  },

  image: {
    flex: 1,
    width: "100%",
    backgroundColor: AppColors.lightTeal,
  },

  deleteBtn: {
    margin: 2,
    color: AppColors.teal,
  },

  deleteBtnContainer: {
    position: "absolute",
    right: 0,
    margin: 4,
    padding: 2,
    borderRadius: 100,
    backgroundColor: AppColors.lightTeal,
  },

});
