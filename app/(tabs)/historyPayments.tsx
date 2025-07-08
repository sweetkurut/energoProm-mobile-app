import PaymentsEmptyIcon from "@/assets/icons/PaymentsEmptyIcon";
import Colors from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const filters = ["Все", "Этот месяц", "Три месяца", "За год"];

const mockPayments = [
  { status: "success", method: "Оплата", amount: 850, bank: "Банковская карта", date: "Май 2025" },
  { status: "processing", method: "Оплата", amount: 850, bank: "MBANK", date: "Май 2025" },
  { status: "failed", method: "Оплата", amount: 850, bank: "Оптима Банк", date: "Май 2025" },
];

const statusMap = {
  success: {
    icon: "check-circle",
    color: "#4CAF50",
    label: "Успешно",
  },
  processing: {
    icon: "access-time",
    color: "#FFA500",
    label: "В обработке",
  },
  failed: {
    icon: "cancel",
    color: "#F44336",
    label: "Отклонено",
  },
};

export default function PaymentScreen() {
  const [selectedFilter, setSelectedFilter] = useState("Все");
  const [refreshing, setRefreshing] = useState(false);

  const filteredPayments = selectedFilter === "Все" ? mockPayments : [];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Здесь имитация задержки загрузки, можно заменить на реальный API вызов
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, selectedFilter === f && styles.selectedFilterBtn]}
            onPress={() => setSelectedFilter(f)}
          >
            <Text style={[styles.filterText, selectedFilter === f && styles.selectedFilterText]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredPayments.length === 0 ? (
          <View style={styles.empty}>
            <PaymentsEmptyIcon />
            <Text style={styles.emptyText}>Платежи не найдены</Text>
            <Text style={styles.emptySubText}>Попробуйте изменить фильтры</Text>
          </View>
        ) : (
          filteredPayments.map((payment, idx) => {
            const { icon, color, label } = statusMap[payment.status as keyof typeof statusMap];
            return (
              <TouchableOpacity key={idx} style={styles.card}>
                <View style={styles.cardHeader}>
                  <MaterialIcons name={icon as any} size={20} color={color} />
                  <Text style={[styles.statusText, { color }]}>{label}</Text>
                </View>
                <Text style={styles.cardTitle}>{payment.method}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.bank}>{payment.bank}</Text>
                  <Text style={[styles.amount, { color }]}>{payment.amount} сом</Text>
                  <Text style={styles.date}>{payment.date}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    flexWrap: "wrap",
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 10,
  },
  selectedFilterBtn: {
    backgroundColor: "#FEA94B",
  },
  filterText: {
    color: "#666",
  },
  selectedFilterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },
  cardFooter: {
    marginTop: 8,
  },
  bank: {
    color: "#888",
    fontSize: 14,
  },
  amount: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 4,
  },
  date: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  empty: {
    alignItems: "center",
    marginTop: 200,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.GRAY_COLOR,
    marginTop: 8,
  },
  emptySubText: {
    fontSize: 12,
    color: "#9B9EA1",
    fontWeight: "300",
  },
});
