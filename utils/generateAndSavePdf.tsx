import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

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
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { color: #333; text-align: center; }
            p { margin: 10px 0; }
            strong { color: #666; }
          </style>
        </head>
        <body>
          <h2>Квитанция об оплате</h2>
          <p><strong>Сумма:</strong> ${receipt.amount} сом</p>
          <p><strong>Описание:</strong> ${receipt.description}</p>
          <p><strong>Дата:</strong> ${receipt.date}</p>
          <p><strong>Способ оплаты:</strong> ${receipt.method}</p>
          <p><strong>Номер квитанции:</strong> ${receipt.invoice}</p>
          <p><strong>Статус:</strong> ${receipt.status}</p>
          <p style="text-align: center; color: #999; margin-top: 20px;">
            Сгенерировано: ${new Date().toLocaleString("ru-RU")}
          </p>
        </body>
      </html>
    `;

        console.log("🔄 Генерация PDF...");

        const { uri } = await Print.printToFileAsync({ html });
        console.log("📄 PDF создан:", uri);

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, {
                mimeType: "application/pdf",
                dialogTitle: "Сохранить квитанцию",
            });
        } else {
            Alert.alert("Успех", "PDF сгенерирован, но шаринг недоступен");
        }
    } catch (error) {
        console.error("❌ Ошибка:", error);
        throw new Error("Не удалось создать PDF");
    }
};
