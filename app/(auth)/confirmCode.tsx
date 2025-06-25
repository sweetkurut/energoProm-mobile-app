import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from "react-native";

interface CodeFormData {
  digit0: string;
  digit1: string;
  digit2: string;
  digit3: string;
}

export default function ConfirmCode() {
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [email] = useState("example@example.com");
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CodeFormData>({
    defaultValues: {
      digit0: "",
      digit1: "",
      digit2: "",
      digit3: "",
    },
  });

  const codeValues = [watch("digit0"), watch("digit1"), watch("digit2"), watch("digit3")];
  const isCodeComplete = codeValues.every((digit) => digit !== "");

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length <= 1) {
      const fieldName = `digit${index}` as keyof CodeFormData;
      setValue(fieldName, text);

      if (text.length === 1 && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    const { key } = e.nativeEvent;

    if (key === "Backspace") {
      const currentField = `digit${index}` as keyof CodeFormData;
      const currentValue = watch(currentField);

      if (currentValue === "") {
        if (index > 0) {
          const prevField = `digit${index - 1}` as keyof CodeFormData;
          setValue(prevField, "");
          inputRefs.current[index - 1]?.focus();
        }
      }
    }
  };

  const handleContinue = async (data: CodeFormData) => {
    const codeString = Object.values(data).join("");
    setLoading(true);

    // Заглушка
    setTimeout(() => {
      console.log("Введённый код:", codeString);
      setLoading(false);
    }, 1500);
  };

  const resendCode = () => {
    console.log("Повторная отправка кода на:", email);
    setTimer(30);
  };

  const handleBack = () => {
    // Заглушка для возврата
    console.log("Назад");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <SystemBars style="dark" /> */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.ORANGE_COLOR} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {/* <Ionicons name="mail-unread" size={40} color={Colors.ORANGE_COLOR} /> */}
            </View>
            <Text style={styles.title}>Подтвердите Email</Text>
            <Text style={styles.subtitle}>
              Мы отправили код подтверждения на {email}. Введите его ниже, чтобы продолжить.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.codeContainer}>
              {codeValues.map((digit, index) => (
                <View key={index} style={styles.inputWrapper}>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                      pattern: /^[0-9]$/,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={[
                          styles.codeInput,
                          value ? styles.filledInput : styles.emptyInput,
                          errors[`digit${index}` as keyof CodeFormData] && styles.errorInput,
                        ]}
                        maxLength={1}
                        keyboardType="number-pad"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          handleCodeChange(text, index);
                        }}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                      />
                    )}
                    name={`digit${index}` as keyof CodeFormData}
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.button, (!isCodeComplete || loading) && styles.buttonDisabled]}
              onPress={handleSubmit(handleContinue)}
              disabled={!isCodeComplete || loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color={Colors.WHITE_COLOR} />
              ) : (
                <Text style={styles.buttonText}>Продолжить</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Не получили код?</Text>
              {timer > 0 ? (
                <Text style={styles.timerText}>Отправить повторно через {timer}с</Text>
              ) : (
                <TouchableOpacity onPress={resendCode}>
                  <Text style={styles.resendButton}>Отправить повторно</Text>
                </TouchableOpacity>
              )}
            </View>
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
    alignItems: "center",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
    marginTop: 10,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  codeInput: {
    width: 65,
    height: 65,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    borderRadius: 12,
  },
  filledInput: {
    backgroundColor: "rgba(245, 56, 62, 0.1)",
    borderWidth: 1,
    borderColor: Colors.ORANGE_COLOR,
    color: Colors.TITLE_AUTH,
  },
  emptyInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    color: Colors.TITLE_AUTH,
    backgroundColor: Colors.WHITE_COLOR,
  },
  errorInput: {
    borderColor: Colors.ORANGE_COLOR,
    borderWidth: 2,
  },
  errorText: {
    color: Colors.ORANGE_COLOR,
    fontSize: 14,
    marginBottom: 20,
    backgroundColor: "rgba(245, 56, 62, 0.1)",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.ORANGE_COLOR,
    alignSelf: "stretch",
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
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.WHITE_COLOR,
    fontSize: 16,
    fontWeight: "600",
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 25,
  },
  resendText: {
    color: Colors.SPAN_AUTH,
    marginBottom: 10,
    fontSize: 14,
  },
  timerText: {
    color: Colors.SPAN_AUTH,
    fontSize: 14,
  },
  resendButton: {
    color: Colors.ORANGE_COLOR,
    fontSize: 15,
    fontWeight: "600",
  },
});
