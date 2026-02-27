import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchLastCheck, updateCheckPhoto } from "@/store/slices/checkSlice";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { PhotoUploader } from "./PhotoUploader";

export default function DetailCheckScreen() {
    const { id } = useLocalSearchParams();
    // const numericId = Number(id);
    const { check, loading } = useAppSelector((state) => state.check);
    const data = check;
    console.log(data);

    const dispatch = useAppDispatch();

    const [currentCheckValue, setCurrentCheckValue] = useState<string>("");
    const [photoFile, setPhotoFile] = useState<any>(null);

    useEffect(() => {
        if (id) {
            const houseCardId = Number(id);
            dispatch(fetchLastCheck(houseCardId));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (data?.counter_current_check) {
            setCurrentCheckValue(data.counter_current_check.toString());
        }
    }, [data]);

    useEffect(() => {
        if (data) {
            console.log("📊 Data for Chart:", {
                check_id: data.id,
                house_card_id: data.house_card?.id,
                house_card_data: data.house_card,
                house_card_number: data.house_card?.house_card,
                has_route: !!data.house_card?.route,
                route_data: data.house_card?.route,
            });
        }
    }, [data]);

    const handleUpdate = async () => {
        if (!data || !currentCheckValue) {
            Alert.alert("Ошибка", "Заполните показания счетчика.");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("counter_current_check", currentCheckValue.toString());

            if (photoFile) {
                formData.append("counter_photo", {
                    uri: photoFile.uri,
                    name: photoFile.name || "counter.jpg",
                    type: photoFile.type || "image/jpeg",
                } as any);
            }

            await dispatch(updateCheckPhoto({ id: data.id, formData })).unwrap();

            Alert.alert("Успех", "Данные успешно отправлены!");
            setTimeout(() => router.back(), 500);
        } catch (error) {
            console.error("Ошибка обновления данных:", error);
            Alert.alert("Ошибка", "Не удалось обновить данные.");
        }
    };

    if (loading || !data || !data.house_card) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size={"large"} color={"#EA961C"} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                {/* Основная информация */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionLabel}>Л/счет:</Text>
                    <Text style={styles.sectionValue}>{data?.house_card.house_card}</Text>
                </View>

                {/* Инспектор - с проверкой на null */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionLabel}>Инспектор:</Text>
                    <Text style={styles.sectionValue}>
                        {data?.house_card.route?.executor?.name
                            ? data.house_card.route.executor.name
                            : "Не назначен"}
                    </Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionLabel}>Ф.И.О.:</Text>
                    <Text style={styles.sectionValue}>{data?.username?.name || "Не указано"}</Text>
                </View>

                {/* Маршрут - с проверкой на null */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionLabel}>Маршрут:</Text>
                    <Text style={styles.sectionValue}>
                        {data?.house_card.route?.route_number
                            ? `№ ${data.house_card.route.route_number}`
                            : "Не назначен"}
                    </Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionLabel}>Тариф:</Text>
                    <Text style={styles.sectionValue}>
                        {data?.tariff?.name
                            ? `${data.tariff.name} (${data.tariff.kw_cost} кВт*ч)`
                            : "Тариф не установлен"}
                    </Text>
                </View>

                {/* Адрес - с проверкой на наличие адреса */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionLabel}>Адрес:</Text>
                    <Text style={styles.sectionValue}>
                        {data?.house_card.address
                            ? `${data.house_card.address.street?.name || "Улица не указана"} ${
                                  data.house_card.address.house || ""
                              }, кв. ${data.house_card.address.apartment || ""}`
                            : "Адрес не указан"}
                    </Text>
                </View>

                {/* Таблица показаний */}
                <View style={styles.tableSection}>
                    <Text style={styles.sectionTitle}>Показания и начисления</Text>

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderCell}>Дата</Text>
                            <Text style={styles.tableHeaderCell}>Показ.</Text>
                            <Text style={styles.tableHeaderCell}>Расход</Text>
                            <Text style={styles.tableHeaderCell}>Сумма</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>
                                {data?.previous_check_date
                                    ? new Date(data.previous_check_date).toLocaleDateString("ru-RU")
                                    : "-"}
                            </Text>
                            <Text style={styles.tableCell}>{data?.previous_check || "-"}</Text>
                            <Text style={styles.tableCell}>{data?.consumption || "0.00"}</Text>
                            <Text style={styles.tableCell}>
                                {data?.consumption && data?.tariff?.kw_cost
                                    ? (
                                          parseFloat(data.consumption) * parseFloat(data.tariff.kw_cost)
                                      ).toFixed(2)
                                    : "0.00"}
                            </Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>
                                {data?.current_check_date
                                    ? new Date(data.current_check_date).toLocaleDateString("ru-RU")
                                    : "-"}
                            </Text>
                            <Text style={styles.tableCell}>{data?.current_check || "-"}</Text>
                            <Text style={styles.tableCell}>{data?.consumption || "0.00"}</Text>
                            <Text style={styles.tableCell}>
                                {data?.consumption && data?.tariff?.kw_cost
                                    ? (
                                          parseFloat(data.consumption) * parseFloat(data.tariff.kw_cost)
                                      ).toFixed(2)
                                    : "0.00"}
                            </Text>
                        </View>

                        <View style={styles.tableDivider} />

                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderCell}>Дни</Text>
                            <Text style={styles.tableHeaderCell}>Тариф</Text>
                            <Text style={styles.tableHeaderCell}>Расход</Text>
                            <Text style={styles.tableHeaderCell}>Сумма</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>{data?.period_day_count || "0"}</Text>
                            <Text style={styles.tableCell}>{data?.tariff?.kw_cost || "0.00"}</Text>
                            <Text style={styles.tableCell}>{data?.consumption || "0.00"}</Text>
                            <Text style={styles.tableCell}>
                                {data?.consumption && data?.tariff?.kw_cost
                                    ? (
                                          parseFloat(data.consumption) * parseFloat(data.tariff.kw_cost)
                                      ).toFixed(2)
                                    : "0.00"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Фото счетчика или форма отправки */}
                {data?.counter_photo ? (
                    <View style={styles.photoSection}>
                        <View style={styles.photoContainer}>
                            <Image
                                source={{
                                    uri: data.counter_photo.startsWith("http")
                                        ? data.counter_photo
                                        : `https://flagman-backend.com.kg${data.counter_photo}`,
                                }}
                                style={styles.photo}
                                resizeMode="cover"
                                onError={(e) => console.log("Image error:", e.nativeEvent.error)}
                            />
                            <View style={styles.photoStatus}>
                                <Feather name="check-circle" size={16} color="#4CAF50" />
                                <Text style={styles.photoStatusText}>Фото отправлено</Text>
                            </View>
                        </View>

                        <View style={styles.readingInfo}>
                            <Text style={styles.readingLabel}>Показание по фото:</Text>
                            <Text style={styles.readingValue}>
                                {data?.counter_current_check || "Не указано"}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.uploadSection}>
                        <PhotoUploader photoUrl={data?.counter_photo} onPhotoSelected={setPhotoFile} />

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Показание счетчика (кВт*ч):</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={currentCheckValue}
                                onChangeText={setCurrentCheckValue}
                                placeholder="Введите показания"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                currentCheckValue ? styles.submitButtonActive : styles.submitButtonDisabled,
                            ]}
                            onPress={handleUpdate}
                            disabled={!currentCheckValue}
                        >
                            <Text style={styles.submitButtonText}>Отправить показания</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Сводка по оплате */}
                <View style={styles.paymentSummary}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Показание по фото:</Text>
                        <Text style={styles.summaryValue}>{data?.counter_current_check || "Не указано"}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Дата записи:</Text>
                        <Text style={styles.summaryValue}>
                            {data?.created_at
                                ? new Date(data.created_at).toLocaleString("ru-RU", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : "-"}
                        </Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Обновлено:</Text>
                        <Text style={styles.summaryValue}>
                            {data?.updated_at
                                ? new Date(data.updated_at).toLocaleString("ru-RU", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : "-"}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Переплата(-)/Недоплата:</Text>
                        <Text style={styles.summaryValue}>
                            {data?.house_card.overpayment_underpayment || "0"} сом
                        </Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>К оплате за эл.эн.:</Text>
                        <Text style={styles.summaryValue}>{data?.pay_for_electricity || "0.00"} сом</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Пеня:</Text>
                        <Text style={styles.summaryValue}>{data?.house_card.penalty || "0"} сом</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Итого к оплате:</Text>
                        <Text style={styles.totalAmount}>{data?.total_sum || "0.00"} сом</Text>
                    </View>
                </View>
            </View>

            {/* {data.house_card?.house_card && (
                <>
                    <Text style={{ color: "red", margin: 16 }}>
                        Передаём в график: {data.house_card.house_card} (тип:{" "}
                        {typeof data.house_card.house_card})
                    </Text>
                    <Chart id={data.house_card.id} />
                </>
            )} */}
            {/* График - только если есть house_card */}
            {/* {data.house_card?.house_card && <Chart id={data.house_card.id} />} */}
            {/* {data?.house_card?.id ? (
                <Chart id={data.house_card.id} />
            ) : data?.house_card ? (
                <View style={{ padding: 20, backgroundColor: "#fff3cd", borderRadius: 8, margin: 16 }}>
                    <Text style={{ color: "#856404" }}>
                        Нет подходящего ID для графика{"\n"}
                        Доступные поля в house_card:{"\n"}
                        {Object.keys(data.house_card).join(", ")}
                    </Text>
                </View>
            ) : null} */}
            {/* <Chart id={data.house_card.house_card} /> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    noDataText: {
        color: "#666",
        fontStyle: "italic",
        fontSize: 14,
    },
    warningText: {
        color: "#FF8C00",
        fontSize: 14,
    },

    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 10,
        marginVertical: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    infoSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },

    sectionLabel: {
        fontSize: 14,
        color: "#6C757D",
        fontWeight: "500",
        flex: 1,
    },

    sectionValue: {
        fontSize: 14,
        color: "#333",
        fontWeight: "600",
        flex: 1,
        textAlign: "right",
    },

    tableSection: {
        marginTop: 20,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333",
        marginBottom: 12,
    },

    table: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E9ECEF",
        overflow: "hidden",
    },

    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#F8F9FA",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E9ECEF",
    },

    tableHeaderCell: {
        flex: 1,
        textAlign: "center",
        fontSize: 12,
        fontWeight: "600",
        color: "#495057",
    },

    tableRow: {
        flexDirection: "row",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F8F9FA",
    },

    tableCell: {
        flex: 1,
        textAlign: "center",
        fontSize: 12,
        color: "#6C757D",
        fontWeight: "500",
    },

    tableDivider: {
        height: 1,
        backgroundColor: "#E9ECEF",
        marginVertical: 8,
    },

    photoSection: {
        marginTop: 20,
    },

    photoContainer: {
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#E8F5E8",
        marginBottom: 16,
    },

    photo: {
        width: "100%",
        height: 200,
        backgroundColor: "#F5F5F5",
    },

    photoStatus: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E8F5E8",
        paddingVertical: 8,
        gap: 6,
    },

    photoStatusText: {
        color: "#2E7D32",
        fontSize: 14,
        fontWeight: "600",
    },

    readingInfo: {
        backgroundColor: "#F8F9FA",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E9ECEF",
    },

    readingLabel: {
        fontSize: 14,
        color: "#6C757D",
        marginBottom: 4,
    },

    readingValue: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },

    uploadSection: {
        marginTop: 20,
    },

    inputGroup: {
        marginBottom: 16,
    },

    inputLabel: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
    },

    input: {
        height: 48,
        borderColor: "#E1E1E1",
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "#FAFAFA",
        color: "#333",
    },

    submitButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 8,
    },

    submitButtonActive: {
        backgroundColor: Colors.BUTTONSERVICE,
    },

    submitButtonDisabled: {
        backgroundColor: "#CCCCCC",
    },

    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    paymentSummary: {
        marginTop: 20,
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E9ECEF",
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
    },

    summaryLabel: {
        fontSize: 14,
        color: "#6C757D",
        fontWeight: "500",
    },

    summaryValue: {
        fontSize: 14,
        color: "#333",
        fontWeight: "600",
    },

    divider: {
        height: 1,
        backgroundColor: "#E9ECEF",
        marginVertical: 8,
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#E9ECEF",
        paddingTop: 12,
    },

    totalLabel: {
        fontSize: 16,
        color: "#333",
        fontWeight: "600",
    },

    totalAmount: {
        fontSize: 18,
        color: Colors.ORANGE_COLOR,
        fontWeight: "700",
    },
});
