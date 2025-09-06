import AdressIcon from "@/assets/icons/AdressIcon";
import LocationIcon from "@/assets/icons/LocationIcon";
import Colors from "@/constants/Colors";
import { useAppDispatch } from "@/store/hook";
import { deleteDeal } from "@/store/slices/dealsSlice";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ConfirmModal from "./Modal";

const RequestCard = ({ id, title, date, desc, address, planDate, status }: any) => {
    const [modalVisible, setModalVisible] = useState(false);

    const dispatch = useAppDispatch();

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleDelete = async () => {
        try {
            console.log("Попытка удаления с ID:", id);
            await dispatch(deleteDeal(id)).unwrap();
            console.log("Удаление успешно");
            setModalVisible(false);
        } catch (error) {
            console.error("Ошибка", error);
        }
    };

    const getStatusStyle = () => {
        switch (status) {
            case "Новая":
                return { color: "#fff", backgroundColor: "#4DC8EF" };
            case "В работе":
                return { color: "#fff", backgroundColor: "#FEA94B" };
            case "Выполнена":
                return { color: "#fff", backgroundColor: "#3AC17D" };
            case "Отменена":
                return { color: "#fff", backgroundColor: "#c91111" };
            default:
                return {};
        }
    };

    return (
        <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
                <Text style={styles.requestTitle}>{title}</Text>
                <Text style={[styles.requestStatus, getStatusStyle()]}>{status}</Text>
            </View>
            <Text style={styles.requestDate}>{date}</Text>
            <Text style={styles.requestDesc}>{desc}</Text>

            <View style={styles.metaBox}>
                <View style={styles.metaRow}>
                    <LocationIcon />
                    <Text style={styles.metaText}>{address}</Text>
                </View>
                <View style={styles.metaRow}>
                    <AdressIcon />
                    <Text style={styles.metaText}>{planDate}</Text>
                </View>
            </View>

            {status === "Новая" && (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.cancelText}>Хотите отменить?</Text>
                </TouchableOpacity>
            )}

            <ConfirmModal
                visible={modalVisible}
                onConfirm={handleDelete}
                onCancel={() => setModalVisible(false)}
                title="Отмена заявки"
                message="Вы действительно хотите отменить заявку?\nВ случае отмены с вами свяжутся для уточнения"
                confirmColor="red"
            />
        </View>
    );
};

export default RequestCard;

const styles = StyleSheet.create({
    requestCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        // marginVertical: 5,
        marginTop: 10,
    },

    requestHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    requestTitle: {
        fontSize: 14,
        fontWeight: "400",
        color: Colors.TITLE_AUTH,
    },

    requestStatus: {
        fontSize: 12,
        fontWeight: "600",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: "hidden",
    },

    requestDate: {
        fontSize: 11,
        color: Colors.GRAY_COLOR,
        marginTop: 4,
        fontWeight: 300,
    },

    requestDesc: {
        fontSize: 13,
        color: Colors.GRAY_COLOR,
        marginVertical: 6,
    },

    metaBox: {
        backgroundColor: "#F3F4F6",
        borderRadius: 10,
        padding: 10,
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },

    metaText: {
        fontSize: 13,
        color: Colors.TITLE_AUTH,
    },

    cancelText: {
        color: "red",
        marginTop: 10,
        fontSize: 13,
        textAlign: "right",
    },
});
