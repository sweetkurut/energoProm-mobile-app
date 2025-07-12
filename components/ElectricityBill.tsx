import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FullElectricityBill() {
  return (
    <View style={styles.card}>
      {/* <Text style={styles.orgName}>ОсОО "ЭнергоПром"</Text> */}

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          Л/счет: <Text style={styles.bold}>91 003 694 7</Text>
        </Text>
        <Text style={styles.infoText}>Инспектор: 01Туралиев Т.</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          Ф.И.О.: <Text style={styles.bold}>АЛИЕВ А.С.</Text>
        </Text>
        <Text style={styles.infoText}>Маршрут: 0106</Text>
      </View>

      <Text style={styles.infoText}>Адрес: Кочкорка Эстебе 4</Text>

      <View style={styles.table}>
        <Text style={styles.sectionTitle}>Показания и начисления</Text>

        <View style={styles.rowHeader}>
          <Text style={styles.cellHeader}>Дата</Text>
          <Text style={styles.cellHeader}>Показ.</Text>
          <Text style={styles.cellHeader}>Расход</Text>
          <Text style={styles.cellHeader}>Сумма</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.cell}>28.05.25</Text>
          <Text style={styles.cell}>5166К</Text>
          <Text style={styles.cell}>124</Text>
          <Text style={styles.cell}>169.88</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>27.06.25</Text>
          <Text style={styles.cell}>5290К</Text>
          <Text style={styles.cell}>–</Text>
          <Text style={styles.cell}>–</Text>
        </View>

        <View style={styles.rowHeader}>
          <Text style={styles.cellHeader}>Дни</Text>
          <Text style={styles.cellHeader}>Тариф</Text>
          <Text style={styles.cellHeader}>Расход</Text>
          <Text style={styles.cellHeader}>Сумма</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.cell}>30</Text>
          <Text style={styles.cell}>1.37</Text>
          <Text style={styles.cell}>124</Text>
          <Text style={styles.cell}>169.88</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Переплата / Унедолг: <Text style={styles.bold}>19.73 сом</Text>
        </Text>
        <Text style={styles.summaryText}>
          К оплате за эл.эн.: <Text style={styles.bold}>189.61 сом</Text>
        </Text>
        <Text style={styles.summaryText}>
          Пеня: <Text style={styles.bold}>0.39 сом</Text>
        </Text>
        <Text style={styles.total}>
          Итого к оплате: <Text style={styles.boldRed}>190.00 сом</Text>
        </Text>
      </View>

      <Text style={styles.footerText}>Счет выписан 30.06.2025. Счета хранятся — 3 года.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  orgName: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#FF7A00",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "600",
    color: "#FEA94B",
  },
  table: {
    marginTop: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F3F3F3",
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  cellHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "#444",
  },
  summary: {
    marginTop: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 10,
  },
  summaryText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  boldRed: {
    color: "#FEA94B",
    fontWeight: "700",
  },
  footerText: {
    fontSize: 11,
    textAlign: "center",
    color: "#888",
    marginTop: 12,
    fontStyle: "italic",
  },
});
