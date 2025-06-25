import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
    // navigation.goBack() если понадобится
  };

  const handleSetPassword = (data: PasswordForm) => {
    console.log("Форма установления пароля:", data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.ORANGE_COLOR} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {/* <Ionicons name="lock-closed" size={40} color={Colors.ORANGE_COLOR} /> */}
            </View>
            <Text style={styles.title}>Завершение регистрации</Text>
            <Text style={styles.subtitle}>Укажите ваше имя и придумайте надежный пароль</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Имя</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={Colors.SPAN_AUTH} style={styles.inputIcon} />
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
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.SPAN_AUTH}
                  style={styles.inputIcon}
                />
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

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Подтвердите пароль</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={Colors.SPAN_AUTH}
                  style={styles.inputIcon}
                />
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

            {/* Ошибки от сервера больше не отображаются */}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(handleSetPassword)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Завершить регистрацию</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    marginTop: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
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
    width: "100%",
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
    backgroundColor: Colors.ORANGE_COLOR,
    borderRadius: 12,
    paddingVertical: 16,
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
});
