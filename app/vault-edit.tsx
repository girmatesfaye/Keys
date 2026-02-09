import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VaultAddScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("alex.morris@gmail.com");
  const [password, setPassword] = useState("supersecurepassword");
  const [website, setWebsite] = useState("netflix.com");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [websiteTouched, setWebsiteTouched] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return (
    <SafeAreaView className="flex-1 bg-[#F4F5F7]" edges={["top", "bottom"]}>
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
          <Pressable
            onPress={() => router.back()}
            className="mt-6 h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <Feather name="arrow-left" size={18} color="#6366F1" />
          </Pressable>

          <View className="mt-6 items-center">
            <View className="relative h-20 w-20 items-center justify-center rounded-full bg-black">
              <Text className="text-2xl font-bold text-red-500">N</Text>
              <Pressable className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                <Feather name="edit-2" size={12} color="#ffffff" />
              </Pressable>
            </View>
            <Text className="mt-3 text-xl font-bold text-slate-900">
              Netflix
            </Text>
            <Text className="text-xs uppercase tracking-widest text-slate-400">
              Entertainment
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
            onPress={() => router.push("/edit-account")}
            className="mt-8 items-center rounded-2xl bg-white px-6 py-3 shadow-sm"
          >
            <Text className="text-sm font-semibold text-slate-700">
              Edit Account
            </Text>
          </Pressable>

          <Pressable className="mt-4 items-center rounded-2xl bg-red-500 px-6 py-3 shadow-sm">
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
