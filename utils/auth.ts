import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
    try {
        await AsyncStorage.multiSet([
            [ACCESS_TOKEN_KEY, accessToken],
            [REFRESH_TOKEN_KEY, refreshToken],
        ]);
    } catch (error) {
        // Ignore error
    }
};

export const getAccessToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
        return null;
    }
};

export const getRefreshToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        return null;
    }
};

export const removeTokens = async (): Promise<void> => {
    try {
        await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
        // Ignore error
    }
};

export const hasTokens = async (): Promise<boolean> => {
    try {
        const refreshToken = await getRefreshToken();
        return !!refreshToken;
    } catch (error) {
        return false;
    }
};

export const verifyAuthWithDelay = async (minDelay: number = 500): Promise<boolean> => {
    const startTime = Date.now();

    try {
        const hasToken = await hasTokens();

        const elapsedTime = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsedTime);

        if (remainingDelay > 0) {
            await new Promise((resolve) => setTimeout(resolve, remainingDelay));
        }

        return hasToken;
    } catch (error) {
        const elapsedTime = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsedTime);

        if (remainingDelay > 0) {
            await new Promise((resolve) => setTimeout(resolve, remainingDelay));
        }

        return false;
    }
};

export const clearTokens = async (): Promise<void> => {
    try {
        await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
        console.error("Ошибка при очистке токенов:", error);
    }
};
