import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Профиль</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.MAIN_BACKGROUND_COLOR,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
