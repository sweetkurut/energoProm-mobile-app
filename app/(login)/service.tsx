import ArrowRightIcon from "@/assets/icons/ArrowRightIcon";
import RequestCard from "@/components/RequestCard";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchBids } from "@/store/slices/bidSlice";
import { fetchDeals } from "@/store/slices/dealsSlice";
import { router } from "expo-router";
import { Wrench } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ServiceListScreen = () => {
    const [tabs, setTabs] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useAppDispatch();
    const { bids, loading } = useAppSelector((state) => state.bids);
    const { deals } = useAppSelector((state) => state.deals);

    const loadData = useCallback(async () => {
        await dispatch(fetchBids());
        await dispatch(fetchDeals());
    }, [dispatch]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [loadData]);

    const goToCreate = (bidId: number) => {
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
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => goToCreate(item.id)}
                            key={item.id}
                        >
                            <View style={styles.cardTitles}>
                                <View style={styles.iconWrap}>
                                    <Wrench />
                                </View>
                                <View>
                                    <Text style={styles.cardtitle}>{item.name}</Text>
                                    <Text style={styles.cardSubtitle}>{item.description}</Text>
                                </View>
                            </View>
                            <ArrowRightIcon />
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <>
                    {deals?.map((item) => {
                        if (!bids) return null;

                        const bidDetails = bids.find((bid) => bid.id === item.bid);
                        if (!bidDetails) return null;

                        const formattedDate = new Date(item.date_of_deal).toLocaleDateString("ru-RU", {
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
                                title={bidDetails.name}
                                date={formattedDate}
                                desc={item.description}
                                address={item.address}
                                planDate={formattedDate}
                                status={statusMap[item.status as keyof typeof statusMap] || "Неизвестно"}
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
        width: 270,
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
