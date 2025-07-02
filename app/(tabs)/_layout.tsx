import Colors from "@/constants/Colors";
import { Tabs } from "expo-router";
import { HistoryIcon, HomeIcon, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: false,
        lazy: true,
        tabBarActiveTintColor: Colors.ORANGE_COLOR,
        tabBarInactiveTintColor: Colors.GRAY_COLOR,
        // headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ color, size, focused }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: "Платежи",
          tabBarIcon: ({ color, size, focused }) => <HistoryIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => <User color={color} size={size} />,
          title: "Профиль",
          // headerShown: true,
          headerStyle: {
            backgroundColor: Colors.HEADER,
          },
          headerTintColor: Colors.WHITE_COLOR,
          headerTitleStyle: {
            fontWeight: "500",
          },
        }}
      />
    </Tabs>
  );
}
