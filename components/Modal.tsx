import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface ConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  cancelColor?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Да",
  cancelText = "Отмена",
  confirmColor = "red",
  cancelColor = "#333",
}) => {
  return (
    <View style={styles.container}>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={[styles.title, { color: confirmColor }]}>{title}</Text>
                <View style={styles.separator} />
                <Text style={styles.message}>{message}</Text>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity onPress={onConfirm}>
                    <Text style={[styles.confirmText, { color: confirmColor }]}>{confirmText}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onCancel}>
                    <Text style={[styles.cancelText, { color: cancelColor }]}>{cancelText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: "400",
    color: "#E74C3D",
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 15,
  },
  message: {
    fontSize: 12,
    color: "#747474",
    marginBottom: 20,
    lineHeight: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
  confirmText: {
    fontSize: 14,
    color: "#E74C3D",
    fontWeight: "400",
  },
  cancelText: {
    fontSize: 14,
    color: "#666360",
    fontWeight: "400",
  },
});
