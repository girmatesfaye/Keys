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

export default function MasterPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Retrieve the stored master password
      // In a full production flow, this key should be set during onboarding.
      const storedPassword = await SecureStore.getItemAsync("master_password");

      // 2. Verification Logic
      // If no password exists (first run), we typically default to a setup flow,
      // but for this screen we fallback to "123456" for testing if null.
      const validPassword = storedPassword || "123456";

      if (password === validPassword) {
        // Success: Navigate to Vault
        router.replace("/(tabs)/vault");
      } else {
        // Failure
        setError("Incorrect password. Please try again.");
        setPassword(""); // Clear input on failure (optional ux choice)
      }
    } catch (err) {
      Alert.alert("Error", "Could not verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#EEF3FF]"
    >
      <StatusBar style="dark" />
      <View className="flex-1 px-6 pt-16">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </Pressable>

        <View className="mt-10 mb-8">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#5B5FE9]/10 mb-6">
            <Ionicons name="key" size={32} color="#5B5FE9" />
          </View>
          <Text className="font-google-sans-bold text-3xl text-gray-900 mb-2">
            Master Password
          </Text>
          <Text className="font-google-sans text-gray-500 text-lg leading-6">
            Enter your master password to unlock your vault.
          </Text>
        </View>

        <View className="space-y-4">
          <View className="space-y-2">
            <Text className="font-google-sans-medium text-gray-700 ml-1">
              Password
            </Text>
            <View className="relative">
              <TextInput
                className="w-full rounded-2xl bg-white p-4 pr-12 font-google-sans text-lg text-black shadow-sm border border-transparent focus:border-[#5B5FE9]"
                placeholder="Enter password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError(null); // Clear error when typing
                }}
                autoCapitalize="none"
              />
              <View className="absolute right-4 top-4">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Error Message Display */}
          {error && (
            <Text className="font-google-sans text-red-500 ml-1">{error}</Text>
          )}

          <Pressable
            onPress={handleUnlock}
            disabled={loading}
            className={`mt-8 w-full rounded-full bg-[#5B5FE9] py-4 shadow-xl active:bg-[#4A4ED0] ${
              loading ? "opacity-70" : ""
            }`}
          >
            <Text className="font-google-sans-bold text-center text-lg text-white">
              {loading ? "Verifying..." : "Unlock Vault"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
