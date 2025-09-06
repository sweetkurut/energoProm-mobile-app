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

import dayjs from "dayjs";

export default function HomeScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useAppDispatch();
    const { house, loading } = useAppSelector((state) => state.house);
    const { profile } = useAppSelector((state) => state.profile);

    useEffect(() => {
        dispatch(fetchHouseCard());
    }, [dispatch]);

    const goToNotification = () => {
        router.push("/(notification)/notification");
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(fetchHouseCard()).then(() => setRefreshing(false));
    }, [dispatch]);

    const onPay = () => {
        router.push("/(payment)/payment");
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
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Добро пожаловать!</Text>
                    <Text style={styles.nameText}>{profile?.name}</Text>
                </View>
                <View style={styles.headerIcons}>
                    {/* <View style={styles.iconWrapper}>
                        <Text style={styles.language}>Ру</Text>
                    </View> */}
                    <TouchableOpacity style={styles.iconWrapper} onPress={goToNotification}>
                        <NotificationIcon />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.textCountNumber}>Мои лицевые счета</Text>

            {house?.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={styles.houseCard}
                    onPress={() => goToDetail(item.house_card)}
                >
                    <View style={styles.houseCardHeader}>
                        <View style={styles.iconRow}>
                            <Feather name="paperclip" size={16} color={Colors.ORANGE_COLOR} />
                            <Text style={styles.accountNumber}>Л/с: {item.house_card}</Text>
                        </View>

                        <View style={styles.iconRow}>
                            <Feather name="activity" size={16} color={Colors.ORANGE_COLOR} />
                            <Text style={styles.tariff}>{item.tariff?.kw_cost} сом/кВт·ч</Text>
                        </View>
                    </View>

                    <View style={styles.houseCardBody}>
                        <View style={styles.iconRow}>
                            <Feather name="home" size={16} color={Colors.ORANGE_COLOR} />
                            <Text style={styles.address}>
                                {item.address?.street?.name}, {item.address?.house}, кв.{" "}
                                {item.address?.apartment}{" "}
                                {item.address?.apartment_liter && `(${item.address.apartment_liter})`}
                            </Text>
                        </View>

                        <View style={styles.iconRow}>
                            <Feather name="zap" size={16} color={Colors.ORANGE_COLOR} />
                            <Text style={styles.indication}>
                                Показания: <Text style={styles.indicationValue}>— кВт*ч</Text>{" "}
                                {/* Пока нет данных */}
                            </Text>
                        </View>

                        <View style={styles.iconRow}>
                            <Feather name="calendar" size={16} color={Colors.ORANGE_COLOR} />
                            <Text style={styles.date}>{dayjs(item.contract_date).format("DD.MM.YYYY")}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

            <View style={styles.check}>
                <View>
                    <Text style={styles.check_title}>Текущий счёт</Text>
                    <Text style={styles.check_balance}>1225 сом</Text>
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
        fontSize: 13,
        color: "#aaa",
        marginTop: 6,
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
        fontSize: 12,
        fontWeight: 400,
        color: Colors.WHITE_COLOR,
    },

    nameText: {
        fontSize: 18,
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
        fontSize: 16,
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
});
