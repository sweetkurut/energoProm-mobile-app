import CheckCircleIcon from "@/assets/icons/CheckCircleIcon";
import Colors from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { generateAndSavePdf } from "../../utils/generateAndSavePdf";

export default function Receipt() {
  // const { amount, description, date, method, invoice, status } = useLocalSearchParams();
  const params = useLocalSearchParams();

  const receipt = {
    amount: Number(params.amount),
    description: params.description as string,
    date: params.date as string,
    method: params.method as string,
    invoice: params.invoice as string,
    status: params.status as string,
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Установка счетчика</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#F3F3F3",
            borderRadius: "50%",
            padding: 2,
          }}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.successContainer}>
          <CheckCircleIcon size={70} color="#4CAF50" />
          <Text style={styles.successText}>Оплата прошла успешна</Text>
          <Text style={styles.subText}>Платеж был успешно обработан</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Детали платежа</Text>
          <DetailRow label="Сумма:" value={`${receipt.amount} сом`} />
          <DetailRow label="Описание:" value={receipt.description} />
          <DetailRow label="Дата операции:" value={receipt.date} />
          <DetailRow label="Способ оплаты:" value={receipt.method} />
          <DetailRow label="Номер квитанции:" value={receipt.invoice} />
          <DetailRow
            label="Статус:"
            value={receipt.status}
            valueStyle={{ color: "#22C55E", fontWeight: "600" }}
          />
        </View>

        <TouchableOpacity style={styles.downloadBtn} onPress={() => generateAndSavePdf(receipt)}>
          <MaterialCommunityIcons name="download" size={18} color="#FF8C00" />
          <Text style={styles.downloadText}>Скачать PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeText}>Закрыть</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const DetailRow = ({ label, value, valueStyle }: { label: string; value: string; valueStyle?: any }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, valueStyle]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 10,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666360",
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  successText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4CAF50",
    marginTop: 10,
  },
  subText: {
    fontSize: 11,
    color: "#747474",
    fontWeight: 300,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#747474",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#d4d4d439",
  },
  label: {
    color: "#747474",
    fontSize: 12,
    fontWeight: 300,
  },
  value: {
    fontSize: 13,
    fontWeight: "400",
    textAlign: "right",
    color: "##666360",
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.BUTTONSERVICE,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  downloadText: {
    color: Colors.BUTTONSERVICE,
    fontWeight: "600",
    marginLeft: 6,
  },
  closeBtn: {
    backgroundColor: Colors.BUTTONSERVICE,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  closeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
