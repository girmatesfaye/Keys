import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { categoryOptions } from "../constants/vault";
import { saveCredential } from "../lib/secureStore";

const generatePassword = (length = 14) => {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  let output = "";
  for (let i = 0; i < length; i += 1) {
    output += chars[Math.floor(Math.random() * chars.length)];
  }
  return output;
};

const getStrength = (value: string) => {
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  const lengthScore = value.length >= 12 ? 1 : 0;
  const varietyScore = [hasUpper, hasLower, hasNumber, hasSymbol].filter(
    Boolean,
  ).length;
  const score = lengthScore + Math.min(varietyScore, 3);
  return Math.min(score, 4);
};

export default function VaultAddScreen() {
  const router = useRouter();
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState(categoryOptions[0]?.value ?? "");
  const [iconUri, setIconUri] = useState<string | null>(null);
  const [linkVisible, setLinkVisible] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [formError, setFormError] = useState("");

  const strengthScore = useMemo(() => getStrength(password), [password]);
  const strengthLabel =
    strengthScore >= 4
      ? "Strong password"
      : strengthScore >= 3
        ? "Good password"
        : strengthScore >= 2
          ? "Fair password"
          : "Weak password";
  const strengthWidth = `${(strengthScore / 4) * 100}%`;
  const strengthColor =
    strengthScore >= 4
      ? "bg-emerald-500"
      : strengthScore >= 3
        ? "bg-lime-500"
        : strengthScore >= 2
          ? "bg-amber-400"
          : "bg-rose-400";
  const strengthTextColor =
    strengthScore >= 4
      ? "text-emerald-600"
      : strengthScore >= 3
        ? "text-lime-600"
        : strengthScore >= 2
          ? "text-amber-600"
          : "text-rose-500";

  const serviceName = website
    .trim()
    .replace(/^https?:\/\//, "")
    .split("/")[0];

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

  const isValidImageLink = (value: string) => /^https?:\/\//.test(value.trim());

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setIconUri(result.assets[0].uri);
      setLinkValue("");
      setFormError("");
    }
  };

  const handleApplyLink = () => {
    const trimmed = linkValue.trim();
    if (!isValidImageLink(trimmed)) {
      setFormError("Add a valid image link.");
      return;
    }

    setIconUri(trimmed);
    setLinkVisible(false);
    setLinkValue("");
    setFormError("");
  };

  const handleSave = async () => {
    if (!serviceName || !email.trim() || !password || !website.trim()) {
      setFormError("Please complete all fields.");
      return;
    }

    if (!isValidWebsite(website)) {
      setFormError("Enter a valid website.");
      return;
    }

    if (!isValidEmail(email)) {
      setFormError("Enter a valid email address.");
      return;
    }

    setFormError("");

    await saveCredential({
      serviceName,
      email: email.trim(),
      password,
      category,
      iconUri,
    });

    setWebsite("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setIconUri(null);
    setLinkVisible(false);
    setLinkValue("");
    router.back();
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
              Add New Password
            </Text>
            <View className="h-10 w-10" />
          </View>

          {formError.length > 0 && (
            <View className="mt-4 flex-row items-center rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
              <Feather name="alert-circle" size={16} color="#F43F5E" />
              <Text className="ml-2 text-xs font-semibold text-rose-600">
                {formError}
              </Text>
            </View>
          )}

          <View className="mt-6">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              Service Icon
            </Text>
            <View className="mt-3 flex-row items-center">
              <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50">
                {iconUri ? (
                  <Image
                    source={{ uri: iconUri }}
                    className="h-14 w-14 rounded-full"
                    contentFit="cover"
                  />
                ) : (
                  <Feather name="plus" size={20} color="#94A3B8" />
                )}
              </View>
              <View className="ml-4 flex-1">
                <Pressable
                  onPress={handlePickImage}
                  className="mb-2 flex-row items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2"
                >
                  <Feather name="upload" size={14} color="#64748B" />
                  <Text className="ml-2 text-xs font-semibold text-slate-600">
                    Upload Photo
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setLinkVisible((prev) => !prev)}
                  className="flex-row items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2"
                >
                  <Feather name="link-2" size={14} color="#64748B" />
                  <Text className="ml-2 text-xs font-semibold text-slate-600">
                    Use Link
                  </Text>
                </Pressable>
              </View>
            </View>
            {linkVisible && (
              <View className="mt-3 flex-row items-center rounded-full bg-white px-4 py-2 shadow-sm">
                <TextInput
                  value={linkValue}
                  onChangeText={setLinkValue}
                  autoCapitalize="none"
                  placeholder="Paste image URL"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 text-sm text-slate-700"
                />
                <Pressable
                  onPress={handleApplyLink}
                  className="ml-2 rounded-full bg-indigo-500 px-3 py-2"
                >
                  <Text className="text-xs font-semibold text-white">
                    Apply
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          <View className="mt-6">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              What is the website?
            </Text>
            <View className="mt-2 flex-row items-center rounded-full bg-slate-100 px-4 py-3">
              <Feather name="globe" size={16} color="#94A3B8" />
              <TextInput
                value={website}
                onChangeText={(value) => {
                  setWebsite(value);
                  if (formError) {
                    setFormError("");
                  }
                }}
                autoCapitalize="none"
                placeholder="e.g. example.com"
                placeholderTextColor="#94A3B8"
                className="ml-3 flex-1 text-sm text-slate-700"
              />
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              Your Email
            </Text>
            <View className="mt-2 flex-row items-center rounded-full bg-slate-100 px-4 py-3">
              <Feather name="at-sign" size={16} color="#94A3B8" />
              <TextInput
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (formError) {
                    setFormError("");
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="username@email.com"
                placeholderTextColor="#94A3B8"
                className="ml-3 flex-1 text-sm text-slate-700"
              />
            </View>
          </View>

          <View className="mt-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-[10px] uppercase tracking-widest text-slate-400">
                Your Password
              </Text>
              <Pressable onPress={() => setPassword(generatePassword())}>
                <Text className="text-xs font-semibold text-indigo-500">
                  Generate
                </Text>
              </Pressable>
            </View>
            <View className="mt-2 flex-row items-center rounded-full bg-slate-100 px-4 py-3">
              <Feather name="lock" size={16} color="#94A3B8" />
              <TextInput
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (formError) {
                    setFormError("");
                  }
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholder="Enter a password"
                placeholderTextColor="#94A3B8"
                className="ml-3 flex-1 text-sm text-slate-700"
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                className="h-8 w-8 items-center justify-center rounded-full bg-white"
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={14}
                  color="#64748B"
                />
              </Pressable>
            </View>
            <View className="mt-2 h-1 rounded-full bg-slate-200">
              <View
                className={`h-1 rounded-full ${strengthColor}`}
                style={{ width: `${(strengthScore / 4) * 100}%` }}
              />
            </View>
            <Text className={`mt-2 text-xs font-semibold ${strengthTextColor}`}>
              {strengthLabel}
            </Text>
          </View>

          <View className="mt-6">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              Category
            </Text>
            <View className="mt-3 flex-row flex-wrap gap-3">
              {categoryOptions.map((option) => {
                const isActive = category === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setCategory(option.value)}
                    className={`flex-row items-center rounded-full px-4 py-2 shadow-sm ${
                      isActive
                        ? "bg-indigo-500"
                        : "border border-slate-200 bg-white"
                    }`}
                  >
                    <Feather
                      name={option.icon}
                      size={14}
                      color={isActive ? "#FFFFFF" : "#64748B"}
                    />
                    <Text
                      className={`ml-2 text-xs font-semibold ${
                        isActive ? "text-white" : "text-slate-600"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            onPress={handleSave}
            className="mt-6 flex-row items-center justify-center rounded-full bg-indigo-500 px-6 py-4 shadow-lg"
          >
            <Feather name="lock" size={16} color="#FFFFFF" />
            <Text className="ml-2 text-sm font-semibold text-white">
              Save to Vault
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
