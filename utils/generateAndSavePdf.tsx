import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";
import { Alert, Platform, ToastAndroid } from "react-native";

export const generateAndSavePdf = async (receipt: {
  amount: number;
  description: string;
  date: string;
  method: string;
  invoice: string;
  status: string;
}) => {
  try {
    const html = `
      <html>
        <body style="font-family: Arial; padding: 24px;">
          <h2>Квитанция об оплате</h2>
          <p><strong>Сумма:</strong> ${receipt.amount} сом</p>
          <p><strong>Описание:</strong> ${receipt.description}</p>
          <p><strong>Дата:</strong> ${receipt.date}</p>
          <p><strong>Способ оплаты:</strong> ${receipt.method}</p>
          <p><strong>Номер квитанции:</strong> ${receipt.invoice}</p>
          <p><strong>Статус:</strong> ${receipt.status}</p>
        </body>
      </html>
    `;

    // 1. Генерация PDF, получаем URI файла
    const { uri } = await Print.printToFileAsync({ html });

    // 2. Запрос разрешений
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Нет доступа", "Разрешите доступ к файлам для сохранения PDF");
      return;
    }

    // 3. Создание ассета напрямую из URI
    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.createAlbumAsync("Download", asset, false);

    if (Platform.OS === "android") {
      ToastAndroid.show("PDF сохранён в папку Downloads", ToastAndroid.LONG);
    } else {
      Alert.alert("Успешно", "PDF успешно сохранён");
    }
  } catch (error) {
    console.error("Ошибка при сохранении PDF:", error);
    Alert.alert("Ошибка", "Не удалось сохранить PDF-файл");
  }
};
