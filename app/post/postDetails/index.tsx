import AppScreen from "@/app/components/AppScreen";
import { RED } from "@/common/theming/colors";
import formatNumber from "@/common/utils/format_number";
import { BULLET_POINT } from "@/common/utils/unicode";
import { useAuthStore } from '@/store/useAuthStore';
import { usePostStore } from '@/store/usePostStore';
import { useLocalSearchParams } from "expo-router";
import { Bookmark, Heart, Location, Message, More, Send } from "iconsax-react-native";
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import AppText from "../../components/AppText";
import AvatarImage from "../../components/AvatarImage";
import IconButton2 from "../../components/IconButton2";
import { useOpenModal } from "../../components/ModalContext";
import Spacer from "../../components/Spacer";
import CommentsModal from "../component/CommentModal";

const PostDetails = () => {

    const { id } = useLocalSearchParams();
    const scrollRef = useAnimatedRef();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const { posts, getAllPosts } = usePostStore();

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
        transform: [
            {
            translateY: interpolate(scrollOffset.value, 
                [-400, 0, 400], [-400 / 2, 0, 400 * 0.75]
            )
            },
            {
            scale: interpolate(scrollOffset.value, 
                [-400, 0, 400], [2, 1, 1]
            )
            }
        ]
        }
    });

    useEffect(() => {
        getAllPosts()
    }, [])

    const item = posts.find(post => post._id === id)
    const openModal = useOpenModal();
    const { likePost, unlikePost } = usePostStore();
    const { users } = useAuthStore();
    const userId = users?.data?.user._id || "";
    // const media = item?.mediaUrls.map()

    // ✅ Local state to manage like toggle and count instantly
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const handleLikeToggle = async() => {
        if (isLiked) {
            setIsLiked(false);
            setLikeCount((prev) => Math.max(prev - 1, 0));
            await unlikePost(item ? item?._id : "", userId);
        } else {
            setIsLiked(true);
            setLikeCount((prev) => prev + 1);
            await likePost(item ? item?._id : "", userId)
        }
    };

  return (
    <AppScreen noPadding style={styles.container}>
        <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
            <Animated.Image
                source={{ uri: item?.mediaUrls[0] ?? "" }}
                style={[styles.image, imageAnimatedStyle]}
            />

            <View style={styles.subContainer}>
                <View style={{ flexDirection: "row", gap: 8, marginRight: -8 }}>
                    <AvatarImage bordered image={item?.user.profilePicture} />
                    <View style={{ flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                        <AppText variant="body1Light" style={{ marginTop: 4 }}>
                            {item?.user.username}
                        </AppText>

                        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
                            <IconButton2 icon={Location} size={12} />
                            <AppText variant="body2Light">{item?.location?.name ? item?.location?.name.split(",")[0].trim() : "Location"}</AppText>
                            <AppText variant="body1">{BULLET_POINT}</AppText>
                            <AppText variant="body2Light">{moment(item?.createdAt).fromNow()}{" "}</AppText>
                        </View>
                    </View>
                    <Spacer />
                    <TouchableOpacity style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", borderWidth: 1, paddingHorizontal: 10, borderColor: "#fff", borderRadius: 10 }}>
                        <AppText style={{ alignSelf: "center" }} variant="body1Light">Follow</AppText>
                    </TouchableOpacity>
                    <IconButton2 icon={More} />
                </View>
                <AppText variant="body1Light">{item?.content}</AppText>
                <View
                    style={{
                        flexDirection: "row",
                        marginLeft: -8,
                        gap: 4,
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                    >
                    <IconButton2 
                        icon={Heart} 
                        active={isLiked} 
                        activeColor={RED}
                        onPress={handleLikeToggle}
                    >
                        <AppText variant="body2Light">{formatNumber(likeCount)}</AppText>
                    </IconButton2>
                    <IconButton2
                        icon={Message}
                        onPress={() => {
                        openModal(
                            (props) => <CommentsModal id={item?._id} {...props} />,
                            {}
                        );
                        }}
                    >
                        <AppText variant="body2Light">
                        {formatNumber(item?.comments ? item?.comments.length : 0)}
                        </AppText>
                    </IconButton2>
                    <IconButton2 icon={Bookmark} active={false}>
                        <AppText variant="body2Light">{formatNumber(2)}</AppText>
                    </IconButton2>
                    {/* <Spacer /> */}
                    <IconButton2 icon={Send} />
                </View>
            </View>
        </Animated.ScrollView>
    </AppScreen>
  )
}

export default PostDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000ff',
    },
    image: {
        width: '100%',
        height: 500,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },
    subContainer: {
        marginTop: 80,
        paddingHorizontal: 20,
        gap: 15
    }
})