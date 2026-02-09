import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/typography";

export default function SettingsScreen() {
  const router = useRouter();
  const [backupEnabled, setBackupEnabled] = useState(true);
  const toastOpacity = useRef(new Animated.Value(1)).current;
  const toastTranslate = useRef(new Animated.Value(0)).current;
  const toastScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(toastTranslate, {
            toValue: -6,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(toastScale, {
            toValue: 1.02,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(toastTranslate, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(toastScale, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1200),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [toastScale, toastTranslate]);

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FC]" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-5 pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <Feather name="arrow-left" size={18} color="#111827" />
          </Pressable>
          <Text className="text-base font-semibold text-slate-900">
            Backup & Sync
          </Text>
          <View className="h-10 w-10" />
        </View>

        <View className="mt-8 items-center">
          <View className="h-48 w-48 items-center justify-center rounded-full bg-[#EAF4FF]">
            <View className="h-40 w-40 items-center justify-center rounded-full bg-[#E6EFFB]">
              <View className="h-28 w-28 items-center justify-center rounded-full bg-[#EAF7F5]">
                <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#39C0B7]">
                  <View className="absolute -top-3 h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
                    <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                  </View>
                  <Ionicons name="cloud" size={36} color="#0B1B3A" />
                  <View className="absolute h-9 w-9 items-center justify-center rounded-2xl bg-[#5B61E9]">
                    <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Text className="mt-6 text-center text-3xl font-bold text-slate-900">
          Keep your passwords
        </Text>
        <Text className="text-center text-3xl font-bold text-slate-900">
          safe
        </Text>
        <Text className="mt-3 text-center text-base text-slate-500">
          Enable automatic encrypted backups
        </Text>
        <Text className="text-center text-base text-slate-500">
          to your device for peace of mind.
        </Text>

        <View className="mt-8 rounded-3xl bg-white px-5 py-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-semibold text-slate-900">
                Secure Backup to Phone
              </Text>
              <Text className="mt-1 text-sm text-slate-400">
                Daily auto-sync
              </Text>
            </View>
            <Switch
              value={backupEnabled}
              onValueChange={setBackupEnabled}
              trackColor={{ false: "#5B61E9", true: "#C7D2FE" }}
              thumbColor={backupEnabled ? "#5B61E9" : "#FFFFFF"}
            />
          </View>
        </View>

        <View className="mt-6 flex-row items-center justify-center">
          <Feather name="refresh-cw" size={16} color="#94A3B8" />
          <Text className="ml-2 text-sm text-slate-400">
            Last saved: Just now
          </Text>
        </View>

        <Pressable className="mt-8 flex-row items-center justify-center rounded-full bg-[#EEF0FF] px-6 py-4">
          <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-[#E0E6FF]">
            <Ionicons name="shield-checkmark" size={16} color="#5B61E9" />
          </View>
          <Text className="text-sm font-semibold text-[#5B61E9]">
            Learn more about encryption
          </Text>
        </Pressable>

        <Text className="mt-4 text-center text-xs text-slate-400">
          Your data is encrypted locally using AES-256
        </Text>
        <Text className="text-center text-xs text-slate-400">
          before being saved to your iCloud Drive.
        </Text>
      </ScrollView>

      <Animated.View
        style={[
          styles.toast,
          {
            opacity: toastOpacity,
            transform: [{ translateY: toastTranslate }, { scale: toastScale }],
          },
        ]}
      >
        <Feather name="clock" size={15} color="#FFFFFF" />
        <Text className="ml-2 text-lg font-semibold text-white">
          Coming soon
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 85,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#553be6",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
