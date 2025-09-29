import React from "react";
import { StyleSheet, View } from "react-native";

interface ImageProps {
    images: React.ReactNode[]; 
}

export const StackedImages: React.FC<ImageProps> = ({ images }) => {

  return (
    <View style={styles.container}>
      {images.map((img, index) => (
        <View
          key={index}
          style={[
            styles.wrapper,
            { left: index * 10, zIndex: images.length - index },
          ]}
        >
            {img}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative", // needed for absolute children
    height: 40, // match child height
  },
  wrapper: {
    position: "absolute",
  },
});
