import Colors from "@/constants/Colors";
import SplashScreenView from "@/SplashScreenView";
import { store } from "@/store";
import { fetchRefreshToken } from "@/store/slices/authSlice";
import { getRefreshToken, verifyAuthWithDelay } from "@/utils/auth";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { Provider } from "react-redux";

export const AuthContext = React.createContext({
    isAuthenticated: false,
    isAuthLoading: true,
    updateAuthState: (state: boolean) => {},
});

export default function RootLayout() {
    const [isShow, setIsShow] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const updateAuthState = useCallback((state: boolean) => {
        setIsAuthenticated(state);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsAuthLoading(true);
                const hasToken = await verifyAuthWithDelay(700);

                if (hasToken) {
                    try {
                        const refreshToken = await getRefreshToken();
                        if (refreshToken) {
                            await store.dispatch(fetchRefreshToken(refreshToken)).unwrap();
                            setIsAuthenticated(true);
                        } else {
                            setIsAuthenticated(false);
                        }
                    } catch (error) {
                        console.error("Ошибка при обновлении токена:", error);
                        setIsAuthenticated(false);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Ошибка при автологине:", error);
                setIsAuthenticated(false);
            } finally {
                setIsAuthLoading(false);
            }
        };

        checkAuth();
    }, []);

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
        <AuthContext.Provider value={{ isAuthenticated, isAuthLoading, updateAuthState }}>
            <View style={{ flex: 1 }}>
                <Provider store={store}>
                    <Stack
                        screenOptions={{
                            animation: "ios_from_right",
                            headerBackTitle: "Назад",
                            headerTintColor: Colors.BLACK,
                        }}
                    >
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
                                headerStyle: { backgroundColor: Colors.HEADER },
                                headerTintColor: Colors.WHITE_COLOR,
                                headerTitleStyle: { fontWeight: "500" },
                                animation: "ios_from_right",
                            }}
                        />
                        <Stack.Screen
                            name="listing/check/[id]"
                            options={{
                                title: "Мой лицевой счёт",
                                headerStyle: { backgroundColor: Colors.HEADER },
                                headerTintColor: Colors.WHITE_COLOR,
                                headerTitleStyle: { fontWeight: "500" },
                                animation: "ios_from_right",
                            }}
                        />
                        <Stack.Screen
                            name="(support)"
                            options={{
                                headerShown: false,
                                title: "Поддержка",
                                headerStyle: { backgroundColor: Colors.HEADER },
                                headerTintColor: Colors.WHITE_COLOR,
                                headerTitleStyle: { fontWeight: "500" },
                            }}
                        />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                </Provider>
                <StatusBar style="auto" />
            </View>
        </AuthContext.Provider>
    );
}
