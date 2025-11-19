import NotificationIcon from "@/assets/icons/NotificationIcon";
import CardServices from "@/components/CardServices";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchHouseCard } from "@/store/slices/housecardSlice";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { fetchLastCheck } from "@/store/slices/checkSlice";
import { previewPayment } from "@/store/slices/paymentSlice";
import dayjs from "dayjs";

export default function HomeScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useAppDispatch();
    const { house, loading } = useAppSelector((state) => state.house);
    const { profile } = useAppSelector((state) => state.profile);
    const { preview } = useAppSelector((state) => state.payment);
    const { data: lastCheck, loading: lastCheckLoading } = useAppSelector((state) => state.check);

    useEffect(() => {
        dispatch(fetchHouseCard());
    }, [dispatch]);

    useEffect(() => {
        if (house && house.length > 0) {
            loadPaymentPreview();

            loadLastCheck();
        }
    }, [house]);

    const loadPaymentPreview = async () => {
        if (!house || house.length === 0) return;

        try {
            const firstHouse = house[0];
            await dispatch(
                previewPayment({
                    houseCardId: firstHouse.id,
                    requisite: firstHouse.house_card?.toString() || "",
                    sum: firstHouse.house_card,
                })
            ).unwrap();
        } catch (error) {
            console.error("Ошибка загрузки предпросмотра платежа:", error);
        }
    };

    const loadLastCheck = () => {
        if (!house || house.length === 0) return;

        const firstHouse = house[0];
        dispatch(fetchLastCheck(firstHouse.id));
    };

    const goToNotification = () => {
        router.push("/(notification)/notification");
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(fetchHouseCard())
            .then(() => {
                loadPaymentPreview();
                loadLastCheck();
                setRefreshing(false);
            })
            .catch(() => setRefreshing(false));
    }, []);

    const getPaymentAmount = () => {
        if (preview.previewData) {
            return preview.previewData.total_with_comission.toString();
        }
        return "0";
    };

    const onPay = () => {
        if (house && house.length > 0) {
            const firstHouse = house[0];
            router.push({
                pathname: "/(payment)/payment",
                params: {
                    houseCardId: firstHouse.id.toString(),
                    houseCardNumber: firstHouse.house_card?.toString() || "",
                },
            });
        }
    };

    const goToDetail = (houseCardNumber: string) => {
        // Переходим на экран с деталями проверки
        router.push(`/listing/check/${houseCardNumber}`);
    };

    const goToLastCheckDetails = () => {
        if (lastCheck && house && house.length > 0) {
            const firstHouse = house[0];
            router.push(`/listing/check/${firstHouse.house_card}`);
        }
    };

    const renderLastCheckStatus = () => {
        if (lastCheckLoading) {
            return (
                <View style={styles.lastCheckContainer}>
                    <ActivityIndicator size="small" color="#EA961C" />
                    <Text style={styles.lastCheckText}>Загрузка данных проверки...</Text>
                </View>
            );
        }

        if (lastCheck) {
            return (
                <TouchableOpacity
                    style={[styles.lastCheckContainer, styles.lastCheckSuccess]}
                    onPress={goToLastCheckDetails}
                >
                    <Feather name="check-circle" size={16} color="#28a745" />
                    <Text style={styles.lastCheckText}>
                        Последняя проверка: {dayjs(lastCheck.created_at).format("DD.MM.YYYY")}
                    </Text>
                    <Feather name="chevron-right" size={16} color="#666" />
                </TouchableOpacity>
            );
        }

        if (!lastCheckLoading && house && house.length > 0) {
            return (
                <View style={[styles.lastCheckContainer, styles.lastCheckEmpty]}>
                    <Feather name="alert-circle" size={16} color="#ffc107" />
                    <Text style={styles.lastCheckText}>Проверки не проводились</Text>
                </View>
            );
        }

        return null;
    };

    if (loading)
        return (
            <View style={styles.loader}>
                <ActivityIndicator size={"large"} color={"#EA961C"} />
            </View>
        );

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#EA961C"]}
                    tintColor="#EA961C"
                />
            }
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Добро пожаловать!</Text>
                    <Text style={styles.nameText}>{profile ? profile.name : "Загрузка..."}</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconWrapper} onPress={goToNotification}>
                        <NotificationIcon />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Секция статуса последней проверки */}
            {/* {house && house.length > 0 && renderLastCheckStatus()} */}

            <View style={styles.sectionHeader}>
                <Feather name="bar-chart" size={24} color={Colors.ORANGE_COLOR} />
                <Text style={styles.sectionTitle}>Мои лицевые счета</Text>
            </View>

            {house && house.length > 0 ? (
                house.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.houseCard}
                        onPress={() => goToDetail(item.house_card)}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.iconRow}>
                                <Feather name="bookmark" size={16} color={Colors.ORANGE_COLOR} />
                                <Text style={styles.accountNumber}>Л/с: {item.house_card}</Text>
                            </View>

                            <View style={styles.iconRow}>
                                <Feather name="activity" size={16} color={Colors.ORANGE_COLOR} />
                                <Text style={styles.tariff}>{item.tariff?.kw_cost} кВт*ч</Text>
                            </View>
                        </View>

                        <View style={styles.cardBody}>
                            <View style={styles.infoRow}>
                                <Feather name="home" size={16} color={Colors.ORANGE_COLOR} />
                                <Text style={styles.address}>
                                    {item.address?.street?.name}
                                    {item.address?.apartment}{" "}
                                    {item.address?.apartment_liter && `(${item.address.apartment_liter})`}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Feather name="zap" size={16} color={Colors.ORANGE_COLOR} />
                                <Text style={styles.indication}>
                                    Показания:{" "}
                                    <Text style={styles.indicationValue}>
                                        {item.tariff?.kw_cost ?? "-"} кВт*ч
                                    </Text>
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Feather name="calendar" size={16} color={Colors.ORANGE_COLOR} />
                                <Text style={styles.date}>
                                    {item.contract_date
                                        ? dayjs(item.contract_date).format("DD.MM.YYYY")
                                        : "-"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.paymentSection}>
                            <View style={styles.paymentInfo}>
                                <Text style={styles.paymentTitle}>Текущий счёт</Text>
                                <Text style={styles.paymentAmount}>
                                    {preview.loading ? (
                                        <ActivityIndicator size="small" color="#EA961C" />
                                    ) : (
                                        `${getPaymentAmount()} сом`
                                    )}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.payButton} onPress={onPay}>
                                <Text style={styles.payButtonText}>Оплатить</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={styles.noDataContainer}>
                    <View style={styles.noDataCard}>
                        <Feather
                            name="info"
                            size={40}
                            color={Colors.ORANGE_COLOR}
                            style={styles.noDataIcon}
                        />
                        <Text style={styles.noDataTitle}>Лицевые счета отсутствуют</Text>
                        <Text style={styles.noDataSubtitle}>
                            Пока у вас нет зарегистрированных лицевых счетов. Обратитесь в поддержку для
                            получения информации.
                        </Text>
                    </View>
                </View>
            )}

            <CardServices />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },

    header: {
        backgroundColor: Colors.HEADER,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 120,
        paddingHorizontal: 10,
        paddingTop: 40,
    },

    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    welcomeText: {
        fontSize: 14,
        fontWeight: "400",
        color: Colors.WHITE_COLOR,
    },

    nameText: {
        fontSize: 24,
        fontWeight: "600",
        color: Colors.WHITE_COLOR,
    },

    iconWrapper: {
        backgroundColor: Colors.WHITE_COLOR,
        borderRadius: 20,
        padding: 10,
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 15,
        marginVertical: 15,
    },

    sectionTitle: {
        fontSize: 16,
        color: Colors.GRAY_COLOR,
        fontWeight: "500",
        marginLeft: 10,
    },

    houseCard: {
        backgroundColor: Colors.WHITE_COLOR,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 10,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: Colors.ORANGE_COLOR,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    iconRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    accountNumber: {
        fontSize: 16,
        color: Colors.GRAY_COLOR,
        fontWeight: "500",
    },

    tariff: {
        fontSize: 14,
        color: Colors.ORANGE_COLOR,
        fontWeight: "700",
    },

    cardBody: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },

    address: {
        fontSize: 15,
        color: Colors.GRAY_COLOR,
        fontWeight: "400",
    },

    indication: {
        fontSize: 14,
        color: "#666",
    },

    indicationValue: {
        color: Colors.GRAY_COLOR,
        fontWeight: "500",
    },

    date: {
        fontSize: 14,
        color: "#8E8E8E",
    },

    paymentSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    paymentInfo: {
        flex: 1,
    },

    paymentTitle: {
        color: Colors.GRAY_COLOR,
        fontSize: 14,
        marginBottom: 4,
    },

    paymentAmount: {
        fontSize: 22,
        fontWeight: "700",
        color: Colors.HEADER,
    },

    payButton: {
        backgroundColor: Colors.BUTTONSERVICE,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: "center",
    },

    payButtonText: {
        color: Colors.WHITE_COLOR,
        fontWeight: "600",
        fontSize: 14,
    },

    noDataContainer: {
        padding: 20,
    },

    noDataCard: {
        backgroundColor: Colors.WHITE_COLOR,
        borderRadius: 12,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    noDataIcon: {
        marginBottom: 12,
    },

    noDataTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.GRAY_COLOR,
        marginBottom: 8,
        textAlign: "center",
    },

    noDataSubtitle: {
        fontSize: 14,
        color: "#8E8E8E",
        textAlign: "center",
        lineHeight: 20,
    },

    lastCheckContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: "#f8f9fa",
        borderWidth: 1,
    },
    lastCheckSuccess: {
        borderColor: "#28a745",
        backgroundColor: "#f8fff9",
    },
    lastCheckEmpty: {
        borderColor: "#ffc107",
        backgroundColor: "#fffef0",
    },
    lastCheckText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: "#333",
    },
});
