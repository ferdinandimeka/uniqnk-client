import LiveStreamChat from '@/app/components/LiveThread';
import Section from '@/app/components/Section';
import { Stack } from 'expo-router';
import { CloseSquare, Eye } from "iconsax-react-native";
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppScreen from "../../components/AppScreen";
import AvatarImage from "../../components/AvatarImage";

const StreamScreen = () => {

    // const { width, height } = Dimensions.get("window");

  return (
    <AppScreen noPadding style={{ flex: 1, backgroundColor: "#000" }}>
      {/* 🎥 VIDEO PLAYER */}
      {/* Header */}
      <Stack.Screen options={{ headerShown: false }} />
        <Section style={styles.headerContentTop}>
          {/* Left side */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity>
              <AvatarImage bordered image={null} size={36} />
            </TouchableOpacity>

            <View style={{ flexDirection: "column", gap: 4 }}>
              <Text style={{ color: "#fff" }}>Username</Text>
              <Text style={{ color: "#fff", fontSize: 12 }}>Good morning</Text>
            </View>
          </View>

          {/* Right side */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Eye size={24} color="#fff" variant="Bold" />
              <Text style={{ color: "#fff" }}>1.5K</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <CloseSquare size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Section>


      {/* <Video
        source={{ uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }} // replace with your stream URL
        style={{ width, height }}
        resizeMode="cover"
        // shouldPlay
        isLooping
      /> */}

      {/* Overlay chat */}
       <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
          style={{ position: "absolute", bottom: 10, left: 0, right: 0 }}
        >
          <LiveStreamChat currentUser={{ id: "u1", name: "Ferdinand Imeka" }} />
        </KeyboardAvoidingView>
      </AppScreen>
  )
}

const styles = StyleSheet.create({
    headerContentTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        alignItems: "center",
      },
});

export default StreamScreen