import CardBankIcon from "@/assets/icons/CardBankIcon";
import EmailServicesIcon from "@/assets/icons/EmailServicesIcon";
import NotificationEmailIcon from "@/assets/icons/NotificationEmailIcon";
import UserCardIcon from "@/assets/icons/UserCardIcon";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CardServices = () => {
  const goToService = () => {
    router.push("/(login)/service");
  };

  const goToNotification = () => {
    router.push("/(notification)/notification");
  };

  const gotoProfile = () => {
    router.push("/(tabs)/profile");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сервисы</Text>
      <View style={styles.cards}>
        <TouchableOpacity style={styles.card}>
          <CardBankIcon />
          <View>
            <Text style={styles.card_title}>Платежи</Text>
            <Text style={styles.card_span}>Оплатить счета онлайн</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={goToService}>
          <EmailServicesIcon />
          <View>
            <Text style={styles.card_title}>Заявки</Text>
            <Text style={styles.card_span}>Услуги и поддержка</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={goToNotification}>
          <NotificationEmailIcon />
          <View>
            <Text style={styles.card_title}>Уведомление</Text>
            <Text style={styles.card_span}>Новости и счета</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={gotoProfile}>
          <UserCardIcon />
          <View>
            <Text style={styles.card_title}>Профиль</Text>
            <Text style={styles.card_span}>Личные данные</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CardServices;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },

  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.WHITE_COLOR,
    width: 180,
    height: 120,
    padding: 24,
    alignItems: "center",
    borderRadius: 10,
  },
  card_title: {
    textAlign: "center",
    color: Colors.GRAY_COLOR,
    fontSize: 14,
    marginTop: 10,
    fontWeight: 400,
  },
  card_span: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: 300,
  },

  title: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    color: Colors.GRAY_COLOR,
    fontWeight: 400,
  },
});
