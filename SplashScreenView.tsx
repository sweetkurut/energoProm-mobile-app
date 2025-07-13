import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const SplashScreenView = () => {
  return (
    <LinearGradient
      colors={["#ffc281", "#FFA94A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image source={require("./assets/images/Splash.png")} style={styles.img} />
      </View>
    </LinearGradient>
  );
};

export default SplashScreenView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    width: width,
    height: height,
  },

  img: {
    width: "auto",
    height: height,
    resizeMode: "cover",
  },
});
