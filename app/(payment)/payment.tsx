import ExclamationIcon from "@/assets/icons/ExclamationIcon";
import LightningIcon from "@/assets/icons/LightningIcon";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { createPayment } from "@/store/slices/paymentSlice";
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
    const amount = params.amount as string;

    const [selectedMethod, setSelectedMethod] = useState<string>();
    const dispatch = useAppDispatch();
    const { paymentMethods, loading } = useAppSelector((state) => state.payment);

    useEffect(() => {
        if (houseCardId) {
            loadPaymentMethods();
        }
    }, [houseCardId]);

    const loadPaymentMethods = async () => {
        try {
            await dispatch(
                createPayment({
                    houseCardId: parseInt(houseCardId),
                    requisite: houseCardId,
                    sum: amount || "1225",
                })
            ).unwrap();
        } catch (error) {
            console.error("Ошибка загрузки методов оплаты:", error);
        }
    };

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

    // Процесс оплаты
    const processPayment = async () => {
        if (!selectedMethod) {
            Alert.alert("Ошибка", "Выберите способ оплаты");
            return;
        }

        const selectedBank = paymentMethods.find((bank) => bank.name === selectedMethod);

        if (!selectedBank) {
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
        router.push({
            pathname: "/(payment)/receipt",
            params: {
                amount: amount || "1225",
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
            },
        });
    };

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
                                Лицевой счет: {houseCardId || "563463465345345"}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rowWrap}>
                        <View style={styles.row}>
                            <Text style={styles.rowTitle}>К оплате:</Text>
                            <Text style={{ color: "#FEA94B", fontWeight: "500", fontSize: 16 }}>
                                {amount || "1225"} сом
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.paymentCard}>
                    <Text style={styles.sectionTitle}>Выберите способ оплаты</Text>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FF8C00" />
                            <Text style={styles.loadingText}>Загрузка методов оплаты...</Text>
                        </View>
                    ) : paymentMethods.length > 0 ? (
                        <View style={styles.methods}>
                            {paymentMethods.map((method) => (
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
                                                    uri: `${method.logo}`,
                                                }}
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
                    style={[styles.payButton, (!selectedMethod || loading) && styles.payButtonDisabled]}
                    onPress={processPayment}
                    disabled={!selectedMethod || loading}
                >
                    <Text style={styles.payButtonText}>Оплатить {amount || "1225"} сом</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
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
