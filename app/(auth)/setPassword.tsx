import InstaIcon from "@/assets/icons/InstaIcon";
import PhoneIcon from "@/assets/icons/PhoneIcon";
import WhatsappIcon from "@/assets/icons/WhatsappIcon";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchSetPassword } from "@/store/slices/authSlice";
import { ISetPassword } from "@/store/types";
import { saveTokens } from "@/utils/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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

interface PasswordForm {
    name: string;
    password: string;
    password_confirm: string;
}

export default function SetPassword() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const { email } = useLocalSearchParams<{ email: string }>();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<PasswordForm>({
        defaultValues: {
            name: "",
            password: "",
            password_confirm: "",
        },
    });

    const password = watch("password");

    const handleBack = () => {
        router.back();
    };

    const handleSetPassword = async (data: PasswordForm) => {
        try {
            const fullData: ISetPassword = {
                ...data,
                email: email || "",
            };

            const result = await dispatch(fetchSetPassword(fullData)).unwrap();

            if (result) {
                if (result.access && result.refresh) {
                    await saveTokens(result.access, result.refresh);
                }
                router.replace("/(tabs)");
            }
        } catch (error) {
            console.error("Ошибка при установке пароля:", error);
        }
    };

    return (
        <LinearGradient
            style={styles.container}
            colors={["#ffc281", "#FFA94A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.ORANGE_COLOR} />
                    </TouchableOpacity>

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
                        <Text style={styles.title}>Придумайте пароль</Text>
                        <Text style={styles.subtitle}>
                            Придумайте надёжный пароль для защиты вашего аккаунта
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Имя</Text>
                            <View style={styles.inputWrapper}>
                                {/* <Ionicons
                                  name="person-outline"
                                  size={20}
                                  color={Colors.GRAY_COLOR}
                                  style={styles.inputIcon}
                              /> */}
                                <Controller
                                    control={control}
                                    rules={{ required: "Имя обязательно" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={styles.input}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Введите ваше имя"
                                            placeholderTextColor="#AAA"
                                        />
                                    )}
                                    name="name"
                                />
                            </View>
                            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
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
                                            placeholder="Минимум 6 символов"
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

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Подтвердите пароль</Text>
                            <View style={styles.inputWrapper}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Необходимо подтвердить пароль",
                                        validate: (value) => value === password || "Пароли не совпадают",
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={styles.input}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Повторите пароль"
                                            placeholderTextColor="#AAA"
                                            secureTextEntry={!showConfirmPassword}
                                        />
                                    )}
                                    name="password_confirm"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color={Colors.SPAN_AUTH}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password_confirm && (
                                <Text style={styles.errorText}>{errors.password_confirm.message}</Text>
                            )}
                        </View>

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSubmit(handleSetPassword)}
                            disabled={loading}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.WHITE_COLOR} />
                            ) : (
                                <Text style={styles.buttonText}>Подтвердить</Text>
                            )}
                        </TouchableOpacity>
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
        paddingHorizontal: 10,
        paddingTop: 30,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    backButton: {
        marginTop: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#00000067",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    header: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(245, 56, 62, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
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
        // marginHorizontal: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.TITLE_AUTH,
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
        color: Colors.TITLE_AUTH,
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
    errorMessage: {
        color: Colors.ORANGE_COLOR,
        fontSize: 14,
        marginBottom: 15,
        backgroundColor: "rgba(245, 56, 62, 0.1)",
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: Colors.ORANGE_COLOR,
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
        marginTop: 20,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: Colors.WHITE_COLOR,
        fontSize: 16,
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
