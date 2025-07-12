import NotificationIcon from "@/assets/icons/NotificationIcon";
import CardServices from "@/components/CardServices";
import Chart from "@/components/Chart";
import ElectricityBill from "@/components/ElectricityBill";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const goToNotification = () => {
    router.push("/(notification)/notification");
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Здесь симулируем загрузку. Замените на реальный fetch/запрос.
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* шапка главной страницы */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Добро пожаловать!</Text>
          <Text style={styles.nameText}>Иван Иванов</Text>
          <Text style={styles.balance}>Лицевой счёт: 45087634892346</Text>
        </View>
        <View style={styles.headerIcons}>
          <View style={styles.iconWrapper}>
            <Text style={styles.language}>Ру</Text>
          </View>
          <TouchableOpacity style={styles.iconWrapper} onPress={goToNotification}>
            <NotificationIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* табличка */}
      <ElectricityBill />
      {/* чарт */}
      <Chart />

      {/* текущий счёт */}
      <View style={styles.check}>
        <View>
          <Text style={styles.check_title}>Текущий счёт</Text>
          <Text style={styles.check_balance}>1225 сом</Text>
          <Text style={styles.check_span}>Оплатить до 25 числа текущего месяца</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.button_text}>Оплатить</Text>
        </TouchableOpacity>
      </View>

      {/* Сервисы */}
      <CardServices />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    backgroundColor: Colors.HEADER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 120,
    width: "auto",
    paddingHorizontal: 15,
    paddingTop: 40,
    position: "fixed",
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  welcomeText: {
    fontSize: 12,
    fontWeight: 400,
    color: Colors.WHITE_COLOR,
  },

  nameText: {
    fontSize: 18,
    fontWeight: 600,
    color: Colors.WHITE_COLOR,
  },

  balance: {
    fontSize: 12,
    fontWeight: 400,
    color: Colors.WHITE_COLOR,
  },

  iconWrapper: {
    backgroundColor: "#fff",
    borderRadius: "50%",
    padding: 10,
    // marginBottom: 10,
    height: 40,
    width: 40,
  },

  check: {
    backgroundColor: Colors.WHITE_COLOR,
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderColor: Colors.BUTTONSERVICE,
  },

  check_title: {
    color: Colors.GRAY_COLOR,
    fontSize: 14,
  },

  check_balance: {
    fontSize: 16,
    fontWeight: 700,
    color: Colors.HEADER,
  },

  check_span: {
    color: "#9B9EA1",
    fontSize: 12,
  },

  button: {
    backgroundColor: Colors.BUTTONSERVICE,
    padding: 12,
    borderRadius: 5,
  },

  button_text: {
    color: Colors.WHITE_COLOR,
    fontWeight: 500,
    fontSize: 12,
  },
});
