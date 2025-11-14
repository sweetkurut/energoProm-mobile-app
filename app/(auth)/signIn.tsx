import InstaIcon from "@/assets/icons/InstaIcon";
import PhoneIcon from "@/assets/icons/PhoneIcon";
import WhatsappIcon from "@/assets/icons/WhatsappIcon";
import Colors from "@/constants/Colors";
import { sendPushTokenToServer } from "@/sendPushTokenToServer";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchLogin, setError } from "@/store/slices/authSlice";
import { hasTokens, saveTokens } from "@/utils/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { SystemBars } from "react-native-edge-to-edge";

export default function SignIn() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setChecked] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const init = async () => {
            try {
                // Отправляем токен на сервер
                await sendPushTokenToServer();

                // Проверяем сохранённые токены
                const hasStoredTokens = await hasTokens();
                if (hasStoredTokens) {
                    router.replace("/(tabs)");
                }
            } catch (error) {
                console.error("Ошибка при инициализации уведомлений:", error);
            }
        };

        init();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            const result = await dispatch(fetchLogin(data)).unwrap();

            if (result) {
                await saveTokens(result.access, result.refresh);
                router.replace("/(tabs)");
            }
        } catch (error) {
            console.error("Ошибка входа:", error);
        }
    };

    const createAccount = () => {
        dispatch(setError(""));
        router.push("/(auth)/signUp");
    };

    const goToForgotPassword = () => {
        dispatch(setError(""));
        router.push("/(auth)/forgotPassword");
    };

    return (
        <LinearGradient
            style={styles.container}
            colors={["#ffc281", "#FFA94A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SystemBars style="dark" />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require("../../assets/images/custom_icon.png")}
                                width={170}
                                height={116}
                            />
                        </View>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Войти в личный кабинет</Text>
                        <Text style={styles.subtitle}>Введите данные для входа в систему</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Email обязателен",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Неверный формат email",
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={styles.input}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Введите ваш email"
                                            placeholderTextColor="#AAA"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    )}
                                    name="email"
                                />
                            </View>
                            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Пароль</Text>
                            <View style={styles.inputWrapper}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Пароль обязателен",
                                        minLength: {
                                            value: 6,
                                            message: "Пароль должен содержать минимум 6 символов",
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={styles.input}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="******"
                                            placeholderTextColor="#AAA"
                                            secureTextEntry={!showPassword}
                                        />
                                    )}
                                    name="password"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color={Colors.SPAN_AUTH}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && (
                                <Text style={styles.errorText}>{errors.password.message}</Text>
                            )}
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: -15,
                            }}
                        >
                            {/* <View style={styles.checkboxContainer}>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={isChecked}
                                    onValueChange={setChecked}
                                />
                                <Text style={styles.label}>Запомнить меня</Text>
                            </View> */}

                            <TouchableOpacity style={styles.forgotPasswordLink} onPress={goToForgotPassword}>
                                <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
                            </TouchableOpacity>
                        </View>

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSubmit(onSubmit)}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.WHITE_COLOR} />
                            ) : (
                                <Text style={styles.buttonText}>Войти</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Еще нет аккаунта?</Text>
                            <TouchableOpacity onPress={createAccount}>
                                <Text style={styles.signupLink}>Зарегистрироваться</Text>
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
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        backgroundColor: Colors.MAIN_BACKGROUND_COLOR,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingTop: 50,
    },

    header: {
        alignItems: "center",
        marginTop: 60,
        marginBottom: 40,
    },
    logoContainer: {
        justifyContent: "center",
        alignItems: "center",
        objectFit: "contain",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: Colors.TITLE_AUTH,
        marginBottom: 5,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "500",
        color: Colors.SPAN_AUTH,
        textAlign: "center",
        marginBottom: 15,
    },
    formContainer: {
        width: "auto",
        backgroundColor: Colors.WHITE_COLOR,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
        shadowColor: "#00000067",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginHorizontal: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.SPAN_AUTH,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.WHITE_COLOR,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        paddingHorizontal: 16,
        height: 55,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: Colors.SPAN_AUTH,
        height: "100%",
    },
    eyeIcon: {
        padding: 8,
    },
    errorText: {
        color: Colors.ORANGE_COLOR,
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    forgotPasswordLink: {
        alignSelf: "flex-end",
        marginBottom: 30,
        paddingTop: 10,
    },
    forgotPasswordText: {
        color: Colors.ORANGE_COLOR,
        fontSize: 14,
        fontWeight: "500",
    },
    globalError: {
        color: Colors.ORANGE_COLOR,
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
    },
    button: {
        backgroundColor: Colors.BUTTONSERVICE,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: Colors.WHITE_COLOR,
        fontSize: 16,
        fontWeight: "800",
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    signupText: {
        color: Colors.SPAN_AUTH,
        fontSize: 12,
    },
    signupLink: {
        color: Colors.ORANGE_COLOR,
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 5,
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

    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
    },
});
