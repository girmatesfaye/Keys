import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="vault-add" options={{ headerShown: false }} />
        <Stack.Screen name="vault-edit" options={{ headerShown: false }} />
        {/* <Stack.Screen name="vault-detail" options={{ headerShown: false }} /> */}
        <Stack.Screen name="edit-account" options={{ headerShown: false }} />
        <Stack.Screen name="master-password" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
