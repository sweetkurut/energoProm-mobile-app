import axios from "axios";
import { Platform } from "react-native";
import { registerForPushNotificationsAsync } from "./hooks/usePushNotifications";
import { getAccessToken } from "./utils/auth";

export async function sendPushTokenToServer() {
    try {
        const token = await registerForPushNotificationsAsync();

        if (token) {
            const jwt = await getAccessToken();
            await axios.post(
                "https://flagman-backend.com.kg/api/notification/register-token/",
                {
                    token,
                    device_type: Platform.OS,
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            console.log("Push token отправлен на сервер:", token);
        }
    } catch (error) {
        console.error("Ошибка при отправке push токена:", error);
    }
}
