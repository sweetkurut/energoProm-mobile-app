import Colors from "@/constants/Colors";
import * as shape from "d3-shape";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

const { width } = Dimensions.get("window");
const chartHeight = 160;
const chartWidth = width - 64;

const chartDataMap = {
  День: [4, 6, 3, 5, 2],
  Неделя: [8, 10, 6, 11, 5],
  Месяц: [3, 7, 4, 9, 6],
  Год: [15.56, 3.5, 2.2, 6.8, 10],
};

const chartLabels = ["01.01.25", "02.02.25", "03.03.25", "04.04.25", "05.05.25"];
const yAxisLabels = [15, 10, 5, 0];

export default function Chart() {
  const [activeTab, setActiveTab] = useState("Год");
  const consumptionData = chartDataMap[activeTab];

  const maxValue = 15;
  const xGap = chartWidth / (consumptionData.length - 1);
  const points = consumptionData.map((val, i) => ({
    x: xGap * i,
    y: chartHeight - (val / maxValue) * chartHeight,
  }));

  const line = shape
    .line()
    .x((_, i) => points[i].x)

    .y((_, i) => points[i].y)
    .curve(shape.curveLinear)(consumptionData);

  const area = shape
    .area()
    .x((_, i) => points[i].x)
    .y0(chartHeight)
    .y1((_, i) => points[i].y)
    .curve(shape.curveLinear)(consumptionData);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>График потребления</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
      >
        <View>
          <Text style={styles.total}>245</Text>
        </View>
        <View>
          <Text style={styles.totalCounter}>кВт*ч</Text>
        </View>
      </View>
      <Text style={styles.increase}>↑ 35 кВт-ч (16.7%)</Text>
      <Text style={styles.subtitle}>Увеличение к прошлому периоду</Text>

      <Svg width={chartWidth} height={chartHeight + 40} style={styles.chart}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FDBA74" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#FDBA74" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Горизонтальные линии */}
        {yAxisLabels.map((val, i) => (
          <Line
            key={i}
            x1={0}
            x2={chartWidth}
            y1={(chartHeight / maxValue) * (maxValue - val)}
            y2={(chartHeight / maxValue) * (maxValue - val)}
            stroke="#E4E4E7"
            strokeWidth={1}
            strokeDasharray="4,4"
          />
        ))}

        <Path d={area!} fill="url(#grad)" />
        <Path d={line!} fill="none" stroke="#F97316" strokeWidth={2} />

        {/* Tooltip + точка на первом элементе */}
        <G x={points[0].x} y={points[0].y}>
          <Circle cx={0} cy={0} r={5} fill="#F97316" />
        </G>

        {/* Tooltip + точка на втором элементе */}
        <G x={points[1].x} y={points[1].y}>
          <Circle cx={0} cy={0} r={5} fill="#F97316" />
          <Line x1={0} y1={0} x2={0} y2={chartHeight - points[1].y} stroke="#F97316" strokeDasharray="2,2" />
          <Rect x={-30} y={-42} rx={8} ry={8} width={60} height={24} fill="#F97316" />
          <SvgText x={0} y={-26} fontSize="12" fill="white" textAnchor="middle" alignmentBaseline="middle">
            15.56 кВт
          </SvgText>
        </G>

        {/* Подписи по оси X */}
        {chartLabels.map((label, i) => (
          <SvgText
            key={i}
            x={points[i].x}
            y={chartHeight + 16}
            fontSize="10"
            fill="#52525B"
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}

        {/* Подписи по оси Y */}
        {yAxisLabels.map((val, i) => (
          <SvgText
            key={i}
            x={chartWidth + 5}
            y={(chartHeight / maxValue) * (maxValue - val) + 4}
            fontSize="10"
            fill="#52525B"
          >
            {val} кВт
          </SvgText>
        ))}
      </Svg>

      <View style={styles.footerTabs}>
        {Object.keys(chartDataMap).map((label) => (
          <TouchableOpacity key={label} onPress={() => setActiveTab(label)}>
            <Text style={[styles.tab, activeTab === label && styles.activeTab]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 10,
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 4,
    color: Colors.GRAY_COLOR,
  },
  total: {
    fontSize: 25,
    fontWeight: "700",
    color: Colors.BUTTONSERVICE,
  },
  totalCounter: {
    fontSize: 18,
    fontWeight: "400",
    color: Colors.GRAY_COLOR,
  },

  increase: {
    fontSize: 16,
    color: "#E74C3D",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "300",
    color: "#9B9EA1",
    marginBottom: 20,
  },
  chart: {
    marginTop: 8,
    marginBottom: 12,
  },
  footerTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    backgroundColor: "#F3F3F3",
    borderRadius: 7,
    padding: 8,
  },
  tab: {
    fontSize: 12,
    color: "#A1A1AA",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    // backgroundColor: "#F4F4F5",
    overflow: "hidden",
    fontWeight: 500,
  },
  activeTab: {
    backgroundColor: Colors.BUTTONSERVICE,
    color: "#fff",
  },
});
