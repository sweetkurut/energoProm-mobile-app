import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchForgotPassword, setError } from "@/store/slices/authSlice";
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
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    dispatch(setError(""));
    setValidationError(null);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleSendCode = async (data: ForgotPasswordForm) => {
    try {
      setValidationError(null);
      dispatch(setError(""));
      await dispatch(fetchForgotPassword({ email: data.email })).unwrap();
      router.push({
        pathname: "/(auth)/resetPassword",
        params: { email: data.email },
      });
    } catch (error: any) {
      console.error("Ошибка при отправке кода:", error);

      if (typeof error === "string") {
        setValidationError(error);
      } else if (error?.non_field_errors?.[0]) {
        setValidationError(error.non_field_errors[0]);
      } else if (error?.email?.[0]) {
        setValidationError(error.email[0]);
      } else if (error?.message) {
        setValidationError(error.message);
      } else {
        setValidationError("Неверный email или другая ошибка при отправке кода");
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
      <SystemBars style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.ORANGE_COLOR} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require("../../assets/images/custom_icon.png")} width={170} height={116} />
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Забыли пароль ?</Text>
          <Text style={styles.subtitle}>Укажите свой email и ожидайте код подтверждения</Text>

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

          {(error || validationError) && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{error || validationError}</Text>
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
              <Text style={styles.buttonText}>Отправить</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 10,
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
    backgroundColor: Colors.BUTTONSERVICE,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
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
