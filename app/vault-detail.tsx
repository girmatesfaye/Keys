import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCategoryColor } from "../constants/vault";
import { deleteCredential, getCredential } from "../lib/secureStore";

export default function VaultDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [credential, setCredential] =
    useState<Awaited<ReturnType<typeof getCredential>>>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadCredential = async () => {
      if (!id) {
        setError("Missing vault item.");
        return;
      }

      const item = await getCredential(id);
      if (!isActive) {
        return;
      }

      if (!item) {
        setError("Vault item not found.");
        return;
      }

      setError("");
      setCredential(item);
    };

    loadCredential();

    return () => {
      isActive = false;
      setCredential(null);
    };
  }, [id]);

  const maskedPassword = useMemo(() => {
    if (!credential?.password) {
      return "";
    }
    if (showPassword) {
      return credential.password;
    }
    return "*".repeat(Math.max(8, credential.password.length));
  }, [credential, showPassword]);

  const handleDelete = () => {
    if (!id) {
      return;
    }

    Alert.alert(
      "Delete entry",
      "This will remove the credential from your vault.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteCredential(id);
            setCredential(null);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F6FA]" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={80}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-5 pb-28"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <View className="mt-5 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <Feather name="arrow-left" size={18} color="#6366F1" />
            </Pressable>
            <Text className="text-base font-semibold text-slate-900">
              Vault Item
            </Text>
            <View className="h-10 w-10" />
          </View>

          {error.length > 0 && (
            <View className="mt-4 flex-row items-center rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
              <Feather name="alert-circle" size={16} color="#F43F5E" />
              <Text className="ml-2 text-xs font-semibold text-rose-600">
                {error}
              </Text>
            </View>
          )}

          {credential && (
            <>
              <View className="mt-6 items-center">
                <View
                  className={`h-20 w-20 items-center justify-center overflow-hidden rounded-full ${getCategoryColor(
                    credential.category,
                  )}`}
                >
                  {credential.iconUri ? (
                    <Image
                      source={{ uri: credential.iconUri }}
                      className="h-20 w-20"
                      contentFit="cover"
                    />
                  ) : (
                    <Text className="text-2xl font-bold text-slate-700">
                      {credential.serviceName.slice(0, 1)}
                    </Text>
                  )}
                </View>
                <Text className="mt-3 text-xl font-bold text-slate-900">
                  {credential.serviceName}
                </Text>
                <Text className="text-[10px] uppercase tracking-widest text-slate-400">
                  {credential.category}
                </Text>
              </View>

              <View className="mt-6 rounded-2xl bg-white px-4 py-4 shadow-sm">
                <Text className="text-[10px] uppercase tracking-widest text-slate-400">
                  Email
                </Text>
                <Text className="mt-2 text-sm font-semibold text-slate-900">
                  {credential.email}
                </Text>
              </View>

              <View className="mt-3 rounded-2xl bg-white px-4 py-4 shadow-sm">
                <Text className="text-[10px] uppercase tracking-widest text-slate-400">
                  Password
                </Text>
                <View className="mt-2 flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-slate-900">
                    {maskedPassword}
                  </Text>
                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    className="h-8 w-8 items-center justify-center rounded-full bg-slate-100"
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={14}
                      color="#64748B"
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable
                onPress={handleDelete}
                className="mt-6 items-center rounded-full bg-rose-500 px-6 py-3 shadow-lg"
              >
                <Text className="text-sm font-semibold text-white">
                  Delete from Vault
                </Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
