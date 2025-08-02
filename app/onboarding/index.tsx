import { rMS, rS, rVS } from "@/styles/responsive";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";

import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const img = require('@/assets/image/icon.png')
const Onboarding = () => {

  const { width, height } = Dimensions.get('window');
  const [ currentSlideIndex, setCurrentSlideIndex ] = useState(0);
  const flatListRef = useRef(null);

  const router = useRouter();

    const handleNavigation = () => {
        if (currentSlideIndex === slides.length - 1) {
            router.replace('/auth/register'); // navigate to Home if last slide
        } else {
            nextSlide(); // move to next slide if not last
        }
    };


  const slides = [
    {
      id: 1,
      title1: 'Payments made',
      title2: 'Easy',
      text: 'Guess what? You can also transfer money and pay your bills right here in Uniqnk.',
      image: require('@/assets/images/splash_3.png'),
    },
    {
      id: 2,
      title1: 'Chat and Connect',
      title2: 'with friends and love ones',
      text: "Guess what? You can also transfer money and pay your bills right here in Uniqnk.",
      image: require('@/assets/images/splash_2.png'),
    },
    {
      id: 3,
      title1: 'Share important Moments with others',
      text: 'Guess what? You can also transfer money and pay your bills right here in Uniqnk.',
      image: require('@/assets/images/splash_1.png'),
    }
  ]

  const Slide = ({ item }: { item: typeof slides[number] }) => {
    return (
      <View style={{ alignItems: "center", height, width, position: "relative" }}>
        <View style={styles.welcome}>
          <Image source={item.image} style={{
              width: width,
              height: height * 0.75,
              resizeMode: 'contain',
            }}
          />

          <TouchableOpacity onPress={skip}
           style={{ position: "absolute", top: 90, right: 30, borderRadius: 32, borderColor: "#fff", borderWidth: 1, paddingHorizontal: 20, paddingVertical: 12 }}>
            <Text style={{ color: "#fff", letterSpacing: 0, fontSize: 18, fontWeight: 'bold', textAlign: 'center', fontFamily: 'MulishBold' }}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.header__container}>
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: rMS(0) }}>
            {slides.map((_, index) => (
                <View key={index} style={[styles.indicator, currentSlideIndex == index && {
                backgroundColor: '#337EFE',
                width: rS(20),
                }]} />
            ))}
            </View>
          <View style={styles.header}>
            <View style={{ marginBottom: 6 }}>
              <Text style={{ flexWrap: 'wrap' }}>
                <Text style={styles.header__text1}>{item.title1} </Text>
                <Text style={styles.header__text2}>{item.title2}</Text>
              </Text>
            </View>
            <View>
              <Text style={styles.wel__text}>{item.text}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  

  const Footer = () => {
    return (
      <View style={{ height: rVS(height * 0.20), display: "flex", flexDirection: "column", paddingHorizontal: 20 }}>
        {
        //   currentSlideIndex == slides.length - 1 ? (
            // <View style={{ marginBottom: rMS(20), alignItems: 'center' }}>
            //   <TouchableOpacity style={[styles.btn, styles.start]} onPress={handleNavigation}>
            //     <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Get Started</Text>
            //   </TouchableOpacity>
            // </View>
        //   ) : (
            <View style={{marginBottom: rMS(15)}}>
              <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: rMS(10)}}>
               

                <View style={{width: rS(15)}} />

                <TouchableOpacity style={[ styles.btn2 ]} onPress={handleNavigation}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, fontFamily: "MulishBold" }}>Get Started</Text>
                  <Image source={img} />
                </TouchableOpacity>

                <TouchableOpacity style={[ styles.btn2, {
                    backgroundColor: 'transparent',
                    borderWidth: rS(1),
                    borderColor: '#B2B9D4',
                } 
                ]} onPress={login}>
                    <Text style={{ color: '#6B6F80', fontWeight: 'bold', fontSize: 18, fontFamily: "MulishBold" }}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
        //   )
        }
      </View>
    )
  }

  const updateCurrentSlideIndex = (e: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  }

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      const offset = (currentSlideIndex + 1) * width;
      flatListRef?.current?.scrollToOffset({offset})
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      router;
    }
  }

  const skip = () => {
    const offset = (slides.length - 1) * width;
    flatListRef?.current?.scrollToOffset({offset})
    setCurrentSlideIndex(slides.length - 1);
  }

    const login = () => {
        router.replace('/auth/login');
    };


  return (
    <View style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
      <StatusBar  />
      <FlatList
        ref={flatListRef}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        data={slides}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ height: height * 0.75}}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Slide item={item} />
        )}
      />
      <Footer />
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  welcome: {
    top: rMS(-60),
  },

  header__container: {
    alignItems: 'center',
    justifyContent: 'center',
    top: rMS(-100),
  },

  header: {
    width: rS(300),
    padding: rMS(2),
    marginTop: rMS(20),
    marginBottom: rMS(40),
    height: 200
  },

  header__text1: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'MulishBold',
    letterSpacing: 0
  },

   header__text2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3158FF',
    fontFamily: 'MulishBold',
    letterSpacing: 0,
    paddingLeft: 4,
    marginBottom: rMS(10)
  },

  wel__text: {
    fontSize: 16,
    textAlign: 'left',
    color: '#0A1233',
    paddingHorizontal: rMS(0),
    lineHeight: rVS(18),
  },

  indicator: {
    height: rVS(3.5),
    width: rS(10),
    backgroundColor: 'gray',
    borderRadius: 5,
    marginHorizontal: 5,
  },

  btn: {
    backgroundColor: '#1C78FF',
    padding: rMS(16),
    borderRadius: 32,
    width: rS(300),
    alignItems: 'center',
    justifyContent: 'center',
  },

  btn2: {
    backgroundColor: '#1C78FF',
    padding: rMS(16),
    borderRadius: 32,
    width: rS(300),
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: "row",
    gap: 10
  },

  start: {
    width: rS(250),
    borderRadius: 10,
  }
});

export default Onboarding;