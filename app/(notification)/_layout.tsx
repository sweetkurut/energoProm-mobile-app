import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";

const NotiFicationLayout = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
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
                    // headerBackTitleVisible: false,
                    headerLeft: ({ canGoBack }) =>
                        canGoBack && Platform.OS === "ios" ? (
                            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 5 }}>
                                <Ionicons name="chevron-back" size={24} color={Colors.WHITE_COLOR} />
                            </TouchableOpacity>
                        ) : null,
                }}
            >
                <Stack.Screen
                    name="notification"
                    options={{
                        title: "Уведомление",
                        headerShown: true,
                    }}
                />
            </Stack>
        </SafeAreaView>
    );
};

export default NotiFicationLayout;

const styles = StyleSheet.create({});
