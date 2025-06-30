import ArrowRightIcon from "@/assets/icons/ArrowRightIcon";
import CounterIcon from "@/assets/icons/CounterIcon";
import ElectricityIcon from "@/assets/icons/ElectricityIcon";
import MaintenanceIcon from "@/assets/icons/MaintenanceIcon";
import RepairIcon from "@/assets/icons/RepairIcon";
import RequestCard from "@/components/RequestCard";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ServiceListScreen = () => {
  const [tabs, setTabs] = useState<boolean>(false);

  const goToCreate = () => {
    router.push("/(login)/createRequest");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, !tabs && styles.activeTab]}
          onPress={() => setTabs(false)}
        >
          <Text style={[styles.tabText, !tabs && styles.activeText]}>Услуги</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabButton, tabs && styles.activeTab]} onPress={() => setTabs(true)}>
          <Text style={[styles.tabText, tabs && styles.activeText]}>Мои заявки</Text>
        </TouchableOpacity>
      </View>

      {!tabs ? (
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
      ) : (
        <>
          <RequestCard
            title="Установка счетчика"
            date="20 июня 2025"
            desc="Установка трехфазного счетчика в частном доме"
            address="ул.Киевская 45,кв. 12"
            planDate="20 декабря 2025"
            status="Новая"
          />
          <RequestCard
            title="Техническое обслуживание"
            date="20 июня 2025"
            desc="Установка трехфазного счетчика в частном доме"
            address="ул.Киевская 45,кв. 12"
            planDate="20 декабря 2025"
            status="В работе"
          />
          <RequestCard
            title="Ремонт счетчика"
            date="10 мая 2025"
            desc="Счетчик не показывает корректные показания"
            address="ул.Киевская 45,кв. 12"
            planDate="12 мая 2025"
            status="Выполнена"
          />
        </>
      )}
    </ScrollView>
  );
};

export default ServiceListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },

  tabs: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },

  activeTab: {
    backgroundColor: Colors.HEADER,
  },

  tabText: {
    fontSize: 13,
    color: "#666",
  },

  activeText: {
    color: "#fff",
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
    marginTop: 15,
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
