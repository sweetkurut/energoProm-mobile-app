import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SupportLayout() {
    return (
        <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
            <SystemBars style="dark" />
            <Stack
                screenOptions={{
                    animation: "ios_from_right",
                    headerStyle: {
                        backgroundColor: Colors.HEADER,
                    },
                    headerTintColor: Colors.WHITE_COLOR,
                    headerTitleStyle: {
                        fontWeight: "500",
                    },
                    headerBackTitle: "Назад",
                }}
            >
                <Stack.Screen
                    name="support"
                    options={{
                        title: "Поддержка",
                        headerShown: true,
                    }}
                />
            </Stack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
