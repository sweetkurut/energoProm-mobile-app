import ArrowRightIcon from "@/assets/icons/ArrowRightIcon";
import CounterIcon from "@/assets/icons/CounterIcon";
import RequestCard from "@/components/RequestCard";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchBids } from "@/store/slices/bidSlice";
import { fetchDeals } from "@/store/slices/dealsSlice";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ServiceListScreen = () => {
    const [tabs, setTabs] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const { bids, loading } = useAppSelector((state) => state.bids);
    const { deals } = useAppSelector((state) => state.deals);

    useEffect(() => {
        dispatch(fetchBids());
        dispatch(fetchDeals());
    }, [dispatch]);

    const goToCreate = (bidId: number) => {
        // Передаем id услуги в URL
        router.push({
            pathname: "/(login)/createRequest",
            params: { bidId: bidId },
        });
    };

    if (loading)
        return (
            <View style={styles.loader}>
                <ActivityIndicator size={"large"} color={"#EA961C"} />
            </View>
        );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tabButton, !tabs && styles.activeTab]}
                    onPress={() => setTabs(false)}
                >
                    <Text style={[styles.tabText, !tabs && styles.activeText]}>Услуги</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, tabs && styles.activeTab]}
                    onPress={() => setTabs(true)}
                >
                    <Text style={[styles.tabText, tabs && styles.activeText]}>Мои заявки</Text>
                </TouchableOpacity>
            </View>

            {!tabs ? (
                <View style={styles.cards}>
                    {bids?.map((item) => (
                        <>
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => goToCreate(item.id)}
                                key={item.id}
                            >
                                <View style={styles.cardTitles}>
                                    <View style={styles.iconWrap}>
                                        <CounterIcon />
                                    </View>
                                    <View>
                                        <Text style={styles.cardtitle}>{item.name}</Text>
                                        <Text style={styles.cardSubtitle}>{item.description}</Text>
                                    </View>
                                </View>
                                <ArrowRightIcon />
                            </TouchableOpacity>
                        </>
                    ))}

                    {/* <TouchableOpacity style={styles.card} onPress={goToCreate}>
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
                                <Text style={styles.cardSubtitle}>
                                    Ремонт или замена неисправного счетчика
                                </Text>
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
                                <Text style={styles.cardSubtitle}>
                                    Подключение нового объекта к элетросети
                                </Text>
                            </View>
                        </View>
                        <ArrowRightIcon />
                    </TouchableOpacity> */}
                </View>
            ) : (
                <>
                    {deals?.map((item) => {
                        const bidDetails = bids.find((bid) => bid.id === item.bid);
                        if (!bidDetails) return null;

                        // Правильное форматирование даты
                        const formattedDate = new Date(item.created_at).toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });

                        const statusMap = {
                            new: "Новая",
                            "in progress": "В работе",
                            completed: "Выполнена",
                            cancelled: "Отменена",
                        };

                        return (
                            <RequestCard
                                key={item.id}
                                id={item.id}
                                title={bidDetails.name} // Получаем название из bid
                                date={formattedDate} // Используем created_at из deal
                                desc={item.description} // Используем описание из deal
                                address={item.address} // Используем адрес из deal
                                planDate={formattedDate} // У вас пока нет этих данных, возможно, они будут в будущем ответе API
                                status={statusMap[item.status] || "Неизвестно"} // Получаем статус из deal
                                // status={item.status}
                            />
                        );
                    })}
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

    loader: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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
