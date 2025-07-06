import Colors from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";

export default function PaymentScreen() {
  return (
    <View style={styles.container}>
      <Text>История платежей</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.MAIN_BACKGROUND_COLOR,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
