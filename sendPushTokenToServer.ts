import axios from "axios";
import { Platform } from "react-native";
import { registerForPushNotificationsAsync } from "./hooks/usePushNotifications";

export async function sendPushTokenToServer() {
    const token = await registerForPushNotificationsAsync();

    if (token) {
        await axios.post("http://34.60.149.31/api/notification/register-token/", {
            token,
            device_type: Platform.OS, // "ios" или "android"
        });
    }
}
