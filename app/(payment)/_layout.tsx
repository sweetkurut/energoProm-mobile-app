import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentLayout() {
  return (
    <SafeAreaView style={styles.container } edges={["bottom"]}>
      <SystemBars style="dark" />
      <Stack
        screenOptions={{
          animationDuration: 0,
          headerStyle: {
            backgroundColor: Colors.HEADER,
          },
          headerTintColor: Colors.WHITE_COLOR,
          headerTitleStyle: {
            fontWeight: "500",
          },
        }}
      >
        <Stack.Screen
          name="payment"
          options={{
            title: "Оплата",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="receipt"
          options={{
            title: "Квитанция",
            headerShown: true,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
