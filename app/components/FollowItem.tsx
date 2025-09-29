import { useRouter } from "expo-router";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AvatarImage from './AvatarImage';
import { StackedImages } from './StackedImages';

interface FollowItemProps {
    userAvatar: React.ReactNode;
    userName: string;
    // followersAvatar: React.ReactNode[];
    followers: string[];
    isFollowing?: boolean;
    notFollowing?: boolean;
    remove?: boolean;
    dismiss?: () => void;
}

export const FollowItem: React.FC<FollowItemProps> = ({ dismiss, notFollowing, remove, userAvatar, userName, followers, isFollowing }) => {
    const images = [
        <AvatarImage key="1" size={24} />,
        <AvatarImage key="2" size={24} />,
        <AvatarImage key="3" size={24} />
    ]
    const router = useRouter();

    const handleFollow = () => {
        if (isFollowing) {
            router.push({ pathname: "/profile/follow", params: { isFollowing: "true" } });
        } else if (notFollowing) {
            router.push({ pathname: "/profile/follow", params: { notFollowing: "true" } });
        }
        dismiss?.();
    };

    return (
    <TouchableOpacity onPress={handleFollow} style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {userAvatar}
            <View style={styles.section}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 30 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{userName}</Text>
                    {remove && (
                        <TouchableOpacity>
                            <Text style={{ color: "#00A3FF" }}>Follow</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.Avacom}>
                    <View style={styles.stackedAvatar}>
                        <StackedImages images={images} />
                    </View>

                    <View style={styles.texts}>
                        <Text style={styles.text1}>Also followed by</Text>
                        <Text numberOfLines={1} style={styles.text2}>{followers.join(", ")}</Text>
                    </View>
                </View>
            </View>
        </View>

        <View style={{ alignSelf: "flex-end" }}>
            {notFollowing && <TouchableOpacity style={styles.btn}>
                <Text style={{ textAlign: "center", alignSelf: "center", color: "#fff" }}>Follow</Text>
                </TouchableOpacity>}
            {isFollowing && <TouchableOpacity style={styles.btn2}>
                    <Text style={{ textAlign: "center", alignSelf: "center", color: "#6B6F80" }}>Unfollow</Text>
                </TouchableOpacity>}
            {!isFollowing && remove && <TouchableOpacity style={styles.btn2}>
                    <Text style={{ textAlign: "center", alignSelf: "center", color: "#6B6F80" }}>Remove</Text>
                </TouchableOpacity>}
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    section: {
        flexDirection: "column",
        gap: 5
    },
    Avacom: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20
    },
    stackedAvatar: {
        width: 30
    },
    texts: {
        flexDirection: "column",
        width: 100,
        gap: 5
    },
    text1: {
        fontSize: 10,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 14,
        color: "#6B6F80"
    },
    text2: {
        fontSize: 10,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 14,
        color: "#6B6F80"
    },
    btn: {
        borderRadius: 10,
        height: 32,
        width: 97,
        backgroundColor: "#00A3FF",
        flexDirection: "row",
        justifyContent: "center",
    },
    btn2: {
        backgroundColor: "#F1F4FF",
        borderRadius: 10,
        height: 32,
        width: 97,
        justifyContent: "center",
        alignItems: "center"
    }
})
