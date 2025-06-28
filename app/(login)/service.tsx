import ArrowRightIcon from "@/assets/icons/ArrowRightIcon";
import CounterIcon from "@/assets/icons/CounterIcon";
import ElectricityIcon from "@/assets/icons/ElectricityIcon";
import MaintenanceIcon from "@/assets/icons/MaintenanceIcon";
import RepairIcon from "@/assets/icons/RepairIcon";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ServiceListScreen = () => {
  const goToCreate = () => {
    router.push("/(login)/createRequest");
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Услуги</Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity style={styles.card} onPress={goToCreate}>
          <View style={styles.cardTitles}>
            <View style={styles.iconWrap}>
              <CounterIcon />
            </View>
            <View>
              <Text style={styles.cardtitle}>Установка счетчика</Text>
              <Text style={styles.cardSubtitle}>Установка нового электросчетчика</Text>
            </View>
          </View>
          <ArrowRightIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardTitles}>
            <View style={styles.iconWrap}>
              <RepairIcon />
            </View>
            <View>
              <Text style={styles.cardtitle}>Ремонт счетчика</Text>
              <Text style={styles.cardSubtitle}>Ремонт или замена неисправного счетчика</Text>
            </View>
          </View>
          <ArrowRightIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardTitles}>
            <View style={styles.iconWrap}>
              <MaintenanceIcon />
            </View>
            <View>
              <Text style={styles.cardtitle}>Техническое обслуживание</Text>
              <Text style={styles.cardSubtitle}>Плановое ТО электрооборудования</Text>
            </View>
          </View>
          <ArrowRightIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardTitles}>
            <View style={styles.iconWrap}>
              <ElectricityIcon />
            </View>
            <View>
              <Text style={styles.cardtitle}>Подключение к сети</Text>
              <Text style={styles.cardSubtitle}>Подключение нового объекта к элетросети</Text>
            </View>
          </View>
          <ArrowRightIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  title: {
    padding: 10,
    backgroundColor: Colors.HEADER,
    width: 75,
    borderRadius: 30,
    marginTop: 15,
  },

  titleText: {
    textAlign: "center",
    color: Colors.WHITE_COLOR,
    fontWeight: 500,
    fontSize: 13,
  },

  cards: {
    marginTop: 30,
    flexDirection: "column",
    gap: 10,
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE_COLOR,
    padding: 16,
    borderRadius: 15,
  },

  cardTitles: {
    // marginRight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  cardtitle: {
    fontSize: 16,
    color: Colors.TITLE_AUTH,
  },

  cardSubtitle: {
    fontSize: 11,
    color: Colors.GRAY_COLOR,
  },

  iconWrap: {
    width: 40,
    height: 40,
    backgroundColor: Colors.ICON_WRAP,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
});
