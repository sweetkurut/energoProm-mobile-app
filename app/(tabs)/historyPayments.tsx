import PaymentsEmptyIcon from "@/assets/icons/PaymentsEmptyIcon";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchPaymentsHistory } from "@/store/slices/paymentSlice";
import { PaymentHistory } from "@/store/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const filters = ["Все", "Этот месяц", "Три месяца", "За год"];

const mockPayments = [
    { status: "success", method: "Оплата", amount: 850, bank: "Банковская карта", date: "Май 2025" },
    { status: "processing", method: "Оплата", amount: 850, bank: "MBANK", date: "Май 2025" },
    { status: "failed", method: "Оплата", amount: 850, bank: "Оптима Банк", date: "Май 2025" },
];

const statusMap = {
    success: {
        icon: "check-circle",
        color: "#4CAF50",
        label: "Успешно",
    },
    processing: {
        icon: "access-time",
        color: "#FFA500",
        label: "В обработке",
    },
    failed: {
        icon: "cancel",
        color: "#F44336",
        label: "Отклонено",
    },
};

export default function PaymentScreen() {
    const [selectedFilter, setSelectedFilter] = useState("Все");
    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useAppDispatch();

    // Получаем данные из store
    const { profile } = useAppSelector((state) => state.profile);
    const { house } = useAppSelector((state) => state.house);
    const { payments, loading, error } = useAppSelector((state) => state.payment);

    console.log(payments, "ssdcsdcsdc");

    // Загрузка данных при монтировании
    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = useCallback(() => {
        // Используем первый house card из массива, либо можно выбрать конкретный
        const firstHouseCard = house && house.length > 0 ? house[0] : null;

        if (firstHouseCard?.house_card && profile?.id) {
            // Преобразуем house_card в number, так как API ожидает number
            const houseCardId = parseInt(firstHouseCard.house_card, 10);

            dispatch(
                fetchPaymentsHistory({
                    houseCardId: houseCardId,
                    userId: profile.id,
                })
            );
        } else {
            console.warn("❌ House card или profile не найдены");
        }
    }, [dispatch, house, profile?.id]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadPayments();
        // Сбрасываем refreshing после завершения загрузки
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, [loadPayments]);

    // Фильтры как на макете
    const filters = ["Все", "Этот месяц", "Три месяца", "За год"];

    // Маппинг статусов для отображения
    const statusMap = {
        success: { icon: "check-circle", color: "#4CAF50", label: "Успешно" },
        processing: { icon: "schedule", color: "#FF9800", label: "В обработке" },
        rejected: { icon: "error", color: "#F44336", label: "Отклонено" },
    };

    // Маппинг источников платежа на названия банков/методов
    const sourceMap: { [key: string]: string } = {
        "12": "Банковская карта",
        mbank: "MBANK",
        optimal: "Оптима Банк",
        // добавьте другие источники по мере необходимости
    };

    // Функция для определения статуса платежа на основе данных
    const getPaymentStatus = (payment: PaymentHistory) => {
        // Если есть paid_date - успешно
        if (payment.paid_date && payment.paid_date !== "") {
            return "success";
        }
        // Если есть created_at но нет paid_date - в обработке
        if (payment.created_at && !payment.paid_date) {
            return "processing";
        }
        // В остальных случаях - отклонено
        return "rejected";
    };

    // Функция для получения названия банка/метода
    const getBankName = (payment: PaymentHistory) => {
        return sourceMap[payment.source] || payment.source || "Неизвестный метод";
    };

    // Функция для форматирования даты
    const formatDate = (dateString: string) => {
        if (!dateString) return "Дата не указана";

        try {
            const date = new Date(dateString);
            const months = [
                "Янв",
                "Фев",
                "Мар",
                "Апр",
                "Май",
                "Июн",
                "Июл",
                "Авг",
                "Сен",
                "Окт",
                "Ноя",
                "Дек",
            ];
            return `${months[date.getMonth()]} ${date.getFullYear()}`;
        } catch (error) {
            return "Неверная дата";
        }
    };

    // Фильтрация платежей по выбранному периоду
    const getFilteredPayments = () => {
        if (selectedFilter === "Все") return payments;

        const now = new Date();
        let startDate = new Date();

        switch (selectedFilter) {
            case "Этот месяц":
                startDate.setMonth(now.getMonth());
                startDate.setDate(1);
                break;
            case "Три месяца":
                startDate.setMonth(now.getMonth() - 3);
                break;
            case "За год":
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return payments;
        }

        return payments.filter((payment) => {
            const paymentDate = new Date(payment.paid_date || payment.created_at);
            return paymentDate >= startDate;
        });
    };

    const filteredPayments = getFilteredPayments();

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                {filters.map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterBtn, selectedFilter === f && styles.selectedFilterBtn]}
                        onPress={() => setSelectedFilter(f)}
                    >
                        <Text style={[styles.filterText, selectedFilter === f && styles.selectedFilterText]}>
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Показать ошибку если есть */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Ошибка загрузки: {error}</Text>
                    <TouchableOpacity onPress={loadPayments} style={styles.retryBtn}>
                        <Text style={styles.retryText}>Повторить</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || loading}
                        onRefresh={onRefresh}
                        tintColor="#EA961C"
                        colors={["#EA961C"]}
                    />
                }
            >
                {filteredPayments.length === 0 ? (
                    <View style={styles.empty}>
                        <PaymentsEmptyIcon />
                        <Text style={styles.emptyText}>{loading ? "Загрузка..." : "Платежи не найдены"}</Text>
                        <Text style={styles.emptySubText}>
                            {loading ? "Получаем данные о платежах" : "Попробуйте изменить фильтры"}
                        </Text>
                    </View>
                ) : (
                    filteredPayments.map((payment, idx) => {
                        const status = getPaymentStatus(payment);
                        const { icon, color, label } = statusMap[status as keyof typeof statusMap];
                        const bankName = getBankName(payment);
                        const formattedDate = formatDate(payment.paid_date || payment.created_at);

                        return (
                            <TouchableOpacity key={payment.id || idx} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <MaterialIcons name={icon as any} size={20} color={color} />
                                    <Text style={[styles.statusText, { color }]}>{label}</Text>
                                </View>
                                <Text style={styles.cardTitle}>Оплата</Text>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.bank}>{bankName}</Text>
                                    <Text style={[styles.amount, { color }]}>{payment.amount} сом</Text>
                                    <Text style={styles.date}>{formattedDate}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 10,
        flexWrap: "wrap",
        paddingVertical: 16,
    },
    filterBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
        borderRadius: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },
    selectedFilterBtn: {
        backgroundColor: "#FEA94B",
        borderColor: "#FEA94B",
    },
    filterText: {
        color: "#666",
        fontSize: 12,
    },
    selectedFilterText: {
        color: "#fff",
        fontWeight: "bold",
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
    },
    statusText: {
        fontWeight: "600",
        fontSize: 14,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
        color: "#333",
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
    },
    bank: {
        color: "#888",
        fontSize: 14,
        flex: 1,
    },
    amount: {
        fontWeight: "bold",
        fontSize: 16,
        marginRight: 16,
    },
    date: {
        fontSize: 13,
        color: "#999",
    },
    empty: {
        alignItems: "center",
        marginTop: 100,
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.GRAY_COLOR,
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 12,
        color: "#9B9EA1",
        fontWeight: "300",
        marginTop: 8,
    },
    errorContainer: {
        backgroundColor: "#FFE6E6",
        padding: 12,
        margin: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#F44336",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    errorText: {
        color: "#D32F2F",
        fontSize: 14,
        flex: 1,
    },
    retryBtn: {
        backgroundColor: "#F44336",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    retryText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "500",
    },
});
