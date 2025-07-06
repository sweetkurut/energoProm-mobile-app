import ExclamationIcon from "@/assets/icons/ExclamationIcon";
import LightningIcon from "@/assets/icons/LightningIcon";
import PaymentCard from "@/assets/icons/PaymentCard";
import Colors from "@/constants/Colors";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Payment() {
  const [selectedMethod, setSelectedMethod] = useState<"mastercard" | "mbank" | "visa">();

  const methods = [
    {
      key: "mastercard",
      label: "Mastercard",
      desc: "Банковская карта Mastercard",
      icon: <FontAwesome5 name="cc-mastercard" size={24} color="#FF8C00" />,
    },
    {
      key: "mbank",
      label: "MBANK",
      desc: "Оплата через MBANK",
      icon: <PaymentCard />,
    },
    {
      key: "visa",
      label: "VISA",
      desc: "Банковская карта VISA",
      icon: <FontAwesome5 name="cc-visa" size={24} color="#FF8C00" />,
    },
  ];

  const goToReceipt = () => {
    router.push({
      pathname: "/(payment)/receipt",
      params: {
        amount: "1225",
        description: "Оплата за электроэнергию",
        date: "06.07.2025, 21:00",
        method: selectedMethod === "mbank" ? "MBANK" : selectedMethod === "visa" ? "VISA" : "Mastercard",
        invoice: "TXN123456789",
        status: "Успешно",
      },
    });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            {/* <Ionicons name="flash" size={24} color="#FF8C00" /> */}
            {/* <ElectricityIcon /> */}
            <LightningIcon />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.title}>Счет за электроэнергию</Text>
              <Text style={styles.subtitle}>Май 2025</Text>
              <Text style={styles.subtitle}>Лицевой счет: 563463465345345</Text>
            </View>
          </View>
          <View style={styles.rowWrap}>
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Потреблено:</Text>
              <Text style={styles.row_span}>245 кВт-ч</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowTitle}>Тариф:</Text>
              <Text style={styles.row_span}>5.00 сом/кВт-ч</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ fontWeight: "500", color: "#666360", fontSize: 14 }}>К оплате:</Text>
              <Text style={{ color: "#FEA94B", fontWeight: "500", fontSize: 16 }}>1225 сом</Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Выберите способ оплаты</Text>
          <View style={styles.methods}>
            {methods.map((method) => (
              <TouchableOpacity
                key={method.key}
                style={[styles.methodCard, selectedMethod === method.key && styles.selectedCard]}
                onPress={() => setSelectedMethod(method.key as any)}
              >
                <View style={styles.methodContent}>
                  {method.icon}
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.methodLabel}>{method.label}</Text>
                    <Text style={styles.methodDesc}>{method.desc}</Text>
                  </View>
                </View>
                {selectedMethod === method.key && (
                  <Ionicons name="checkmark-circle" size={22} color="#FF8C00" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <ExclamationIcon />
            <Text style={styles.infoTitle}>Информация об оплате</Text>
          </View>
          <Text style={styles.infoText}>
            • После оплаты вы получите SMS-уведомление{"\n"}• Квитанцию можно сохранить или отправить она
            будет на странице историй о платеже
          </Text>
        </View>
      </ScrollView>
      <View style={styles.btnWrap}>
        <TouchableOpacity style={styles.payButton} onPress={goToReceipt}>
          <Text style={styles.payButtonText}>Оплатить 1225 сом</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    // elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontWeight: "400",
    fontSize: 16,
    color: Colors.GRAY_COLOR,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.GRAY_COLOR,
  },

  rowWrap: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    padding: 16,
    // marginBottom: 10,
    shadowColor: "#000",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    borderBottomWidth: 1,
    borderColor: "#d4d4d439",
  },

  rowTitle: {
    color: Colors.GRAY_COLOR,
    fontSize: 12,
  },

  row_span: {
    color: "#666360",
    fontSize: 14,
  },

  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 8,
    color: Colors.GRAY_COLOR,
  },

  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    justifyContent: "space-between",
    marginBottom: 5,
    backgroundColor: "#fff",
    height: 80,
  },
  selectedCard: {
    borderColor: "#EA961C1A",
    backgroundColor: "#FFF7E6",
  },
  methodContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  methodLabel: {
    fontWeight: "400",
    fontSize: 14,
    color: "#666360",
  },
  methodDesc: {
    fontSize: 11,
    color: "#747474",
    fontWeight: 300,
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderColor: "#8CAFBF",
    marginTop: 15,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoTitle: {
    fontWeight: "400",
    fontSize: 14,
    color: "#747474",
    marginLeft: 7,
  },
  infoText: {
    fontSize: 12,
    color: "#9B9EA1",
    lineHeight: 18,
    fontWeight: "300",
  },

  btnWrap: {
    backgroundColor: "#fff",
    // width: "auto",
    padding: 15,
  },

  payButton: {
    backgroundColor: Colors.BUTTONSERVICE,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    // marginBottom: 20,
  },
  payButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
