import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput } from "../components/typography";
import { getWebsiteLogoUrl } from "../constants/vault";
import { deleteCredential, getCredential } from "../lib/secureStore";

export default function VaultAddScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [serviceName, setServiceName] = useState("");
  const [iconUri, setIconUri] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [websiteTouched, setWebsiteTouched] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [error, setError] = useState("");
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      setServiceName(item.serviceName);
      setIconUri(item.iconUri ?? null);
      setEmail(item.email);
      setPassword(item.password);
      setWebsite(item.website ?? item.serviceName);
    };

    loadCredential();

    return () => {
      isActive = false;
    };
  }, [id]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2000);
  };

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const isValidWebsite = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return false;
    }
    const withoutProtocol = trimmed.replace(/^https?:\/\//, "");
    return !withoutProtocol.includes(" ") && withoutProtocol.includes(".");
  };

  const emailError =
    emailTouched && email.length > 0 && !isValidEmail(email)
      ? "Enter a valid email address."
      : "";
  const websiteError =
    websiteTouched && website.length > 0 && !isValidWebsite(website)
      ? "Enter a valid website address."
      : "";

  const websiteUrl = useMemo(() => {
    const trimmed = website.trim();
    if (trimmed.length === 0) {
      return "";
    }

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    return `https://${trimmed}`;
  }, [website]);

  const resolvedIconUri = iconUri
    ? iconUri
    : website
      ? getWebsiteLogoUrl(website)
      : "";

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
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F5F7]" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-5"
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <View className="mt-4 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <Feather name="arrow-left" size={18} color="#5f4cde" />
            </Pressable>
            <Text className="text-base font-semibold text-slate-900">
              Vault Detail
            </Text>
            <View className="h-10 w-10" />
          </View>

          {error.length > 0 && (
            <View className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
              <Text className="text-xs font-semibold text-rose-600">
                {error}
              </Text>
            </View>
          )}

          <View className="mt-6 items-center">
            <View className="relative h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-black">
              {resolvedIconUri ? (
                <Image
                  source={{ uri: resolvedIconUri }}
                  style={styles.headerIcon}
                  contentFit="cover"
                />
              ) : (
                <Text className="text-2xl font-bold text-red-500">
                  {(serviceName || "?").slice(0, 1).toUpperCase()}
                </Text>
              )}
              <Pressable className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                <Feather name="edit-2" size={12} color="#ffffff" />
              </Pressable>
            </View>
            <Text className="mt-3 text-xl font-bold text-slate-900">
              {serviceName || "Vault Item"}
            </Text>
            <Text className="text-xs uppercase tracking-widest text-slate-400">
              Account
            </Text>
          </View>

          <View className="mt-6 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              Email
            </Text>
            <View className="mt-2 flex-row items-center justify-between">
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={() => setEmailTouched(true)}
                className="flex-1 text-sm font-semibold text-slate-900"
              />
              <Pressable
                onPress={() => {
                  Clipboard.setStringAsync(email);
                  showToast("Email copied");
                }}
                className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-indigo-50"
              >
                <Feather name="copy" size={14} color="#6366F1" />
              </Pressable>
            </View>
            {emailError.length > 0 && (
              <Text className="mt-2 text-xs text-rose-500">{emailError}</Text>
            )}
          </View>

          <View className="mt-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              Password
            </Text>
            <View className="mt-2 flex-row items-center justify-between">
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 text-sm font-semibold text-slate-900"
              />
              <View className="flex-row items-center">
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
                <Pressable
                  onPress={() => {
                    Clipboard.setStringAsync(password);
                    showToast("Password copied");
                  }}
                  className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-indigo-50"
                >
                  <Feather name="copy" size={14} color="#6366F1" />
                </Pressable>
              </View>
            </View>
          </View>

          <View className="mt-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              Website
            </Text>
            <View className="mt-2 flex-row items-center justify-between">
              <TextInput
                value={website}
                onChangeText={setWebsite}
                autoCapitalize="none"
                onBlur={() => setWebsiteTouched(true)}
                className="flex-1 text-sm font-semibold text-slate-900"
              />
              <Pressable
                onPress={() => {
                  if (!isValidWebsite(website)) {
                    setWebsiteTouched(true);
                    showToast("Enter a valid website");
                    return;
                  }

                  if (websiteUrl.length > 0) {
                    Linking.openURL(websiteUrl);
                    showToast("Opening website");
                  }
                }}
                className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-indigo-50"
              >
                <Feather name="external-link" size={14} color="#6366F1" />
              </Pressable>
            </View>
            {websiteError.length > 0 && (
              <Text className="mt-2 text-xs text-rose-500">{websiteError}</Text>
            )}
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/edit-account",
                params: id ? { id } : undefined,
              })
            }
            className="mt-8 items-center rounded-full bg-white px-6 py-3 shadow-sm"
          >
            <Text className="text-sm font-semibold text-slate-700">
              Edit Account
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDelete}
            className="mt-4 items-center rounded-full bg-red-500 px-6 py-3 shadow-sm"
          >
            <Text className="text-sm font-semibold text-white">
              Delete Account
            </Text>
          </Pressable>
        </ScrollView>

        {toastVisible && (
          <View className="absolute top-6 self-center items-center rounded-full bg-indigo-500 px-6 py-3 shadow-lg">
            <Text className="text-sm font-semibold text-white">
              {toastMessage}
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    width: 80,
    height: 80,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
