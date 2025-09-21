import InstaIcon from "@/assets/icons/InstaIcon";
import PhoneIcon from "@/assets/icons/PhoneIcon";
import WhatsappIcon from "@/assets/icons/WhatsappIcon";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WelcomeScreen = () => {
    const handleSigUp = useCallback(() => {
        router.push("/(auth)/signUp");
    }, []);

    const handleService = useCallback(() => {
        router.push("/(login)/service");
    }, []);

    const goToProfile = useCallback(() => {
        router.push("/(auth)/signIn");
    }, []);

    return (
        <LinearGradient
            style={styles.container}
            colors={["#ffc281", "#FFA94A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.logoContainer}>
                <Image source={require("../../assets/images/custom_icon.png")} width={170} height={116} />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Добро пожаловать</Text>
                <Text style={styles.subTitle}>Управляйте энергосбережением просто и удобно</Text>
                <TouchableOpacity style={styles.buttonRequest} onPress={handleService}>
                    <Text style={styles.buttonText}>Оставить заявку</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonLogin} onPress={goToProfile}>
                    <Text style={styles.buttonTextLogin}>Войти в личный кабинет</Text>
                </TouchableOpacity>

                <View style={styles.notAccount}>
                    <Text style={styles.notAccountText}>У вас нет аккаунта?</Text>
                    <TouchableOpacity onPress={handleSigUp}>
                        <Text style={styles.reqistration}>Регистрация</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.supportContainer}>
                <Text style={styles.supportText}>Нужна помощь? Обратитесь в службу поддержки:</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity style={styles.iconWrapper}>
                        <WhatsappIcon />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconWrapper}>
                        <InstaIcon />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconWrapper}>
                        <PhoneIcon />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.ORANGE_BACKGROUND,
    },

    logoContainer: {
        alignItems: "center",
        paddingTop: 140,
        paddingBottom: 33,
    },

    formContainer: {
        backgroundColor: Colors.MAIN_BACKGROUND_COLOR,
        borderRadius: 16,
        paddingHorizontal: 20,
        marginHorizontal: 12,
        paddingTop: 24,
        display: "flex",
        justifyContent: "center",
    },

    formTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: Colors.TITLE_AUTH,
    },

    subTitle: {
        fontSize: 12,
        marginBottom: 24,
        textAlign: "center",
        fontWeight: "500",
        color: Colors.SPAN_AUTH,
    },

    buttonRequest: {
        backgroundColor: Colors.BUTTONSERVICE,
        paddingVertical: 12,
        borderRadius: 14,
        marginBottom: 10,
    },

    buttonLogin: {
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: Colors.BUTTONSERVICE,
    },

    buttonText: {
        color: Colors.WHITE_COLOR,
        fontWeight: "600",
        fontSize: 14,
        textAlign: "center",
    },
    buttonTextLogin: {
        color: Colors.TITLE_AUTH,
        fontSize: 14,
        textAlign: "center",
        fontWeight: "600",
    },

    notAccount: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },

    notAccountText: {
        marginRight: 10,
        color: Colors.SPAN_AUTH,
    },

    reqistration: {
        color: Colors.ORANGE_BUTTON_COLOR,
        fontWeight: "600",
    },

    supportContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "auto",
    },
    supportText: {
        color: Colors.WHITE_COLOR,
        fontSize: 13,
        fontWeight: "500",
        marginBottom: 10,
    },

    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    iconWrapper: {
        backgroundColor: "#fff",
        borderRadius: "50%",
        padding: 7,
        marginBottom: 10,
    },

    icon: {
        color: Colors.ICON,
    },
});
