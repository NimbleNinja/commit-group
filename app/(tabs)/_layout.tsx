import { Tabs } from "expo-router";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="applications"
        options={{
          title: "Applications: client",
          tabBarLabel: "Applications",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="application"
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
