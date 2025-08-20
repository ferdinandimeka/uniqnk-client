import LiveStreamChat from '@/app/components/LiveThread';
import { Video } from "expo-av"; // 🎥 actual video player
import { CloseSquare, Eye } from "iconsax-react-native";
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AvatarImage from "../../components/AvatarImage";

const StreamScreen = () => {

    const { width, height } = Dimensions.get("window");

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Replace this with your video player */}
      {/* 🎥 VIDEO PLAYER */}
      {/* Header */}
        <View style={styles.headerContentTop}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <TouchableOpacity>
                    <AvatarImage bordered image={null} size={36} />
                </TouchableOpacity>

                <View style={{ flexDirection: "column", gap: 4, alignItems: "flex-start", justifyContent: "start" }}>
                    <Text style={{ color: "#fff" }}>Username</Text>
                    <Text style={{ color: "#fff", fontSize: 12 }}>Good morning</Text>
                </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Eye size={24} color="#fff" variant="Bold" />
                    <Text style={{ color: "#fff" }}>1.5K</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <CloseSquare size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>

      <Video
        source={{ uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }} // replace with your stream URL
        style={{ width, height }}
        resizeMode="cover"
        // shouldPlay
        isLooping
      />

      {/* Overlay chat */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <LiveStreamChat currentUser={{ id: "u1", name: "Ferdinand Imeka" }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    headerContentTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        // backgroundColor: "transparent"
      },
});

export default StreamScreen