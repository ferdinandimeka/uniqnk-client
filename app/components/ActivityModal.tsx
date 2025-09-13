import {
  AddSquare,
  ArrowRight2,
  ArrowSquare,
  ArrowSquareLeft,
  Clock,
  Heart, Messages2, Share,
  Story,
  Tag2,
  VideoPlay
} from "iconsax-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppScreen from "./AppScreen";
import { ModalArgs, useOpenModal } from "./ModalContext";
import Section from "./Section";

const { width } = Dimensions.get("window");

const ActivityModal: React.FC<ModalArgs> = ({ dismiss, visible }) => {
  const slideAnim = useRef(new Animated.Value(width)).current; // Start offscreen (right)
    const openModal = useOpenModal();
    useEffect(() => {
        if (visible) {
        // Slide in
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        } else {
        // Slide out
        Animated.timing(slideAnim, {
            toValue: width,
            duration: 300,
            useNativeDriver: true,
        }).start();
        }
    }, [visible, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.modal,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
        <AppScreen noPadding backgroundColor="#fff" style={{ flex: 1 }}>
        <Section
            as={SafeAreaView}
            style={{
                width: "100%",
                backgroundColor: "#fff",
                // elevation: 4,
                paddingBottom: 16,
                // borderWidth: 1,
            }}
        >
            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={dismiss}>
                    <ArrowSquareLeft size={24} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Activities</Text>
                {/* Dummy spacer to balance the avatar on the right side */}
                <View style={{ width: 40 }} />
            </View>
        </Section>

        <View style={{ flexDirection: "column", gap: 20 }}>
            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <Heart
                    size="16"
                    color="#555555"
                    variant="Linear"
                  />
                  <Text style={styles.Text}>Likes</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <Messages2
                    size="16"
                    color="#555555"
                    variant="Linear"
                  />
                  <Text style={styles.Text}>Comments</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <Share
                    size="16"
                    color="#555555"
                    variant="Linear"
                  />
                  <Text style={styles.Text}>Shares</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <Tag2
                    size="16"
                    color="#555555"
                    variant="Linear"
                  />
                  <Text style={styles.Text}>Tags</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <ArrowSquare
                    size="16"
                    color="#555555"
                    variant="Linear"
                  />
                  <Text style={styles.Text}>Reposts</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <VideoPlay
                    size="16"
                    color="#555555"
                    variant="Linear"
                  />
                  <Text style={styles.Text}>Reels</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <AddSquare
                    size="16"
                    color="#555555"
                    variant="Linear"
                  />
                  <Text style={styles.Text}>Posts</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <Story
                    size="16"
                    color="#555555"
                    variant="Linear"
                  />
                  <Text style={styles.Text}>Stories</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contents}>
                <View style={styles.content}>
                  <Clock
                    size="16"
                    color="#555555"
                    variant="Linear"
                  />
                  <Text style={styles.Text}>Search history</Text>
                </View>

                <ArrowRight2
                  size="16"
                  color="#555555"
                  variant="Linear"
                />
            </TouchableOpacity>
        </View>
        </AppScreen>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    modal: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#fff",
        padding: 0,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    headerText: { fontSize: 20, fontWeight: "700", color: "#fff" },
    closeText: { fontSize: 20, color: "#fff" },
    content: { flex: 1, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 16 },
    contents: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        paddingHorizontal: 6
    },
    headerTitle: {
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0,
        fontFamily: "Mulish",
        fontWeight: "bold",
        textAlign: "center",
        color: "#474A55",
        flex: 1, // take remaining space to center properly
    },
    form: {
        flexDirection: "column",
        gap: 5,
        // paddingHorizontal: 20,
        paddingVertical: 10,
    },
    Text: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: "Mulish",
        fontWeight: "600",
        color: "#2B2C33",
    },
});

export default ActivityModal;
