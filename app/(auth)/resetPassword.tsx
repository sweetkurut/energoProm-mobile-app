import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchResetPassword, setError } from "@/store/slices/authSlice";
import { IResetPassword } from "@/store/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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

interface ResetPasswordForm {
    code: string;
    password: string;
    confirmPassword: string;
}

export default function ResetPassword() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        defaultValues: {
            code: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    useEffect(() => {
        dispatch(setError(""));
        setValidationError(null);
    }, []);

    const handleBack = () => {
        router.back();
    };

    const handleResetPassword = async (data: ResetPasswordForm) => {
        setValidationError(null);
        dispatch(setError(""));

        if (data.password !== data.confirmPassword) {
            setValidationError("Пароли не совпадают");
            return;
        }

        if (data.password.length < 6) {
            setValidationError("Пароль должен содержать минимум 6 символов");
            return;
        }

        try {
            const resetData: IResetPassword = {
                email: email,
                code: data.code,
                new_password: data.password,
            };

            await dispatch(fetchResetPassword(resetData)).unwrap();
            router.push("/(auth)/signIn");
        } catch (err: any) {
            console.error("Ошибка при сбросе пароля:", err);

            if (typeof err === "string") {
                setValidationError(err);
            } else if (err?.non_field_errors?.[0]) {
                setValidationError(err.non_field_errors[0]);
            } else if (err?.message) {
                setValidationError(err.message);
            } else {
                setValidationError("Неверный код или другая ошибка при сбросе пароля");
            }
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
                    // contentContainerStyle={styles.scrollContainer}
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
                        {/* Код подтверждения */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Код подтверждения</Text>
                            <View style={styles.inputWrapper}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Код подтверждения обязателен",
                                        minLength: {
                                            value: 4,
                                            message: "Код должен содержать не менее 4 символов",
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={styles.input}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Введите код подтверждения"
                                            placeholderTextColor="#AAA"
                                            keyboardType="number-pad"
                                        />
                                    )}
                                    name="code"
                                />
                            </View>
                            {errors.code && <Text style={styles.errorText}>{errors.code.message}</Text>}
                        </View>

                        {/* Новый пароль */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Новый пароль</Text>
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

                        {/* Подтверждение пароля */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Повторите пароль</Text>
                            <View style={styles.inputWrapper}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Подтверждение пароля обязательно",
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
                                    name="confirmPassword"
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
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                            )}
                        </View>

                        {/* Ошибки */}
                        {(error || validationError) && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorMessage}>{error || validationError}</Text>
                            </View>
                        )}

                        {/* Кнопка */}
                        <TouchableOpacity
                            style={[
                                styles.button,
                                (Object.keys(errors).length > 0 || loading) && styles.buttonDisabled,
                            ]}
                            onPress={handleSubmit(handleResetPassword)}
                            disabled={Object.keys(errors).length > 0 || loading}
                            activeOpacity={0.7}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.WHITE_COLOR} />
                            ) : (
                                <Text style={styles.buttonText}>Сбросить пароль</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.MAIN_BACKGROUND_COLOR,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    backButton: {
        marginTop: 50,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
    },
    header: {
        alignItems: "center",
        marginTop: 60,
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
        fontSize: 24,
        fontWeight: "700",
        color: Colors.TITLE_AUTH,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.SPAN_AUTH,
        textAlign: "center",
        lineHeight: 22,
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
        marginBottom: 24,
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
    errorContainer: {
        marginBottom: 20,
    },
    errorMessage: {
        color: Colors.ORANGE_COLOR,
        fontSize: 14,
        backgroundColor: "rgba(245, 56, 62, 0.1)",
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: Colors.ORANGE_COLOR,
    },
    button: {
        backgroundColor: Colors.ORANGE_COLOR,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: Colors.WHITE_COLOR,
        fontSize: 16,
        fontWeight: "600",
    },
});
