import { Text, View } from "react-native";

export default function GeneratorScreen() {
  return (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-center mt-4">
        Generator Screen
      </Text>
      <Text className="text-red-500 font-semibold">
        This is the Generator tab
      </Text>
    </View>
  );
}
