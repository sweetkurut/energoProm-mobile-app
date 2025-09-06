import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchGraphic } from "@/store/slices/graphicSlice";
import * as shape from "d3-shape";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
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
const chartHeight = 250;
const chartWidth = width - 80; // ширина видимой области
const minGap = 60; // минимальный отступ между точками

interface ChartProps {
    id: number | string;
}

export default function Chart({ id }: ChartProps) {
    const { graphic, loading } = useAppSelector((state) => state.graphic);
    const dispatch = useAppDispatch();

    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number | null } | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchGraphic(Number(id)));
        }
    }, [id, dispatch]);

    if (loading) {
        return <Text style={styles.loadingText}>Загрузка графика...</Text>;
    }

    if (!graphic || !graphic.graphic_evaluate || graphic.graphic_evaluate.length === 0) {
        return (
            <View style={styles.noDataContainer}>
                <Text style={styles.noDataTitle}>Нет данных для графика</Text>
                <Text style={styles.noDataSubtitle}>Попробуйте выбрать другой объект или период</Text>
            </View>
        );
    }

    const consumptionData = graphic.graphic_evaluate.map((item) => item.consumption ?? 0);
    const chartLabels = graphic.graphic_evaluate.map((item) => item.month_name ?? "");

    const maxValue = Math.max(...consumptionData) > 0 ? Math.max(...consumptionData) * 1.2 : 10;

    // шаг между точками (если точек мало — распределим на всю ширину экрана, если много — фиксированный шаг для скролла)
    const xGap = consumptionData.length <= 6 ? chartWidth / (consumptionData.length - 1 || 1) : minGap;

    const points = consumptionData.map((val, i) => ({
        x: 40 + xGap * i,
        y: chartHeight - (val / maxValue) * chartHeight,
        value: val,
    }));

    const fullChartWidth = 40 + xGap * (consumptionData.length - 1) + 40; // общая ширина графика

    const line = shape
        .line<{ x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(shape.curveLinear)(points);

    const area = shape
        .area<{ x: number; y: number }>()
        .x((d) => d.x)
        .y0(chartHeight)
        .y1((d) => d.y)
        .curve(shape.curveLinear)(points);

    const yStep = maxValue / 5;
    const yLabels = Array.from({ length: 5 }, (_, i) => Math.round(yStep * i));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>График потребления</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.consumptionValue}>{graphic.average_consumption} кВт*ч</Text>
                <View style={styles.diffContainer}>
                    <Text style={styles.increase}>
                        ↑ {graphic.diff_amount} кВт*ч ({graphic.diff_percent}%)
                    </Text>
                </View>
                <Text style={styles.subtitle}>Увеличение к прошлому периоду</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <Svg width={fullChartWidth} height={chartHeight + 50} style={styles.chart}>
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor="#FDBA74" stopOpacity="0.4" />
                            <Stop offset="100%" stopColor="#FDBA74" stopOpacity="0" />
                        </LinearGradient>
                    </Defs>

                    {/* Горизонтальные линии + подписи Y */}
                    {yLabels.map((val, i) => {
                        const y = chartHeight - (val / maxValue) * chartHeight;
                        return (
                            <G key={i}>
                                <Line
                                    x1={40}
                                    x2={fullChartWidth}
                                    y1={y}
                                    y2={y}
                                    stroke="#E4E4E7"
                                    strokeWidth={1}
                                    strokeDasharray="4,4"
                                />
                                <SvgText
                                    x={30}
                                    y={y}
                                    fontSize="10"
                                    fill="#52525B"
                                    textAnchor="end"
                                    alignmentBaseline="middle"
                                >
                                    {val}
                                </SvgText>
                            </G>
                        );
                    })}

                    {/* Область и линия */}
                    <Path d={area!} fill="url(#grad)" />
                    <Path d={line!} fill="none" stroke="#F97316" strokeWidth={2} />

                    {/* Вертикальные линии */}
                    {points.map((point, i) => (
                        <Line
                            key={`vline-${i}`}
                            x1={point.x}
                            y1={point.y}
                            x2={point.x}
                            y2={chartHeight}
                            stroke="#F97316"
                            strokeWidth={1}
                            strokeDasharray="4,4"
                        />
                    ))}

                    {/* Точки */}
                    {points.map((point, i) => (
                        <Circle
                            key={`point-${i}`}
                            cx={point.x}
                            cy={point.y}
                            r={5}
                            fill="#fff"
                            stroke="#F97316"
                            strokeWidth={2}
                            onPress={() => setTooltip({ x: point.x, y: point.y, value: point.value })}
                        />
                    ))}

                    {/* Тултип */}
                    {tooltip && (
                        <G x={tooltip.x} y={tooltip.y - 35}>
                            <Rect x={-28} y={-20} width={56} height={18} rx={4} fill="#F97316" />
                            <SvgText
                                x={-12}
                                y={-8}
                                fontSize="11"
                                fontWeight="bold"
                                fill="#fff"
                                textAnchor="middle"
                            >
                                {tooltip.value?.toFixed(0)} кВт*ч
                            </SvgText>
                        </G>
                    )}

                    {/* Подписи оси X */}
                    {chartLabels.map((label, i) => (
                        <SvgText
                            key={i}
                            x={points[i].x}
                            y={chartHeight + 25}
                            fontSize="11"
                            fill="#52525B"
                            textAnchor="middle"
                        >
                            {label}
                        </SvgText>
                    ))}
                </Svg>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 10,
        marginVertical: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loadingText: {
        textAlign: "center",
        marginVertical: 20,
    },
    noDataContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    noDataTitle: {
        fontSize: 16,
        color: "#6B7280",
    },
    noDataSubtitle: {
        fontSize: 12,
        color: "#9CA3AF",
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 6,
        color: "#4B5563",
    },
    infoContainer: {
        marginBottom: -16,
    },
    consumptionValue: {
        fontSize: 24,
        fontWeight: "700",
        color: "#F97316",
    },
    diffContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    increase: {
        fontSize: 14,
        color: "#E74C3D",
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "400",
        color: "#9B9EA1",
        marginTop: 4,
    },
    chart: {
        marginTop: 8,
        marginBottom: 12,
    },
});
