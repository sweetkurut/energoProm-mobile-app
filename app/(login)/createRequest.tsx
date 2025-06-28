import CheckCircleIcon from "@/assets/icons/CheckCircleIcon";
import ExclamationIcon from "@/assets/icons/ExclamationIcon";
import Colors from "@/constants/Colors";
import { CalendarFold } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const CreateRequestScreen = () => {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  // const [date, setDate] = useState(new Date());
  // const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showDate = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        <Text style={styles.title}>Заполнение данных</Text>

        <View style={styles.selectedService}>
          <View style={styles.circleCheck}>
            <CheckCircleIcon />
          </View>
          <View>
            <Text style={styles.serviceLabel}>Выбрана услуга</Text>
            <Text style={styles.serviceName}>Установка счетчика</Text>
          </View>
        </View>

        <Text style={styles.label}>Введите адрес</Text>
        <TextInput
          placeholder="ул.Киевская 45,кв. 12"
          placeholderTextColor="#CCCCCC"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Номер телефона</Text>
        <TextInput
          placeholder="+996 XXX XXX XXX"
          placeholderTextColor="#CCCCCC"
          keyboardType="phone-pad"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Выберите дату</Text>
        <TouchableOpacity style={styles.dateInput} onPress={showDate}>
          <Text style={styles.dateText}>{selectedDate.toLocaleDateString("ru-RU")}</Text>
          <CalendarFold size={20} color="#CCCCCC" />
        </TouchableOpacity>

        {showDate && (
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
          />
        )}

        <Text style={styles.label}>Описание проблемы/задачи</Text>
        <TextInput
          placeholder="Укажите, что нужно сделать. Например: «Установить новый счётчик в подъезде №3»."
          placeholderTextColor="#BBBBBB"
          style={[styles.input, styles.textArea]}
          multiline={true}
          numberOfLines={5}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <View style={styles.infoBox}>
        <View style={styles.infoHeader}>
          <ExclamationIcon />
          <Text style={styles.infoTitle}> Важная информация</Text>
        </View>
        <Text style={styles.infoText}>
          • Специалист свяжется с вами в течение 24 часов{"\n"}• Стоимость услуг может варьироваться в
          зависимости от сложности
        </Text>
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Отправить заявку</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: "#fff",
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontWeight: "400",
    fontSize: 14,
    marginBottom: 20,
    color: Colors.TITLE_AUTH,
  },
  selectedService: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  circleCheck: {
    width: 35,
    height: 35,
    borderRadius: "50%",
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceLabel: {
    fontSize: 12,
    color: Colors.SPAN_AUTH,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.TITLE_AUTH,
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  input: {
    height: 40,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    color: "#333",
    backgroundColor: "#F9FAFB",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 8,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 20,
    backgroundColor: "#F9FAFB",
  },
  dateText: {
    fontSize: 14,
    color: "#999",
  },
  infoBox: {
    // borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    // borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 10,
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
  },
  infoText: {
    fontSize: 12,
    color: "#9B9EA1",
    lineHeight: 18,
    fontWeight: "300",
  },
  submitButton: {
    backgroundColor: Colors.HEADER,
    paddingVertical: 10,
    borderRadius: 10,
    width: "auto",
    marginHorizontal: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    color: Colors.WHITE_COLOR,
    fontWeight: "500",
    fontSize: 15,
    textAlign: "center",
  },
});
