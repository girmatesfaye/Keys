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
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetupScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6"
      >
        <StatusBar style="dark" />
        <View className="items-center mb-8 mt-4">
          <View className="h-20 w-20 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="shield-checkmark" size={40} color="#6366F1" />
          </View>
          <Text className="text-3xl font-bold text-gray-900">Welcome</Text>
          <Text className="text-gray-500 text-center mt-2">
            Create a master password to secure your vault. You cannot recover
            this if lost.
          </Text>
        </View>

        <Text className="mb-2 font-semibold text-gray-700">
          Create Password
        </Text>
        <View className="mb-4 justify-center">
          <TextInput
            className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-900 pr-12"
            secureTextEntry={!showPassword}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4"
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </Pressable>
        </View>

        <Text className="mb-2 font-semibold text-gray-700">
          Confirm Password
        </Text>
        <View className="mb-8 justify-center">
          <TextInput
            className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-900 pr-12"
            secureTextEntry={!showConfirm}
            placeholder="Re-enter password"
            value={confirm}
            onChangeText={setConfirm}
          />
          <Pressable
            onPress={() => setShowConfirm(!showConfirm)}
            className="absolute right-4"
          >
            <Ionicons
              name={showConfirm ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </Pressable>
        </View>

        <Pressable
          onPress={handleSave}
          className="bg-blue-600 p-4 rounded-xl items-center shadow-lg"
        >
          <Text className="text-white font-bold text-lg">Create Vault</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
