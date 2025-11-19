import ExclamationIcon from "@/assets/icons/ExclamationIcon";
import LightningIcon from "@/assets/icons/LightningIcon";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { createPayment, previewPayment } from "@/store/slices/paymentSlice";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Payment() {
    const params = useLocalSearchParams();
    const houseCardId = params.houseCardId as string;
    const houseCardNumber = params.houseCardNumber as string;

    const { check } = useAppSelector((state) => state.check);
    const checkId = check?.id;

    const [selectedMethod, setSelectedMethod] = useState<string>();
    const [step, setStep] = useState<"preview" | "banks">("preview");
    const dispatch = useAppDispatch();
    const {
        paymentMethods,
        loading: banksLoading,
        preview,
        loading,
    } = useAppSelector((state) => state.payment);

    useEffect(() => {
        if (checkId) {
            loadPaymentPreview();
        } else {
            console.warn("⚠️ checkId не найден, невозможно загрузить предпросмотр");
        }
    }, [checkId]);

    // 1. Загружаем предпросмотр платежа с checkId вместо houseCardId
    const loadPaymentPreview = async () => {
        if (!checkId) {
            Alert.alert("Ошибка", "Данные проверки не загружены");
            return;
        }

        try {
            await dispatch(
                previewPayment({
                    checkId: checkId, // Используем checkId вместо houseCardId
                    requisite: houseCardNumber || houseCardId,
                    sum: "0",
                })
            ).unwrap();
        } catch (error) {
            console.error("Ошибка загрузки предпросмотра:", error);
            Alert.alert("Ошибка", "Не удалось загрузить данные для оплаты");
        }
    };

    const loadPaymentMethods = async () => {
        if (!checkId) {
            Alert.alert("Ошибка", "Данные проверки не загружены");
            return;
        }

        try {
            setStep("banks");
            await dispatch(
                createPayment({
                    checkId: checkId, // Используем checkId вместо houseCardId
                    requisite: houseCardNumber || houseCardId,
                    sum: preview.previewData?.total_with_comission.toString() || "9678",
                })
            ).unwrap();
        } catch (error) {
            console.error("Ошибка загрузки методов оплаты:", error);
            Alert.alert("Ошибка", "Не удалось загрузить способы оплаты");
        }
    };

    // Остальной код остается без изменений...
    const getBankIcon = (bankName: string) => {
        const icons: any = {
            Мбанк: <FontAwesome5 name="mobile-alt" size={24} color="#FF8C00" />,
            MBANK: <FontAwesome5 name="mobile-alt" size={24} color="#FF8C00" />,
            "Оптима Банк": <FontAwesome5 name="university" size={24} color="#FF8C00" />,
            Доскредо: <FontAwesome5 name="credit-card" size={24} color="#FF8C00" />,
            KICB: <FontAwesome5 name="building" size={24} color="#FF8C00" />,
            MegaPay: <FontAwesome5 name="bolt" size={24} color="#FF8C00" />,
            "О! Банк": <FontAwesome5 name="bank" size={24} color="#FF8C00" />,
            "Элдик Банк": <FontAwesome5 name="bank" size={24} color="#FF8C00" />,
            ДемирБанк: <FontAwesome5 name="bank" size={24} color="#FF8C00" />,
            "Финка Банк": <FontAwesome5 name="bank" size={24} color="#FF8C00" />,
        };

        return icons[bankName] || <FontAwesome5 name="credit-card" size={24} color="#FF8C00" />;
    };

    // Проверка активности банка
    const isBankActive = (bank: any): boolean => {
        return bank.active === 1 && bank.link && bank.link !== "." && bank.link !== "";
    };

    // Процесс оплаты
    const processPayment = async () => {
        if (!selectedMethod) {
            Alert.alert("Ошибка", "Выберите способ оплаты");
            return;
        }

        const selectedBank = paymentMethods.find((bank) => bank.name === selectedMethod);

        if (!selectedBank || !isBankActive(selectedBank)) {
            Alert.alert("Ошибка", "Выбранный способ оплаты недоступен");
            return;
        }

        try {
            const supported = await Linking.canOpenURL(selectedBank.link);

            if (supported) {
                await Linking.openURL(selectedBank.link);

                setTimeout(() => {
                    goToReceipt(selectedBank.name);
                }, 2000);
            } else {
                Alert.alert("Ошибка", "Не удалось открыть приложение банка");
            }
        } catch (error) {
            console.error("Ошибка при открытии банковского приложения:", error);
            Alert.alert("Ошибка", "Произошла ошибка при переходе к оплате");
        }
    };

    const goToReceipt = (methodName: string) => {
        const amount = preview.previewData?.total_with_comission || 9678;

        router.push({
            pathname: "/(payment)/receipt",
            params: {
                amount: amount.toString(),
                description: "Оплата за электроэнергию",
                date: new Date().toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                method: methodName,
                invoice: `TXN${Date.now()}`,
                status: "Успешно",
                houseCardId: houseCardId,
                checkId: checkId?.toString() || "", // Добавляем checkId в параметры
            },
        });
    };

    // Фильтруем только активные банки
    const activeBanks = paymentMethods.filter(isBankActive);

    // Шаг 1: Предпросмотр платежа
    if (step === "preview") {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <LightningIcon />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.title}>Счет за электроэнергию</Text>
                            <Text style={styles.subtitle}>
                                {new Date().toLocaleString("ru-RU", { month: "long", year: "numeric" })}
                            </Text>
                            <Text style={styles.subtitle}>
                                Лицевой счет: {houseCardNumber || houseCardId}
                            </Text>
                            {checkId && <Text style={styles.subtitle}>ID проверки: {checkId}</Text>}
                        </View>
                    </View>

                    {/* Данные из Preview */}
                    {preview.loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FF8C00" />
                            <Text style={styles.loadingText}>Загрузка данных...</Text>
                        </View>
                    ) : preview.previewData ? (
                        <View style={styles.previewData}>
                            <View style={styles.row}>
                                <Text style={styles.rowTitle}>Сумма:</Text>
                                <Text style={styles.amount}>{preview.previewData.total} сом</Text>
                            </View>
                            {preview.previewData.comission > 0 && (
                                <View style={styles.row}>
                                    <Text style={styles.rowTitle}>Комиссия:</Text>
                                    <Text style={styles.commission}>
                                        {preview.previewData.comission}{" "}
                                        {preview.previewData.comission_type === "percent" ? "%" : "сом"}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.divider} />
                            <View style={styles.row}>
                                <Text style={[styles.rowTitle, { fontWeight: "600" }]}>Итого к оплате:</Text>
                                <Text style={styles.totalAmount}>
                                    {preview.previewData.total_with_comission} сом
                                </Text>
                            </View>
                        </View>
                    ) : !checkId ? (
                        <Text style={styles.errorText}>Данные проверки не загружены</Text>
                    ) : (
                        <Text style={styles.errorText}>Не удалось загрузить данные платежа</Text>
                    )}
                </View>

                <View style={styles.infoBox}>
                    <View style={styles.infoHeader}>
                        <ExclamationIcon />
                        <Text style={styles.infoTitle}>Информация об оплате</Text>
                    </View>
                    <Text style={styles.infoText}>
                        • После подтверждения вы перейдете к выбору способа оплаты{"\n"}• Доступны оплата
                        через приложения банков и онлайн-платежи
                    </Text>
                </View>

                <View style={styles.btnWrap}>
                    <TouchableOpacity
                        style={[
                            styles.payButton,
                            (preview.loading || !preview.previewData || !checkId) && styles.payButtonDisabled,
                        ]}
                        onPress={loadPaymentMethods}
                        disabled={preview.loading || !preview.previewData || !checkId}
                    >
                        <Text style={styles.payButtonText}>
                            {preview.loading ? "Загрузка..." : "Перейти к оплате"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    // Шаг 2: Выбор банка
    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <LightningIcon />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.title}>Счет за электроэнергию</Text>
                            <Text style={styles.subtitle}>
                                {new Date().toLocaleString("ru-RU", { month: "long", year: "numeric" })}
                            </Text>
                            <Text style={styles.subtitle}>
                                Лицевой счет: {houseCardNumber || houseCardId}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rowWrap}>
                        <View style={styles.row}>
                            <Text style={styles.rowTitle}>К оплате:</Text>
                            <Text style={{ color: "#FEA94B", fontWeight: "500", fontSize: 16 }}>
                                {preview.previewData?.total_with_comission || "9678"} сом
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.paymentCard}>
                    <Text style={styles.sectionTitle}>Выберите способ оплаты</Text>

                    {banksLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FF8C00" />
                            <Text style={styles.loadingText}>Загрузка методов оплаты...</Text>
                        </View>
                    ) : activeBanks.length > 0 ? (
                        <View style={styles.methods}>
                            {activeBanks.map((method) => (
                                <TouchableOpacity
                                    key={method.name}
                                    style={[
                                        styles.methodCard,
                                        selectedMethod === method.name && styles.selectedCard,
                                    ]}
                                    onPress={() => setSelectedMethod(method.name)}
                                >
                                    <View style={styles.methodContent}>
                                        {getBankIcon(method.name)}
                                        <View style={{ marginLeft: 12 }}>
                                            <Image
                                                style={styles.logo}
                                                source={{
                                                    uri: method.logo,
                                                }}
                                                onError={() =>
                                                    console.log(`Не удалось загрузить лого: ${method.logo}`)
                                                }
                                            />
                                            <Text style={styles.methodLabel}>{method.name}</Text>
                                            <Text style={styles.methodDesc}>
                                                {method.link.includes("deeplink")
                                                    ? "Оплата через приложение"
                                                    : "Онлайн оплата"}
                                            </Text>
                                        </View>
                                    </View>
                                    {selectedMethod === method.name && (
                                        <Ionicons name="checkmark-circle" size={22} color="#FF8C00" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.noMethodsText}>Нет доступных способов оплаты</Text>
                    )}
                </View>

                <View style={styles.infoBox}>
                    <View style={styles.infoHeader}>
                        <ExclamationIcon />
                        <Text style={styles.infoTitle}>Информация об оплате</Text>
                    </View>
                    <Text style={styles.infoText}>
                        • После оплаты вы получите SMS-уведомление{"\n"}• Квитанцию можно сохранить или
                        отправить она будет на странице историй о платеже
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.btnWrap}>
                <TouchableOpacity
                    style={[styles.payButton, (!selectedMethod || banksLoading) && styles.payButtonDisabled]}
                    onPress={processPayment}
                    disabled={!selectedMethod || banksLoading}
                >
                    <Text style={styles.payButtonText}>
                        Оплатить {preview.previewData?.total_with_comission || "9678"} сом
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    previewData: {
        marginTop: 16,
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    amount: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    commission: {
        fontSize: 14,
        color: "#666",
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FF8C00",
    },
    divider: {
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 8,
    },
    errorText: {
        textAlign: "center",
        color: "#ff6b6b",
        marginTop: 16,
    },

    container: {
        padding: 10,
        flex: 1,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        // elevation: 2,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontWeight: "400",
        fontSize: 16,
        color: Colors.GRAY_COLOR,
    },
    subtitle: {
        fontSize: 12,
        color: Colors.GRAY_COLOR,
    },

    rowWrap: {
        backgroundColor: "#F3F3F3",
        borderRadius: 10,
        padding: 16,
        // marginBottom: 10,
        shadowColor: "#000",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
        borderBottomWidth: 1,
        borderColor: "#d4d4d439",
    },

    rowTitle: {
        color: Colors.GRAY_COLOR,
        fontSize: 12,
    },

    row_span: {
        color: "#666360",
        fontSize: 14,
    },

    paymentCard: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "400",
        marginBottom: 8,
        color: Colors.GRAY_COLOR,
    },

    methodCard: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        justifyContent: "space-between",
        marginBottom: 5,
        backgroundColor: "#fff",
        height: 80,
    },
    selectedCard: {
        borderColor: "#EA961C1A",
        backgroundColor: "#FFF7E6",
    },
    methodContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    methodLabel: {
        fontWeight: "400",
        fontSize: 14,
        color: "#666360",
    },
    methodDesc: {
        fontSize: 11,
        color: "#747474",
        fontWeight: 300,
    },
    infoBox: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderColor: "#8CAFBF",
        marginTop: 15,
    },
    infoHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    infoTitle: {
        fontWeight: "400",
        fontSize: 14,
        color: "#747474",
        marginLeft: 7,
    },
    infoText: {
        fontSize: 12,
        color: "#9B9EA1",
        lineHeight: 18,
        fontWeight: "300",
    },

    btnWrap: {
        backgroundColor: "#fff",
        // width: "auto",
        padding: 15,
    },

    payButton: {
        backgroundColor: Colors.BUTTONSERVICE,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        // marginBottom: 20,
    },
    payButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },

    buttonDisabled: {
        opacity: 0.6,
    },
    loadingContainer: {
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    },
    noMethodsText: {
        textAlign: "center",
        color: "#666",
        padding: 20,
    },
    payButtonDisabled: {
        opacity: 0.5,
    },
});
