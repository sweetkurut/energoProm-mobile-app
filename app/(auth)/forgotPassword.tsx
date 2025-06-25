import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
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
import { SystemBars } from "react-native-edge-to-edge";

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPassword() {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: "",
    },
  });

  const handleBack = () => {
    // router.back() при необходимости
  };

  const handleSendCode = async (data: ForgotPasswordForm) => {
    setValidationError(null);

    if (!data.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
      setValidationError("Неверный формат email");
      return;
    }

    setLoading(true);

    // Заглушка
    setTimeout(() => {
      console.log("Отправка email:", data.email);
      setLoading(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SystemBars style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.ORANGE_COLOR} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {/* <Ionicons name="lock-open" size={40} color={Colors.ORANGE_COLOR} /> */}
            </View>
            <Text style={styles.title}>Восстановление пароля</Text>
            <Text style={styles.subtitle}>
              Укажите ваш email для восстановления пароля. Мы отправим вам код подтверждения.
            </Text>
          </View> 

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={Colors.SPAN_AUTH} style={styles.inputIcon} />
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

            {validationError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{validationError}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, (Object.keys(errors).length > 0 || loading) && styles.buttonDisabled]}
              onPress={handleSubmit(handleSendCode)}
              disabled={Object.keys(errors).length > 0 || loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color={Colors.WHITE_COLOR} />
              ) : (
                <Text style={styles.buttonText}>Отправить код</Text>
              )}
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
