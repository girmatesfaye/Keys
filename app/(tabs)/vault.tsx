import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

const filters = [
  { label: "All", value: "all" },
  { label: "Social", value: "SOCIAL" },
  { label: "Shopping", value: "SHOPPING" },
  { label: "Bank", value: "FINANCE" },
  { label: "Travel", value: "TRAVEL" },
];

const vaultItems = [
  { name: "Netflix", category: "ENTERTAINMENT", color: "bg-rose-100" },
  { name: "Amazon", category: "SHOPPING", color: "bg-amber-100" },
  { name: "Gmail", category: "EMAIL", color: "bg-orange-100" },
  { name: "Spotify", category: "MUSIC", color: "bg-emerald-100" },
  { name: "Banking", category: "FINANCE", color: "bg-slate-200" },
  { name: "Work Slack", category: "WORK", color: "bg-fuchsia-100" },
  { name: "Twitter / X", category: "SOCIAL", color: "bg-zinc-200" },
  { name: "Linkedin", category: "CAREER", color: "bg-sky-100" },
  { name: "Trip Planner", category: "TRAVEL", color: "bg-blue-100" },
];

export default function VaultScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return vaultItems.filter((item) => {
      const matchesFilter =
        activeFilter === "all" || item.category === activeFilter;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <View className="flex-1 bg-[#F4F5F7]">
      <ScrollView contentContainerClassName="px-5 pb-20">
        <Text className="mt-8 text-xs uppercase text-slate-400 tracking-widest">
          My vault
        </Text>
        <Text className="mt-2 text-2xl font-bold text-slate-900">
          Good Morning,
        </Text>
        <Text className="text-2xl font-bold text-slate-900">Alex</Text>

        <View className="mt-5 rounded-2xl bg-white px-4 py-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <Ionicons name="person" size={18} color="#9CA3AF" />
              </View>
              <View className="ml-3">
                <Text className="text-xs text-slate-400">MY VAULT</Text>
                <Text className="text-base font-semibold text-slate-900">
                  Personal
                </Text>
              </View>
            </View>
            <View className="relative">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-orange-200">
                <Ionicons name="key" size={18} color="#ffffff" />
              </View>
              <View className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500" />
            </View>
          </View>

          <View className="mt-4 flex-row items-center rounded-2xl bg-slate-50 px-3">
            <Feather name="search" size={16} color="#9CA3AF" />
            <TextInput
              placeholder="Search vault..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="ml-2 flex-1 py-3 text-sm text-slate-700"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            contentContainerClassName="gap-2"
          >
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <Pressable
                  key={filter.value}
                  onPress={() => setActiveFilter(filter.value)}
                  className={`rounded-full px-4 py-2 ${
                    isActive ? "bg-indigo-600" : "bg-slate-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View className="mt-4 flex-row flex-wrap justify-between">
            {filteredItems.map((item) => (
              <View
                key={item.name}
                className="mb-4 w-[48%] rounded-2xl bg-white p-4 shadow-sm"
              >
                <View
                  className={`h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                >
                  <Text className="text-base font-semibold text-slate-700">
                    {item.name.slice(0, 1)}
                  </Text>
                </View>
                <Text className="mt-3 text-sm font-semibold text-slate-900">
                  {item.name}
                </Text>
                <Text className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">
                  {item.category}
                </Text>
              </View>
            ))}
            {filteredItems.length === 0 && (
              <View className="w-full items-center rounded-2xl bg-slate-50 px-4 py-8">
                <Text className="text-sm font-semibold text-slate-500">
                  No vault items found
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push("/vault-add")}
        className="absolute bottom-6 right-6 h-12 w-12 items-center justify-center rounded-full bg-rose-500 shadow-lg"
      >
        <Feather name="plus" size={20} color="#ffffff" />
      </Pressable>
    </View>
  );
}
