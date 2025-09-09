import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginLayout = () => {
    return (
        <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
            <SystemBars style="dark" />
            <Stack
                initialRouteName="welcome"
                screenOptions={{
                    headerShown: true,
                    animation: "ios_from_right", // ✅ плавный переход справа
                    headerBackTitle: "Назад", // текст кнопки назад (iOS)
                    headerTintColor: Colors.WHITE_COLOR,
                    headerStyle: {
                        backgroundColor: Colors.HEADER,
                    },
                    headerTitleStyle: {
                        fontWeight: "500",
                    },
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
                    }}
                />
                <Stack.Screen
                    name="createRequest"
                    options={{
                        title: "Новая заявка",
                    }}
                />
            </Stack>
        </SafeAreaView>
    );
};

export default LoginLayout;

const styles = StyleSheet.create({});
