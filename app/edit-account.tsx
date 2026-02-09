import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput } from "../components/typography";
import { categoryOptions, getWebsiteLogoUrl } from "../constants/vault";
import { getCredential, updateCredential } from "../lib/secureStore";

export default function EditAccountScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const categories = useMemo(() => categoryOptions, []);
  const [category, setCategory] = useState(
    categories.find((filter) => filter.value === "ENTERTAINMENT")?.value ??
      categories[0]?.value ??
      "",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [iconUri, setIconUri] = useState<string | null>(null);
  const [linkVisible, setLinkVisible] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      setCategory(item.category);
      setEmail(item.email);
      setPassword(item.password);
      setWebsite(item.website ?? item.serviceName);
      setIconUri(item.iconUri ?? null);
    };

    loadCredential();

    return () => {
      isActive = false;
    };
  }, [id]);

  const resolvedIconUri = iconUri
    ? iconUri
    : website
      ? getWebsiteLogoUrl(website)
      : "";

  const isValidImageLink = (value: string) => /^https?:\/\//.test(value.trim());

  const isImageUrl = (value: string) =>
    /\.(png|jpe?g|webp|gif|svg|ico)(\?.*)?$/i.test(value.trim());

  const resolveIconUri = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "";
    }

    if (isImageUrl(trimmed) && isValidImageLink(trimmed)) {
      return trimmed;
    }

    return getWebsiteLogoUrl(trimmed);
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

  const handleSave = async () => {
    if (!id) {
      setError("Missing vault item.");
      return;
    }

    if (!isValidWebsite(website)) {
      setError("Enter a valid website.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setError("Enter a password.");
      return;
    }

    setError("");

    await updateCredential(id, {
      serviceName: website
        .trim()
        .replace(/^https?:\/\//, "")
        .split("/")[0],
      website: website.trim(),
      email: email.trim(),
      password,
      category,
      iconUri,
    });

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F5F7]" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-5 pb-28"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <View className="mt-4 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <Feather name="arrow-left" size={18} color="#6366F1" />
            </Pressable>
            <Text className="text-base font-semibold text-slate-900">
              Edit Account
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
            <View className="relative h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-indigo-100">
              {resolvedIconUri ? (
                <Image
                  source={{ uri: resolvedIconUri }}
                  style={styles.headerIcon}
                  contentFit="cover"
                />
              ) : (
                <Text className="text-sm font-bold text-indigo-500">
                  {(website || "?").slice(0, 1).toUpperCase()}
                </Text>
              )}
              <Pressable className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                <Feather name="edit-2" size={12} color="#ffffff" />
              </Pressable>
            </View>
          </View>

          <View className="mt-4 flex-row items-center">
            <Pressable
              onPress={async () => {
                const permission =
                  await ImagePicker.requestMediaLibraryPermissionsAsync();
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
                  setError("");
                }
              }}
              className="flex-1 flex-row items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2"
            >
              <Feather name="upload" size={14} color="#64748B" />
              <Text className="ml-2 text-xs font-semibold text-slate-600">
                Upload Photo
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setLinkVisible((prev) => !prev)}
              className="ml-3 flex-1 flex-row items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2"
            >
              <Feather name="link-2" size={14} color="#64748B" />
              <Text className="ml-2 text-xs font-semibold text-slate-600">
                Use Link
              </Text>
            </Pressable>
          </View>
          {linkVisible && (
            <View className="mt-3 flex-row items-center rounded-full bg-white px-4 py-2 shadow-sm">
              <TextInput
                value={linkValue}
                onChangeText={setLinkValue}
                autoCapitalize="none"
                placeholder="Paste image or website URL"
                placeholderTextColor="#94A3B8"
                className="flex-1 text-sm text-slate-700"
              />
              <Pressable
                onPress={() => {
                  const resolved = resolveIconUri(linkValue);
                  if (!resolved) {
                    setError("Add a valid image or website link.");
                    return;
                  }
                  setIconUri(resolved);
                  setLinkVisible(false);
                  setLinkValue("");
                  setError("");
                }}
                className="ml-2 rounded-full bg-indigo-500 px-3 py-2"
              >
                <Text className="text-xs font-semibold text-white">Apply</Text>
              </Pressable>
            </View>
          )}

          <View className="mt-4">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              Category
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-2"
              contentContainerClassName="gap-2"
            >
              {categories.map((option) => {
                const isActive = category === option.value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setCategory(option.value)}
                    className={`rounded-full px-4 py-2 ${
                      isActive ? "bg-indigo-500" : "bg-white"
                    } shadow-sm`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isActive ? "text-white" : "text-slate-600"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View className="mt-4">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              Email/Username
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="mt-2 rounded-xl bg-white px-4 py-5 text-sm font-semibold text-slate-900 shadow-sm"
            />
          </View>

          <View className="mt-4">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              Password
            </Text>
            <View className="mt-2 flex-row items-center rounded-xl bg-white px-4 py-3 shadow-sm">
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 text-sm font-semibold text-slate-900"
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-slate-100"
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={14}
                  color="#64748B"
                />
              </Pressable>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              Website
            </Text>
            <TextInput
              value={website}
              onChangeText={setWebsite}
              autoCapitalize="none"
              className="mt-2 rounded-xl bg-white px-4 py-5 text-sm font-semibold text-slate-900 shadow-sm"
            />
          </View>

          <Pressable
            onPress={handleSave}
            className="mt-8 items-center rounded-full bg-indigo-500 px-6 py-3 shadow-lg"
          >
            <Text className="text-sm font-semibold text-white">
              Save Changes
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    width: 80,
    height: 80,
  },
});
