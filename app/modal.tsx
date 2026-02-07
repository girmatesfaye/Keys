import { StyleSheet, Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center p-20">
      <Text className="text-2xl font-bold text-center mt-4">
        This is a modal
      </Text>
      <Text className="mt-4 py-4">Go to home screen</Text>
    </View>
  );
}

