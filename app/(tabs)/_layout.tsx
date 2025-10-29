import { Tabs } from "expo-router";
import { Dumbbell, ListTodo, User } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0f172a", // slate-900
          borderTopColor: "#164e63", // cyan-800
        },
        tabBarActiveTintColor: "#06b6d4", // cyan-500
        tabBarInactiveTintColor: "#94a3b8", // slate-400
      }}
    >
      <Tabs.Screen
        name="questhub"
        options={{
          title: "QuestHub",
          tabBarIcon: ({ color, size }) => (
            <View>
              <ListTodo color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="current"
        options={{
          title: "Current",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Dumbbell color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <View>
              <User color={color} size={size} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
