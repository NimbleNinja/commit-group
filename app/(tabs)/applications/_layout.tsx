import { Slot, Stack } from "expo-router";

export default function ApplicationsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="new-application" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: "Application details" }} />
    </Stack>
  );
}
