import Chart from "@/components/Chart";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchLastCheck } from "@/store/slices/checkSlice";

import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DetailCheckScreen() {
    const { id } = useLocalSearchParams();
    const { check, loading } = useAppSelector((state) => state.check);
    const data = check;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (id) {
            const houseCardId = Number(id);
            dispatch(fetchLastCheck(houseCardId));
            // dispatch(fetchGraphic(houseCardId));
        }
    }, [id, dispatch]);

    useEffect(() => {
        console.log("залупа:", check);
    }, [check]);

    if (loading)
        return (
            <View style={styles.loader}>
                <ActivityIndicator size={"large"} color={"#EA961C"} />
            </View>
        );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>
                        Л/счет: <Text style={styles.bold}>{data?.house_card.house_card}</Text>
                    </Text>
                    <Text style={styles.infoText}>Инспектор: {data?.house_card.route.executor.name}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>
                        Ф.И.О.: <Text style={styles.bold}>{data?.username.name}</Text>
                    </Text>
                    <Text style={styles.infoText}>Маршрут: {data?.house_card.route.route_number}</Text>
                </View>
                <Text style={styles.infoText}>
                    Тариф: <Text style={styles.bold}>{data?.tariff.name}</Text> ({data?.tariff.kw_cost}{" "}
                    сом/кВт*ч)
                </Text>

                <Text style={styles.infoText}>
                    Адрес: {data?.house_card.address.street.name} {data?.house_card.address.house}, кв.{" "}
                    {data?.house_card.address.apartment}
                    {data?.house_card.address.apartment_liter &&
                        `(${data?.house_card.address.apartment_liter})`}
                </Text>

                <View style={styles.table}>
                    <Text style={styles.sectionTitle}>Показания и начисления</Text>

                    <View style={styles.rowHeader}>
                        <Text style={styles.cellHeader}>Дата</Text>
                        <Text style={styles.cellHeader}>Показ.</Text>
                        <Text style={styles.cellHeader}>Расход</Text>
                        <Text style={styles.cellHeader}>Сумма</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.cell}>
                            {new Date(data?.previous_check_date).toLocaleDateString("ru-RU")}
                        </Text>
                        <Text style={styles.cell}>{data?.previous_check}</Text>
                        <Text style={styles.cell}>{data?.consumption}</Text>
                        <Text style={styles.cell}>
                            {(data?.consumption * data?.tariff.kw_cost).toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.cell}>
                            {new Date(data?.current_check_date).toLocaleDateString("ru-RU")}
                        </Text>
                        <Text style={styles.cell}>{data?.current_check}</Text>
                        <Text style={styles.cell}>{data?.consumption}</Text>
                        <Text style={styles.cell}>
                            {(data?.consumption * data?.tariff.kw_cost).toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.rowHeader}>
                        <Text style={styles.cellHeader}>Дни</Text>
                        <Text style={styles.cellHeader}>Тариф</Text>
                        <Text style={styles.cellHeader}>Расход</Text>
                        <Text style={styles.cellHeader}>Сумма</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.cell}>{data?.period_day_count}</Text>
                        <Text style={styles.cell}>{data?.tariff.kw_cost}</Text>
                        <Text style={styles.cell}>{data?.consumption}</Text>
                        <Text style={styles.cell}>
                            {(data?.consumption * data?.tariff.kw_cost).toFixed(2)}
                        </Text>
                    </View>
                </View>

                {data?.counter_photo ? (
                    <TouchableOpacity
                        style={{
                            marginTop: 20,
                            alignItems: "center",
                            backgroundColor: "#f3f3f3",
                            paddingBottom: 10,
                            flex: 1,
                            borderRadius: 10,
                        }}
                    >
                        <Text style={[styles.infoText, { marginBottom: 5 }]}>Фото счетчика:</Text>
                        <Image
                            source={{
                                uri: `http://34.63.218.55${data.counter_photo}`,
                            }}
                            style={{ width: 250, height: 200, resizeMode: "contain", borderRadius: 10 }}
                        />
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.infoText}>Фото счетчика отсутствует</Text>
                )}

                <View style={styles.summary}>
                    <Text style={styles.infoText}>
                        Показание по фото: <Text style={styles.bold}>{data?.counter_current_check}</Text>
                    </Text>
                    <Text style={styles.infoText}>
                        Дата записи:{" "}
                        {new Date(data?.created_at).toLocaleString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                    <Text style={styles.infoText}>
                        Обновлено:{" "}
                        {new Date(data?.updated_at).toLocaleString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                    <Text style={styles.summaryText}>
                        Переплата(-)/Недоплата:{" "}
                        <Text style={styles.bold}>{data?.house_card.overpayment_underpayment} сом</Text>
                    </Text>
                    <Text style={styles.summaryText}>
                        К оплате за эл.эн.: <Text style={styles.bold}>{data?.pay_for_electricity} сом</Text>
                    </Text>
                    <Text style={styles.summaryText}>
                        Пеня: <Text style={styles.bold}>{data?.house_card.penalty} сом</Text>
                    </Text>
                    <Text style={styles.total}>
                        Итого к оплате: <Text style={styles.boldRed}>{data?.total_sum} сом</Text>
                    </Text>
                </View>
            </View>

            <Chart />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    container: {
        flex: 1,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
        marginTop: 10,
    },
    orgName: {
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
        color: "#FF7A00",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    infoText: {
        fontSize: 13,
        color: "#555",
        marginBottom: 4,
    },
    bold: {
        fontWeight: "600",
        color: "#FEA94B",
    },
    table: {
        marginTop: 10,
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    rowHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#F3F3F3",
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
    },
    cellHeader: {
        flex: 1,
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
    },
    cell: {
        flex: 1,
        textAlign: "center",
        fontSize: 12,
        color: "#444",
    },
    summary: {
        marginTop: 16,
        backgroundColor: "#F9F9F9",
        borderRadius: 10,
        padding: 10,
    },
    summaryText: {
        fontSize: 13,
        color: "#333",
        marginBottom: 4,
    },
    total: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 4,
    },
    boldRed: {
        color: "#FEA94B",
        fontWeight: "700",
    },
    footerText: {
        fontSize: 11,
        textAlign: "center",
        color: "#888",
        marginTop: 12,
        fontStyle: "italic",
    },
});
