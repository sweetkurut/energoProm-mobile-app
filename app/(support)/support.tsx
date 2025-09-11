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

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.item} onPress={() => openLink("tel:+996700123456")}>
                <Ionicons name="call" size={24} color="#4CAF50" />
                <Text style={styles.text}>Позвонить: +996 700 123 456</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.item}
                onPress={() => openLink("whatsapp://send?phone=+996700123456&text=Здравствуйте!")}
            >
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                <Text style={styles.text}>Написать в WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.item}
                onPress={() => openLink("tg://resolve?domain=MySupportBot")}
            >
                <Ionicons name="paper-plane" size={24} color="#0088cc" />
                <Text style={styles.text}>Написать в Telegram</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.item}
                onPress={() => openLink("mailto:support@myapp.com?subject=Поддержка&body=Здравствуйте")}
            >
                <Ionicons name="mail" size={24} color="#FF9800" />
                <Text style={styles.text}>Написать на Email</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 20,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    text: {
        marginLeft: 10,
        fontSize: 16,
    },
});
