import { Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1">
      <Text className="text-2xl font-bold text-center mt-4">
        Settings Screen
      </Text>
      <Text className="text-red-500 font-semibold">
        This is the Settings tab
      </Text>
    </View>
  );
}
