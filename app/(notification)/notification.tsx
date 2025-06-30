import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const tabs = ["Все", "Платежи", "Счета", "Новости"];

const mockData = {
  Все: [
    {
      type: "Платежи",
      title: "Оплата",
      message: "Оплата электроэнергии прошла успешно. Спасибо, что оплачиваете вовремя!",
      time: "16:39",
      color: "#4CAF50",
    },
    {
      type: "Счета",
      title: "Счет",
      message: "Счет за май 2025 на сумму 1225 сом",
      time: "1 день назад",
      color: "#5C6BC0",
    },
    {
      type: "Новости",
      title: "Новости",
      message: "С 1 мая повышается тариф на электричество. Расти он будет каждый год",
      time: "20 июня 2025",
      color: "#3FAFCE",
      isNews: true,
    },
  ],
};

mockData["Платежи"] = mockData["Все"].filter((i) => i.type === "Платежи");
mockData["Счета"] = mockData["Все"].filter((i) => i.type === "Счета");
mockData["Новости"] = mockData["Все"].filter((i) => i.type === "Новости");

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState("Все");
  const notifications = mockData[activeTab];

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{mockData[tab].length}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={48} color="#999" />
          <Text style={styles.emptyTitle}>Нет уведомлений</Text>
          <Text style={styles.emptySubtitle}>Новые уведомления появятся здесь</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {notifications.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <View style={[styles.label, { backgroundColor: item.color }]}>
                <Text style={styles.labelText}>{item.title}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.message}>{item.message}</Text>
                {item.isNews && <Text style={styles.readMore}>Читать далее →</Text>}
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    // paddingVertical: 6,
    padding: 6,
    paddingHorizontal: 9,
    marginHorizontal: 4,
    // width: 69,
    // elevation: 2,
  },
  activeTab: {
    backgroundColor: "#FFA726",
  },
  tabText: {
    color: "#666360",
    fontWeight: "500",
    // marginRight: 6,
    textAlign: "center",
    // fontSize: 12,
  },
  activeTabText: {
    color: "#fff",
  },
  badge: {
    backgroundColor: Colors.BADGE,
    borderRadius: "50%",
    paddingHorizontal: 8,
    paddingVertical: 1,
    // marginLeft: 6,
  },
  badgeText: {
    fontSize: 10,
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    // elevation: 2,
  },
  label: {
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  labelText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  cardContent: {
    position: "relative",
  },
  message: {
    fontSize: 11,
    color: Colors.GRAY_COLOR,
    marginBottom: 6,
  },
  readMore: {
    color: "#FFA726",
    fontWeight: "600",
    marginBottom: 6,
  },
  time: {
    position: "absolute",
    right: 0,
    bottom: 0,
    fontSize: 12,
    color: "#666360",
  },
});
