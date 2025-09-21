import ArrowRightIcon from "@/assets/icons/ArrowRightIcon";
import RequestCard from "@/components/RequestCard";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchBids } from "@/store/slices/bidSlice";
import { fetchDeals } from "@/store/slices/dealsSlice";
import { router } from "expo-router";
import { Wrench } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Bid {
    id: number;
    name: string;
    description: string;
}

interface DealDetails {
    id: number;
    title: string;
    planDate: string;
    status: string;
    address: string;
    description: string;
}

const ServiceListScreen = () => {
    const [activeTab, setActiveTab] = useState("services");
    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useAppDispatch();
    const { bids, loading: bidsLoading } = useAppSelector((state) => state.bids);
    const { deals, loading: dealsLoading } = useAppSelector((state) => state.deals);

    // Мемоизируем функцию загрузки
    const loadData = useCallback(async () => {
        try {
            await Promise.all([dispatch(fetchBids()), dispatch(fetchDeals())]);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Мемоизируем функцию обновления
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [loadData]);

    // Мемоизируем функцию перехода
    const goToCreate = useCallback((bidId: number) => {
        router.push({
            pathname: "/(login)/createRequest",
            params: { bidId: bidId },
        });
    }, []);

    const memoizedDeals: DealDetails[] = useMemo(() => {
        if (!deals || !bids) {
            return [];
        }
        const statusMap = {
            new: "Новая",
            "in progress": "В работе",
            completed: "Выполнена",
            cancelled: "Отменена",
        };

        return deals
            .map((item) => {
                const bidDetails = bids.find((bid) => bid.id === item.bid);
                if (!bidDetails) return null;

                const formattedDate = new Date(item.date_of_deal).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });

                return {
                    ...item,
                    title: bidDetails.name,
                    planDate: formattedDate,
                    status: statusMap[item.status as keyof typeof statusMap] || "Неизвестно",
                } as DealDetails;
            })
            .filter((item): item is DealDetails => item !== null);
    }, [deals, bids]);

    // Проверка на общую загрузку
    const isLoading = bidsLoading || dealsLoading;
    if (isLoading && !bids?.length && !deals?.length) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#EA961C" />
            </View>
        );
    }

    // Мемоизируем массив сделок, чтобы избежать лишних вычислений внутри FlatList

    // Рендер элементов списка услуг
    const renderBidItem = ({ item }: { item: Bid }) => (
        <TouchableOpacity style={styles.card} onPress={() => goToCreate(item.id)}>
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
    );

    // Рендер элементов списка заявок
    const renderDealItem = ({ item }: { item: (typeof memoizedDeals)[0] | null }) => {
        if (!item) {
            return null; // Если элемент почему-то null, ничего не рендерим
        }

        return (
            <RequestCard
                key={item.id}
                id={item.id}
                title={item.title}
                date={item.planDate}
                desc={item.description}
                address={item.address}
                planDate={item.planDate}
                status={item.status}
            />
        );
    };

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
                    style={[styles.tabButton, activeTab === "services" && styles.activeTab]}
                    onPress={() => setActiveTab("services")}
                >
                    <Text style={[styles.tabText, activeTab === "services" && styles.activeText]}>
                        Услуги
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "deals" && styles.activeTab]}
                    onPress={() => setActiveTab("deals")}
                >
                    <Text style={[styles.tabText, activeTab === "deals" && styles.activeText]}>
                        Мои заявки
                    </Text>
                </TouchableOpacity>
            </View>

            {activeTab === "services" ? (
                <View style={styles.cards}>
                    <FlatList
                        data={bids}
                        renderItem={renderBidItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            ) : (
                <View style={styles.cards}>
                    <FlatList
                        data={memoizedDeals}
                        renderItem={renderDealItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            )}
        </ScrollView>
    );
};

export default ServiceListScreen;

const styles = StyleSheet.create({    // Добавь другие поля, если они есть

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
        marginBottom: 10,
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
