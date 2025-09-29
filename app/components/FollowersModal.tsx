import { ArrowSquareLeft, Search } from "iconsax-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Form, { FormInput } from "./AppForm";
import AppScreen from "./AppScreen";
import AvatarImage from "./AvatarImage";
import DecoratedTextField from "./DecoratedTextField";
import { FollowItem } from "./FollowItem";
import IconButton2 from "./IconButton2";
import { ModalArgs } from "./ModalContext";
import Section from "./Section";

const { width } = Dimensions.get("window");

const FollowersModal: React.FC<ModalArgs> = ({ dismiss, visible }) => {
    const slideAnim = useRef(new Animated.Value(width)).current; // Start offscreen (right)
    const [activeTab, setActiveTab] = useState('followers'); // 'Followers' or 'Following'
    const tabs = [
        { label: "followers", name: `Followers (${200})` },
        { label: "following", name: `Following (${100})` },
        { label: "suggested", name: `Suggested (${100})` }
    ]
    
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

    const users = [
        { id: "1", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "2", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "3", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "4", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "5", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "6", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "7", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "8", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "9", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "10", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "11", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "12", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "13", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
        { id: "14", name: "Sarah Damian", followers: [ "Sarah Damin", "Nkiru Orugue" ]},
    ]

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

                    <Text style={styles.headerTitle}>Followers</Text>
                    {/* Dummy spacer to balance the avatar on the right side */}
                    <View style={{ width: 40 }} />
                </View>
            </Section>

            <Form>
                <View
                    style={{
                        flexDirection: "row",
                        paddingHorizontal: 10
                    }}
                >
                    <FormInput
                        as={DecoratedTextField}
                        name="search"
                        prefix={<IconButton2 icon={Search} size={15} />}
                        containerStyle={{ flex: 1 }}
                        outlined
                        noMargin
                        placeholder="Search"
                    />
                </View>
            </Form>
            
            <View style={styles.tabsContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.label}
                        onPress={() => setActiveTab(tab.label)}
                        style={[
                            styles.tab,
                            activeTab === tab.label && styles.activeTab,
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab.label && styles.activeText,
                        ]}>
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            <ScrollView>
                <View style={{  paddingHorizontal: 10, paddingTop: 10  }}>
                    {activeTab === "followers" && (
                        <View>
                            {users.map((user) => (
                            <FollowItem
                                key={user.id}
                                userAvatar={<AvatarImage size={48} />}
                                userName={user.name}
                                followers={user.followers}
                                dismiss={dismiss}
                                remove
                            />
                            ))}
                        </View>
                    )}
                    {activeTab === "following" && (
                        <View>
                            {users.map((user) => (
                            <FollowItem
                                key={user.id}
                                userAvatar={<AvatarImage size={48} />}
                                userName={user.name}
                                followers={user.followers}
                                dismiss={dismiss}
                                isFollowing
                            />
                            ))}
                        </View>
                    )}
                    {activeTab === "suggested" && (
                        <View>
                            {users.map((user) => (
                            <FollowItem
                                key={user.id}
                                userAvatar={<AvatarImage size={48} />}
                                userName={user.name}
                                followers={user.followers}
                                notFollowing
                                dismiss={dismiss}
                            />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
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
    content: { flex: 1, alignItems: "center", justifyContent: "center" },
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
    tabsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    tab: {
        paddingVertical: 5,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    activeTab: {
        borderBottomColor: "#898989ff",
        color: "#1d1d1fff",
    },
    activeText: {
        color: "#616161ff",
    },
    tabText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#a6a6a7ff",
    },
});

export default FollowersModal;
