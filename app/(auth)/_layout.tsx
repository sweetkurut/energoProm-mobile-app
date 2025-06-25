import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.MAIN_BACKGROUND_COLOR }}
      edges={["top", "bottom"]}
    >
      <SystemBars style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animationDuration: 0,
        }}
      >
        <Stack.Screen name="signIn" options={{ title: "Авторизация" }} />
        <Stack.Screen name="signUp" options={{ title: "Регистрация" }} />
        <Stack.Screen name="confirmCode" options={{ title: "Вход 🔒" }} />
        <Stack.Screen name="setPassword" options={{ title: "Завершение регистрации" }} />
        <Stack.Screen name="forgotPassword" options={{ title: "Восстановление пароля" }} />
        <Stack.Screen name="resetPassword" options={{ title: "Сброс пароля" }} />
      </Stack>
    </SafeAreaView>
  );
}
