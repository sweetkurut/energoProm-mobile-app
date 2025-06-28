import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.HEADER }} edges={["bottom"]}>
      <SystemBars style="dark" />
      <Stack
        screenOptions={{
          headerShown: true,
          animationDuration: 0,
        }}
      >
        <Stack.Screen
          name="welcome"
          options={{
            title: "Добро пожаловать",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="service"
          options={{
            title: "Заявки на услуги",
            headerStyle: {
              backgroundColor: Colors.HEADER,
            },
            headerTintColor: Colors.WHITE_COLOR,
            headerTitleStyle: {
              fontWeight: "500",
            },
          }}
        />
        <Stack.Screen
          name="createRequest"
          options={{
            title: "Новая заявка",
            headerStyle: {
              backgroundColor: Colors.HEADER,
            },
            headerTintColor: Colors.WHITE_COLOR,
            headerTitleStyle: {
              fontWeight: "500",
            },
          }}
        />
      </Stack>
    </SafeAreaView>
  );
};

export default LoginLayout;

const styles = StyleSheet.create({});
