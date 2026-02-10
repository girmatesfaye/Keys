import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SetupScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSave = async () => {
    if (password.length < 4) {
      Alert.alert("Weak Password", "Password must be at least 4 characters.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    try {
      await SecureStore.setItemAsync("master_password", password);
      Alert.alert("Success", "Vault created!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/vault") },
      ]);
    } catch (e) {
      Alert.alert("Error", "Could not save password.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white px-6 pt-20"
    >
      <StatusBar style="dark" />
      <View className="items-center mb-8">
        <View className="h-20 w-20 bg-blue-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="shield-checkmark" size={40} color="#2563EB" />
        </View>
        <Text className="text-3xl font-bold text-gray-900">Welcome</Text>
        <Text className="text-gray-500 text-center mt-2">
          Create a master password to secure your vault. You cannot recover this
          if lost.
        </Text>
      </View>

      <Text className="mb-2 font-semibold text-gray-700">Create Password</Text>
      <TextInput
        className="w-full bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200 text-gray-900"
        secureTextEntry
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
      />

      <Text className="mb-2 font-semibold text-gray-700">Confirm Password</Text>
      <TextInput
        className="w-full bg-gray-50 p-4 rounded-xl mb-8 border border-gray-200 text-gray-900"
        secureTextEntry
        placeholder="Re-enter password"
        value={confirm}
        onChangeText={setConfirm}
      />

      <Pressable
        onPress={handleSave}
        className="bg-blue-600 p-4 rounded-xl items-center shadow-lg"
      >
        <Text className="text-white font-bold text-lg">Create Vault</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
