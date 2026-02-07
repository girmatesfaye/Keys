import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function VaultAddScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F4F5F7]">
      <ScrollView contentContainerClassName="px-5 pb-10">
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
          <Text className="mt-3 text-xl font-bold text-slate-900">Netflix</Text>
          <Text className="text-xs uppercase tracking-widest text-slate-400">
            Entertainment
          </Text>
        </View>

        <View className="mt-6 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <Text className="text-[10px] uppercase tracking-widest text-slate-400">
            Email
          </Text>
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-slate-900">
              alex.morris@gmail.com
            </Text>
            <Pressable className="h-8 w-8 items-center justify-center rounded-full bg-indigo-50">
              <Feather name="copy" size={14} color="#6366F1" />
            </Pressable>
          </View>
        </View>

        <View className="mt-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <Text className="text-[10px] uppercase tracking-widest text-slate-400">
            Password
          </Text>
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-slate-900">
              ************
            </Text>
            <View className="flex-row items-center">
              <Pressable className="h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                <Feather name="eye" size={14} color="#64748B" />
              </Pressable>
              <Pressable className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-indigo-50">
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
            <Text className="text-sm font-semibold text-slate-900">
              netflix.com
            </Text>
            <Pressable className="h-8 w-8 items-center justify-center rounded-full bg-indigo-50">
              <Feather name="external-link" size={14} color="#6366F1" />
            </Pressable>
          </View>
        </View>

        <Pressable className="mt-8 items-center rounded-2xl bg-white px-6 py-3 shadow-sm">
          <Text className="text-lg font-semibold text-slate-700">
            Edit Account
          </Text>
        </Pressable>

        <Pressable className="mt-4 items-center rounded-2xl bg-white px-6 py-3 shadow-sm">
          <Text className="text-lg font-semibold text-rose-500">
            Delete Account
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
