import NotificationIcon from "@/assets/icons/NotificationIcon";
import ConfirmModal from "@/components/Modal";
import Colors from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Имитируем загрузку данных
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleLogout = () => {
    // тут можно сделать очистку токенов, переход на экран логина и т.д.
    console.log("Пользователь вышел из аккаунта");
    setIsLogoutModalVisible(false);
    router.push("/welcome");
  };

  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  const goToNotification = () => {
    router.push("/(notification)/notification");
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 21 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.headerTitle}>Профиль</Text>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <View style={styles.iconWrapper}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#666360" }}>Ру</Text>
          </View>
          <TouchableOpacity style={styles.iconWrapper} onPress={goToNotification}>
            <NotificationIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* Карточка профиля */}
      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>БР</Text>
          </View>
          <Text style={styles.name}>Борзенко Руслан</Text>
          <Text style={styles.account}>Лицевой счет: 563463465345345</Text>
        </View>

        {/* Контактная информация */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Контактная информация</Text>
          <View style={styles.row}>
            <View style={styles.iconRow}>
              <MaterialIcons name="phone" size={25} color="#555" />
            </View>
            <Text style={styles.rowText}>+996 XXX XXX XXX</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.iconRow}>
              <Ionicons name="location-outline" size={25} color="#555" />
            </View>
            <Text style={styles.rowText}>ул. Киевская 45, кв 12</Text>
          </View>
        </View>

        {/* Настройки */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Другое</Text>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.rowText}>Push-уведомление</Text>
              <Text style={styles.smallText}>Получать уведомление о новых счетах и платежах</Text>
            </View>
            <Switch value={isEnabled} onValueChange={toggleSwitch} />
          </View>

          <TouchableOpacity style={styles.rowLink}>
            <View>
              <Text style={styles.rowText}>Связаться с поддержкой</Text>
              <Text style={styles.smallText}>Задать вопрос или сообщить о проблеме</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666360" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowLink}>
            <View>
              <Text style={styles.rowText}>Часто задаваемые вопросы</Text>
              <Text style={styles.smallText}>Ответы на популярные вопросы</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666360" />
          </TouchableOpacity>
        </View>

        {/* Выход */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => setIsLogoutModalVisible(true)}>
          <Text style={styles.logoutText}>Выйти из аккаунта</Text>
          <Ionicons name="chevron-forward" size={20} color="#666360" />
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={isLogoutModalVisible}
        onConfirm={handleLogout}
        onCancel={handleCancelLogout}
        title="Подтверждение"
        message="Вы уверены, что хотите выйти из аккаунта?"
        confirmText="Да, выйти"
        cancelText="Отмена"
        confirmColor="#E74C3D"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  iconRow: {
    backgroundColor: "#FFF8F0",
    padding: 7,
    borderRadius: "50%",
  },

  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.HEADER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 100,
    width: "auto",
    paddingHorizontal: 15,
    paddingTop: 40,
    position: "fixed",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  iconWrapper: {
    backgroundColor: "#fff",
    borderRadius: "50%",
    padding: 10,
    // marginBottom: 10,
    height: 40,
    width: 40,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  langBtn: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  langText: {
    fontWeight: "bold",
    color: "#FFA726",
  },
  content: {
    padding: 10,
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    padding: 16,
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: "#FFA726",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666360",
  },
  account: {
    fontSize: 12,
    color: "#747474",
    fontWeight: 300,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "400",
    fontSize: 14,
    marginBottom: 20,
    color: "#666360",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rowText: {
    // marginLeft: 10,
    fontSize: 13,
    color: "#666360",
  },
  smallText: {
    fontSize: 12,
    color: "#747474",
    // marginTop: -6,
    marginBottom: 12,
    // marginLeft: 10,
    width: 240,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 6,
  },
  rowLink: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    // borderColor: "#FF3B30",
    // borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoutText: {
    color: "#E74C3D",
    fontWeight: "400",
    fontSize: 14,
  },
});
