import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function MasterPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 bg-[#EEF3FF] px-6 pt-16">
      <Pressable
        onPress={() => router.back()}
        className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
      >
        <Ionicons name="arrow-back" size={18} color="#6366F1" />
      </Pressable>

      <View className="mt-8 items-center">
        <Text className="text-2xl font-extrabold text-slate-900">
          Master Password
        </Text>
        <Text className="mt-3 text-base text-slate-500">
          Enter your master password to unlock.
        </Text>
      </View>

      <View className="mt-10">
        <Text className="text-xs uppercase tracking-widest text-slate-400">
          Password
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          className="mt-3 rounded-2xl bg-white px-4 py-4 text-base text-slate-900 shadow-sm"
        />
      </View>

      <Pressable
        onPress={() => router.replace("/(tabs)/vault")}
        className="mt-8 w-full rounded-full bg-[#5B5FE9] py-4 shadow-xl"
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="lock-open" size={18} color="#ffffff" />
          <Text className="ml-2 text-base font-semibold text-white">
            Unlock Vault
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
