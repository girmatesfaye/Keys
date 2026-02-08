import { Feather } from "@expo/vector-icons";
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

export default function EditAccountScreen() {
  const router = useRouter();
  const categories = useMemo(() => categoryOptions, []);
  const [serviceName, setServiceName] = useState("Streaming Service");
  const [category, setCategory] = useState(
    categories.find((filter) => filter.value === "ENTERTAINMENT")?.value ??
      categories[0]?.value ??
      "",
  );
  const [email, setEmail] = useState("alex.morris@gmail.com");
  const [password, setPassword] = useState("supersecurepassword");
  const [showPassword, setShowPassword] = useState(false);

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

          <View className="mt-6 items-center">
            <View className="relative h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
              <Text className="text-xs font-bold text-indigo-500">N</Text>
              <Text className="text-xs font-bold text-red-500">ET</Text>
              <Text className="text-xs font-bold text-indigo-500">FLIX</Text>
              <Pressable className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                <Feather name="edit-2" size={12} color="#ffffff" />
              </Pressable>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400">
              Service Name
            </Text>
            <TextInput
              value={serviceName}
              onChangeText={setServiceName}
              className="mt-2 rounded-xl bg-white px-4 py-5 text-sm font-semibold text-slate-900 shadow-sm"
            />
          </View>

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

          <Pressable className="mt-8 items-center rounded-full bg-indigo-500 px-6 py-3 shadow-lg">
            <Text className="text-sm font-semibold text-white">
              Save Changes
            </Text>
          </Pressable>

          <Pressable className="mt-4 items-center">
            <Text className="text-xs font-semibold text-rose-500">
              Delete Account
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
