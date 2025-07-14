import Colors from "@/constants/Colors";
import SplashScreenView from "@/SplashScreenView";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShow(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (isShow) {
    return <SplashScreenView />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(login)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(payment)" options={{ headerShown: false }} />
        <Stack.Screen name="(notification)" options={{ headerShown: false }} />
        <Stack.Screen
          name="listing/news/[id]"
          options={{
            title: "Узнать больше",
            headerStyle: {
              backgroundColor: Colors.HEADER,
            },
            headerTintColor: Colors.WHITE_COLOR,
            headerTitleStyle: {
              fontWeight: "500",
            },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
