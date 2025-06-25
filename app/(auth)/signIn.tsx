import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
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
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => {
    router.push("/(tabs)");
    console.log("Данные формы:", data);
  };

  const createAccount = () => {
    router.push("/(auth)/signUp");
  };

  return (
    <View style={styles.container}>
      <SystemBars style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image source={require("../../assets/images/custom_icon.png")} width={170} height={116} />
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Войти в личный кабинет</Text>
            <Text style={styles.subtitle}>Введите данные для входа в систему</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Номер телефона</Text>
              <View style={styles.inputWrapper}>
                <Controller
                  control={control}
                  rules={{
                    required: "Номер телефона обязателен",
                    pattern: {
                      value: /^\+996\s?\d{3}\s?\d{3}\s?\d{3}$/,
                      message: "Неверный формат номера",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="+996 XXX XXX XXX"
                      placeholderTextColor="#AAA"
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                    />
                  )}
                  name="phone"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
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
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={Colors.SPAN_AUTH}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>

            <TouchableOpacity style={styles.forgotPasswordLink}>
              <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} activeOpacity={0.7}>
              <Text style={styles.buttonText}>Войти</Text>
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
            <TouchableOpacity>
              <Text style={styles.supportLink}>+996 XXX XXX XXX</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    paddingTop: 50,
  },

  header: {
    alignItems: "center",
    marginTop: 20,
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
    width: "100%",
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
    backgroundColor: Colors.ORANGE_BUTTON_COLOR,
    borderRadius: 12,
    paddingVertical: 16,
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
    marginTop: 25,
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
    marginTop: 35,
  },
  supportText: {
    color: Colors.SPAN_AUTH,
    fontSize: 12,
  },
  supportLink: {
    color: Colors.ORANGE_COLOR,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 5,
  },
});
