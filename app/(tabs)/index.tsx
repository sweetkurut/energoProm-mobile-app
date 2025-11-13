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

import { previewPayment } from "@/store/slices/paymentSlice";
import dayjs from "dayjs";

export default function HomeScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useAppDispatch();
    const { house, loading } = useAppSelector((state) => state.house);
    const { profile } = useAppSelector((state) => state.profile);
    const { preview } = useAppSelector((state) => state.payment);

    useEffect(() => {
        dispatch(fetchHouseCard());
    }, [dispatch]);

    useEffect(() => {
        if (house && house.length > 0) {
            loadPaymentPreview();
        }
    }, [house]);

    const loadPaymentPreview = async () => {
        if (!house || house.length === 0) return;

        try {
            const firstHouse = house[0];
            await dispatch(
                previewPayment({
                    houseCardId: firstHouse.id, //
                    requisite: firstHouse.house_card?.toString() || "",
                    sum: firstHouse.house_card,
                })
            ).unwrap();
        } catch (error) {
            console.error("Ошибка загрузки предпросмотра платежа:", error);
        }
    };

    const goToNotification = () => {
        router.push("/(notification)/notification");
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(fetchHouseCard())
            .then(() => {
                loadPaymentPreview();
                setRefreshing(false);
            })
            .catch(() => setRefreshing(false));
    }, []);

    const getPaymentAmount = () => {
        if (preview.previewData) {
            return preview.previewData.total_with_comission.toString();
        }
        return "0"; // Пока не загрузилось
    };

    const onPay = () => {
        if (house && house.length > 0) {
            const firstHouse = house[0];
            router.push({
                pathname: "/(payment)/payment",   
                params: {
                    houseCardId: firstHouse.id.toString(),
                    houseCardNumber: firstHouse.house_card?.toString() || "",
                    // НЕ передаем amount - он загрузится через preview
                },
            });
        }
    };

    const goToDetail = (id: number) => {
        router.push(`/listing/check/${id}`);
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

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // justifyContent: "space-between",
                    // marginBottom: 10,
                    marginHorizontal: 10,
                }}
            >
                <Feather name="bar-chart" size={24} color={Colors.ORANGE_COLOR} />
                <Text style={styles.textCountNumber}>Мои лицевые счета</Text>
            </View>

            {house && house.length > 0 ? (
                house.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.houseCard}
                        onPress={() => goToDetail(item.house_card)}
                    >
                        <View style={styles.houseCardHeader}>
                            <View style={styles.iconRow}>
                                <Feather name="bookmark" size={16} color={Colors.ORANGE_COLOR} />
                                <Text style={styles.accountNumber}>Л/с: {item.house_card}</Text>
                            </View>

                            <View style={styles.iconRow}>
                                <Feather name="activity" size={16} color={Colors.ORANGE_COLOR} />
                                <Text style={styles.tariff}>{item.tariff?.kw_cost} кВт*ч</Text>
                            </View>
                        </View>

                        <View style={styles.houseCardBody}>
                            <View style={styles.iconRow}>
                                <Feather name="home" size={16} color={Colors.ORANGE_COLOR} />
                                <Text style={styles.address}>
                                    {item.address?.street?.name}
                                    {item.address?.apartment}{" "}
                                    {item.address?.apartment_liter && `(${item.address.apartment_liter})`}
                                </Text>
                            </View>

                            <View style={styles.iconRow}>
                                <Feather name="zap" size={16} color={Colors.ORANGE_COLOR} />
                                <Text style={styles.indication}>
                                    Показания:
                                    <Text style={styles.indicationValue}>
                                        {" "}
                                        {item.tariff?.kw_cost ?? "-"} кВт*ч
                                    </Text>
                                </Text>
                            </View>

                            <View style={styles.iconRow}>
                                <Feather name="calendar" size={16} color={Colors.ORANGE_COLOR} />
                                <Text style={styles.date}>
                                    {item.contract_date
                                        ? dayjs(item.contract_date).format("DD.MM.YYYY")
                                        : "-"}
                                </Text>
                            </View>
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
                            style={{ marginBottom: 10 }}
                        />
                        <Text style={styles.noDataTitle}>Лицевые счета отсутствуют</Text>
                        <Text style={styles.noDataSubtitle}>
                            Пока у вас нет зарегистрированных лицевых счетов. Обратитесь в поддержку для
                            получения информации.
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.check}>
                <View>
                    <Text style={styles.check_title}>Текущий счёт</Text>
                    <Text style={styles.check_balance}>
                        {preview.loading ? (
                            <ActivityIndicator size="small" color="#EA961C" />
                        ) : (
                            `${getPaymentAmount()} сом`
                        )}
                    </Text>
                    <Text style={styles.check_span}>Оплатить до 25 числа текущего месяца</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={onPay}>
                    <Text style={styles.button_text}>Оплатить</Text>
                </TouchableOpacity>
            </View>

            <CardServices />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    textCountNumber: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 16,
        color: Colors.GRAY_COLOR,
        fontWeight: 400,
        marginHorizontal: 10,
    },

    noDataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    noDataCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        width: "100%",
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
        color: Colors.GRAY_COLOR,
        textAlign: "center",
    },

    loader: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    houseCard: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        marginVertical: 10,
        marginHorizontal: 10,
    },
    // houseCard: {
    //     backgroundColor: "#fff",
    //     borderRadius: 12,
    //     padding: 14,
    //     marginVertical: 8,
    //     marginHorizontal: 12,
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,
    //     elevation: 3,
    // },

    houseCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    iconRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
    },

    accountNumber: {
        fontSize: 16,
        color: Colors.GRAY_COLOR,
        fontWeight: 400,
    },

    tariff: {
        fontSize: 14,
        color: Colors.ORANGE_COLOR,
        fontWeight: 700,
    },

    houseCardBody: {
        marginTop: 4,
    },

    address: {
        fontSize: 15,
        color: Colors.GRAY_COLOR,
        fontWeight: 400,
        marginBottom: 4,
    },

    indication: {
        fontSize: 14,
        color: "#666",
    },

    indicationValue: {
        color: Colors.GRAY_COLOR,
        fontWeight: 400,
    },

    date: {
        fontSize: 14,
        color: "#aaa",
        // marginTop: 6,
    },

    container: {
        flex: 1,
    },

    header: {
        backgroundColor: Colors.HEADER,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 120,
        width: "auto",
        paddingHorizontal: 15,
        paddingTop: 40,
        position: "fixed",
    },

    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    welcomeText: {
        fontSize: 14,
        fontWeight: 400,
        color: Colors.WHITE_COLOR,
    },

    nameText: {
        fontSize: 24,
        fontWeight: 600,
        color: Colors.WHITE_COLOR,
    },

    balance: {
        fontSize: 12,
        fontWeight: 400,
        color: Colors.WHITE_COLOR,
    },

    iconWrapper: {
        backgroundColor: "#fff",
        borderRadius: "50%",
        padding: 10,
        // marginBottom: 10,
        height: 40,
        width: 40,
    },

    check: {
        backgroundColor: Colors.WHITE_COLOR,
        marginHorizontal: 10,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderColor: Colors.BUTTONSERVICE,
    },

    check_title: {
        color: Colors.GRAY_COLOR,
        fontSize: 14,
    },

    check_balance: {
        fontSize: 22,
        fontWeight: 700,
        color: Colors.HEADER,
    },

    check_span: {
        color: "#9B9EA1",
        fontSize: 12,
    },

    button: {
        backgroundColor: Colors.BUTTONSERVICE,
        padding: 12,
        borderRadius: 5,
    },

    button_text: {
        color: Colors.WHITE_COLOR,
        fontWeight: 500,
        fontSize: 12,
    },

    buttonDisabled: {
        opacity: 0.6,
    },
});
