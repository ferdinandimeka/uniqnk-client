import { Stack, router } from "expo-router"
import { Calendar1, Camera, CloseSquare, Fatrows, People, Setting2 } from "iconsax-react-native"
import React from 'react'
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function Live() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ImageBackground 
          source={require('../../assets/images/test_image_1.png')}
          style={styles.header}
          resizeMode="cover"
        >
          <View style={styles.headerContent}>
            <View style={styles.headerContentTop}>
              <TouchableOpacity>
                <CloseSquare size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity>
                <Setting2 size={24} color="#fff" />
              </TouchableOpacity>
            </View>

              <View style={styles.headerContentBottom}>
                <View style={styles.menuItem}>
                  <TouchableOpacity style={styles.items}>
                    <Fatrows size={15} color="#fff" />
                    <Text style={styles.text}>Details</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.menuItem}>
                  <TouchableOpacity style={styles.items}>
                    <Calendar1 size={15} color="#fff" />
                    <Text style={styles.text}>Schedule</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.menuItem}>
                  <TouchableOpacity style={styles.items}>
                    <People size={15} color="#fff" />
                    <Text style={styles.text}>Everyone</Text>
                  </TouchableOpacity>
                </View>
             </View>
          </View>
        </ImageBackground>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push("/live/session")} style={styles.footerItem}>
            <Image 
              source={require('../../assets/icons/Group.png')}
              style={{ width: 96, height: 96 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.camera}>
            <Camera size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    overflow: 'hidden',
  },
  header: {
    height: Dimensions.get("window").height * 0.8,
    backgroundColor: "#999",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerContentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  headerContentBottom: {
    flexDirection: 'row',
    gap: 8
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: "center",
  },
  items: {
    backgroundColor: "#1C1919",
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 100,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: "#fff"
  },
  footer: {
    height: Dimensions.get("window").height * 0.1,
    position: 'relative',
  },
  footerItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40
  },
  camera: {
    position: 'absolute',
    top: 90,
    right: 20,
    padding: 10,
    borderRadius: 100,
    backgroundColor: "grey"
  }
})