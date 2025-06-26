import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginLayout = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.MAIN_BACKGROUND_COLOR }}
      edges={["top", "bottom"]}
    >
      <SystemBars style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animationDuration: 0,
        }}
      >
        <Stack.Screen name="welcome" options={{ title: "Добро пожаловать" }} />
        <Stack.Screen name="service" options={{ title: "Заявки на услуги" }} />
        <Stack.Screen name="createRequest" options={{ title: "Новая заявка" }} />
      </Stack>
    </SafeAreaView>
  );
};

export default LoginLayout;

const styles = StyleSheet.create({});
