import { BlurView } from 'expo-blur';
import { AddCircle } from 'iconsax-react-native';
import { Platform, StyleSheet, View } from 'react-native';

export default function AddCircleWithBlur() {
  return (
    <BlurView
      intensity={0}
      tint="light"
      style={[styles.blurContainer, { backgroundColor: '#1C78FF4D' }]}
    >
      <View style={styles.shadowWrapper}>
        <AddCircle size={64} color="#1c78ff" variant="Bold" />
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    borderRadius: 100,
    // padding: 8,
    // backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  shadowWrapper: {
    ...Platform.select({
      ios: {
        shadowColor: '#1C78FF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
