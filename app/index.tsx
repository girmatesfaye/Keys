import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function IndexScreen() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleUnlock = async () => {
    if (isAuthenticating) {
      return;
    }

    setErrorText(null);
    setIsAuthenticating(true);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setErrorText("Fingerprint is not available. Use Master Password.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock your vault",
        cancelLabel: "Cancel",
        fallbackLabel: "Use Master Password",
        disableDeviceFallback: false,
      });

      if (result.success) {
        router.replace("/(tabs)/vault");
        return;
      }

      if (result.error === "user_fallback") {
        router.push("/master-password");
        return;
      }

      setErrorText("Authentication failed. Try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <View className="flex-1 bg-[#EEF3FF] px-6 pt-16">
      <View className="items-center">
        <Text className="text-3xl font-extrabold text-slate-900">
          Welcome Back
        </Text>
        <Text className="mt-3 text-base text-slate-500">
          Your digital vault is locked.
        </Text>
      </View>

      <View className="mt-20 items-center">
        <View className="h-44 w-44 items-center justify-center rounded-full bg-white shadow-2xl">
          <View className="h-28 w-28 items-center justify-center rounded-3xl bg-[#0F172A]">
            <Ionicons name="finger-print" size={64} color="#7DD3FC" />
          </View>
        </View>
      </View>

      <View className="mt-16 items-center">
        <View className="flex-row items-center">
          <Ionicons name="lock-closed" size={18} color="#6366F1" />
          <Text className="ml-2 text-base font-semibold text-indigo-400">
            Secured by FaceID
          </Text>
        </View>

        <Pressable
          onPress={handleUnlock}
          className={`mt-6 w-full rounded-full bg-[#5B5FE9] py-4 shadow-xl ${
            isAuthenticating ? "opacity-70" : ""
          }`}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="finger-print" size={20} color="#ffffff" />
            <Text className="ml-2 text-base font-semibold text-white">
              {isAuthenticating ? "Checking..." : "Tap to Unlock"}
            </Text>
          </View>
        </Pressable>

        {errorText ? (
          <Text className="mt-4 text-sm font-semibold text-rose-400">
            {errorText}
          </Text>
        ) : null}

        <Pressable
          onPress={() => router.push("/master-password")}
          className="mt-6"
        >
          <Text className="text-base font-semibold text-slate-400">
            Use Master Password
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
