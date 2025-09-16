import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SupportScreen() {
    const openLink = async (url: string) => {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
            Linking.openURL(url);
        } else {
            Alert.alert("Ошибка", "Не удалось открыть приложение");
        }
    };

    const options = [
        {
            icon: "call",
            color: "#4CAF50",
            text: "Позвонить: +996 700 123 456",
            url: "tel:+996700123456",
        },
        {
            icon: "logo-whatsapp",
            color: "#25D366",
            text: "Написать в WhatsApp",
            url: "whatsapp://send?phone=+996700123456&text=Здравствуйте!",
        },
        {
            icon: "paper-plane",
            color: "#0088cc",
            text: "Написать в Telegram",
            url: "tg://resolve?domain=MySupportBot",
        },
        {
            icon: "mail",
            color: "#FF9800",
            text: "Написать на Email",
            url: "mailto:support@myapp.com?subject=Поддержка&body=Здравствуйте",
        },
    ];

    return (
        <View style={styles.container}>
            {options.map((opt, idx) => (
                <TouchableOpacity
                    key={idx}
                    style={styles.card}
                    onPress={() => openLink(opt.url)}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconWrapper, { backgroundColor: opt.color + "20" }]}>
                        <Ionicons name={opt.icon as any} size={28} color={opt.color} />
                    </View>
                    <Text style={styles.text}>{opt.text}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    text: {
        fontSize: 16,
        color: "#333",
        flexShrink: 1,
    },
});
