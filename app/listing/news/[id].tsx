import CalendarNewsIcon from "@/assets/icons/CalendarNewsIcon";
import WriteIcon from "@/assets/icons/WriteIcon";
import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const DetailNewsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card_header}>
        <Text style={styles.title}>С 1 мая повышается тариф на электричество. Расти он будет каждый год</Text>

        <View style={styles.infoRow}>
          <WriteIcon />
          <Text style={styles.infoText}>Служба информации Энерго-Пром</Text>
        </View>

        <View style={styles.infoRow}>
          <CalendarNewsIcon />
          <Text style={styles.infoText}>2025-06-23</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>1. Для населения:</Text>

        <Text style={styles.bullet}>
          • при потреблении до 700 кВт⋅ч тариф на электроэнергию для населения, в том числе проживающего в
          высокогорных и отдалённых труднодоступных зонах, увеличен с 1,11 до 1,37 сом./кВт⋅ч, то есть на
          23,8%, и далее ежегодно на 20%;
        </Text>
        <Text style={styles.bullet}>
          • при потреблении свыше 700 кВт⋅ч – увеличение с 2,39 до 2,60 сом./кВт⋅ч, то есть на 8,5% (инфляция
          + среднее изменение обменного курса доллара 3,5%);
        </Text>

        <Text style={styles.paragraph}>
          Для небытовых потребителей (социальные и общественные потребители, станции по зарядке
          электромобилей, бюджетные потребители и энергокомпании потребители) тариф будет корректироваться на
          уровне инфляции и среднего изменения обменного курса доллара 3,5%.
        </Text>

        <Text style={styles.paragraph}>
          Кабмин отмечает, что ССТП основывается на следующих принципах: экономически-ориентированные тарифы
          на электроэнергию, установленные ниже ее стоимости, должны сохраняться; экономически ориентированные
          тарифы на электроэнергию для населения должны применяться только в пределах ...
        </Text>
      </View>
    </View>
  );
};

export default DetailNewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card_header: {
    // margin: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 10,
  },

  card: {
    // margin: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    // borderWidth: 1,
    // borderColor: "#E5E7EB",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: Colors.TITLE_AUTH,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 13,
    color: Colors.GRAY_COLOR,
  },

  sectionTitle: {
    fontWeight: "400",
    fontSize: 12,
    marginBottom: 8,
    color: Colors.TITLE_AUTH,
  },
  bullet: {
    fontSize: 12,
    color: Colors.GRAY_COLOR,
    marginBottom: 8,
    lineHeight: 20,
  },
  paragraph: {
    fontSize: 12,
    color: Colors.GRAY_COLOR,
    marginBottom: 10,
    lineHeight: 20,
  },
});
