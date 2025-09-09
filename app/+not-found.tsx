import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View style={styles.container}>
                <View style={styles.content}>
                    <FontAwesome name="bolt" size={80} color="#FFD700" />
                    <Text style={styles.title}>404</Text>
                    <Text style={styles.subtitle}>Страница не найдена</Text>
                    <Text style={styles.description}>Возможно, вы перешли по неверной ссылке.</Text>
                    <Link href="/" style={styles.link}>
                        <Text style={styles.linkText}>Вернуться на главную</Text>
                    </Link>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    content: {
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        backgroundColor: "#F5F5F5",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 72,
        fontWeight: "bold",
        color: "#2C3E50",
        marginTop: 10,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: "600",
        color: "#34495E",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "#7F8C8D",
        textAlign: "center",
        marginBottom: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        backgroundColor: "#3498DB",
    },
    linkText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
