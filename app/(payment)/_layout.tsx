import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentLayout() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <SystemBars style="dark" />
            <Stack
                screenOptions={{
                    animation: "slide_from_right",
                    headerStyle: {
                        backgroundColor: Colors.HEADER,
                    },
                    headerTintColor: Colors.WHITE_COLOR,
                    headerTitleStyle: {
                        fontWeight: "500",
                    },
                    headerLeft: ({ canGoBack }) =>
                        canGoBack ? (
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 5 }}>
                                <Ionicons name="chevron-back" size={24} color={Colors.WHITE_COLOR} />
                            </TouchableOpacity>
                        ) : null,
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
