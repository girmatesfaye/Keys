import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/typography";

const SYMBOLS = "!@#$";
const NUMBERS = "0123456789";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const buildPool = (
  includeNumbers: boolean,
  includeSymbols: boolean,
  includeUppercase: boolean,
  includeLowercase: boolean,
) => {
  let pool = "";
  if (includeLowercase) pool += LOWERCASE;
  if (includeUppercase) pool += UPPERCASE;
  if (includeNumbers) pool += NUMBERS;
  if (includeSymbols) pool += SYMBOLS;
  return pool;
};

const generatePassword = (
  length: number,
  includeNumbers: boolean,
  includeSymbols: boolean,
  includeUppercase: boolean,
  includeLowercase: boolean,
) => {
  const pool = buildPool(
    includeNumbers,
    includeSymbols,
    includeUppercase,
    includeLowercase,
  );
  if (!pool) return "";

  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += pool[Math.floor(Math.random() * pool.length)];
  }
  return result;
};

const getStrength = (
  length: number,
  includeNumbers: boolean,
  includeSymbols: boolean,
  includeUppercase: boolean,
  includeLowercase: boolean,
) => {
  const variety = [
    includeLowercase,
    includeUppercase,
    includeNumbers,
    includeSymbols,
  ].filter(Boolean).length;
  const lengthScore = length >= 14 ? 2 : length >= 10 ? 1 : 0;
  const score = Math.min(4, variety + lengthScore);
  if (score >= 4) return { label: "Strong", value: 4 };
  if (score >= 3) return { label: "Good", value: 3 };
  if (score >= 2) return { label: "Fair", value: 2 };
  return { label: "Weak", value: 1 };
};

export default function GeneratorScreen() {
  const router = useRouter();
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [password, setPassword] = useState("kL9#mP2$x");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardAnim = useRef(new Animated.Value(0)).current;

  const regenerate = useCallback(() => {
    const next = generatePassword(
      length,
      includeNumbers,
      includeSymbols,
      includeUppercase,
      includeLowercase,
    );
    setPassword(next || "");
  }, [
    length,
    includeNumbers,
    includeSymbols,
    includeUppercase,
    includeLowercase,
  ]);

  const strength = useMemo(
    () =>
      getStrength(
        length,
        includeNumbers,
        includeSymbols,
        includeUppercase,
        includeLowercase,
      ),
    [
      length,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      includeUppercase,
    ],
  );
  const strengthAnim = useRef(new Animated.Value(strength.value)).current;

  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [cardAnim]);

  useEffect(() => {
    Animated.timing(strengthAnim, {
      toValue: strength.value,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [strength.value, strengthAnim]);

  const handleToggle = (setter: (value: boolean) => void, value: boolean) => {
    setter(value);
  };

  const handleCopy = async () => {
    if (!password) return;
    await Clipboard.setStringAsync(password);
    setToastVisible(true);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F3F1]" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-5 pb-24"
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
            Generate Password
          </Text>
          <View className="h-10 w-10" />
        </View>

        <Animated.View
          className="mt-8 rounded-[28px] bg-white px-6 py-7 shadow-sm"
          style={{
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          }}
        >
          <View className="flex-row items-start justify-between">
            <Text className="text-3xl font-extrabold text-slate-900">
              {password || "-"}
            </Text>
            <Pressable
              onPress={regenerate}
              className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
            >
              <Feather name="refresh-cw" size={18} color="#9CA3AF" />
            </Pressable>
          </View>

          <View className="mt-6 flex-row items-center justify-center gap-2">
            {[1, 2, 3, 4].map((segment) => {
              const opacity = strengthAnim.interpolate({
                inputRange: [segment - 1, segment],
                outputRange: [0.2, 1],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={`seg-${segment}`}
                  className={`h-2 w-12 rounded-full ${
                    segment <= strength.value
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                  style={{ opacity }}
                />
              );
            })}
          </View>
          <Text className="mt-3 text-center text-sm font-semibold text-indigo-500">
            {strength.label}
          </Text>
        </Animated.View>

        <View className="mt-8 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-slate-900">Length</Text>
          <Text className="text-2xl font-bold text-indigo-500">{length}</Text>
        </View>
        <Slider
          value={length}
          minimumValue={6}
          maximumValue={24}
          step={1}
          minimumTrackTintColor="#4223f2"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#4223f2"
          onValueChange={(value) => setLength(Math.round(value))}
          onSlidingComplete={() => regenerate()}
          style={{ marginTop: 12 }}
        />

        <View className="mt-8">
          <View className="flex-row items-center justify-between py-3">
            <View>
              <Text className="text-lg font-semibold text-slate-900">
                Include Numbers
              </Text>
              <Text className="text-sm text-slate-500">0-9</Text>
            </View>
            <Switch
              value={includeNumbers}
              onValueChange={(value) => {
                handleToggle(setIncludeNumbers, value);
                regenerate();
              }}
              trackColor={{ false: "#8874fd", true: "#8874fd" }}
              thumbColor={includeNumbers ? "#4223f2" : "#FFFFFF"}
            />
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View>
              <Text className="text-lg font-semibold text-slate-900">
                Include Symbols
              </Text>
              <Text className="text-sm text-slate-500">!@#$</Text>
            </View>
            <Switch
              value={includeSymbols}
              onValueChange={(value) => {
                handleToggle(setIncludeSymbols, value);
                regenerate();
              }}
              trackColor={{ false: "#8874fd", true: "#8874fd" }}
              thumbColor={includeSymbols ? "#4223f2" : "#FFFFFF"}
            />
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View>
              <Text className="text-lg font-semibold text-slate-900">
                Uppercase
              </Text>
              <Text className="text-sm text-slate-500">A-Z</Text>
            </View>
            <Switch
              value={includeUppercase}
              onValueChange={(value) => {
                handleToggle(setIncludeUppercase, value);
                regenerate();
              }}
              trackColor={{ false: "#8874fd", true: "#8874fd" }}
              thumbColor={includeUppercase ? "#4223f2" : "#FFFFFF"}
            />
          </View>
        </View>

        <Pressable
          onPress={handleCopy}
          className="mt-10 flex-row items-center justify-center rounded-full bg-indigo-500 px-6 py-4 shadow-lg"
        >
          <Feather name="copy" size={18} color="#FFFFFF" />
          <Text className="ml-2 text-base font-semibold text-white">
            Copy Password
          </Text>
        </Pressable>
      </ScrollView>

      {toastVisible && (
        <View className="absolute top-6 self-center items-center rounded-full bg-indigo-500 px-6 py-3 shadow-lg">
          <Text className="text-sm font-semibold text-white">
            Password copied
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
