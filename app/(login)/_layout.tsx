import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginLayout = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
            <SystemBars style="dark" />
            <Stack
                initialRouteName="welcome"
                screenOptions={{
                    headerShown: true,
                    animation: "ios_from_right",
                    headerTintColor: Colors.WHITE_COLOR,
                    headerStyle: {
                        backgroundColor: Colors.HEADER,
                    },
                    headerTitleStyle: {
                        fontWeight: "500",
                    },
                    headerLeft: ({ canGoBack }) =>
                        canGoBack && Platform.OS === "ios" ? (
                            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 5 }}>
                                <Ionicons name="chevron-back" size={24} color={Colors.WHITE_COLOR} />
                            </TouchableOpacity>
                        ) : null,
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
