import InstaIcon from "@/assets/icons/InstaIcon";
import PhoneIcon from "@/assets/icons/PhoneIcon";
import WhatsappIcon from "@/assets/icons/WhatsappIcon";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchSignUp } from "@/store/slices/authSlice";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SystemBars } from "react-native-edge-to-edge";

interface ISignUpEmail {
  email: string;
}

export default function SignUp() {
  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpEmail>({
    defaultValues: {
      email: "",
    },
  });

  const handleRegister = async (data: ISignUpEmail) => {
    try {
      setValidationError(null); // сброс ошибки перед новым запросом
      const result = await dispatch(fetchSignUp(data)).unwrap();
      if (result) {
        router.push({
          pathname: "/(auth)/confirmCode",
          params: { email: data.email },
        });
      }
    } catch (err: any) {
      console.error("Ошибка при регистрации:", err);

      // Пример проверки ошибок из ответа сервера:
      if (typeof err === "string") {
        setValidationError(err);
      } else if (err?.email && err.email.length > 0) {
        setValidationError(err.email[0]);
      } else if (err?.message) {
        setValidationError(err.message);
      } else {
        setValidationError("Произошла ошибка при регистрации");
      }
    }
  };

  const handleLogin = () => {
    router.push("/(auth)/signIn");
  };

  const goToConfirm = () => {
    router.push("/(auth)/confirmCode");
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
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require("../../assets/images/custom_icon.png")} width={170} height={116} />
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Создать аккаунт</Text>
            <Text style={styles.subtitle}>Зарегистрируйтесь для доступа к личному кабинету</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Gmail</Text>
            <View style={styles.inputWrapper}>
              <Controller
                control={control}
                rules={{
                  required: "Email обязателен",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                    message: "Введите корректный Gmail адрес",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Введите адрес электронной почты"
                    placeholderTextColor="#AAA"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
                name="email"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            {validationError && <Text style={styles.errorText}>{validationError}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit(handleRegister)}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color={Colors.WHITE_COLOR} />
            ) : (
              <Text style={styles.buttonText}>Продолжить</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Уже есть аккаунт?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Войти</Text>
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
    paddingBottom: 50,
  },
  backButton: {
    marginTop: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#00000067",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 24,
    objectFit: "contain",
    marginTop: 60,
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
    width: 200,
    marginBottom: -15,
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
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 15,
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
    color: Colors.TITLE_AUTH,
    height: "100%",
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  loginText: {
    color: Colors.TITLE_AUTH,
    fontSize: 12,
  },
  loginLink: {
    color: Colors.ORANGE_COLOR,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 5,
  },
  termsContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  termsText: {
    color: Colors.TITLE_AUTH,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.ORANGE_COLOR,
    fontWeight: "500",
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
