import { Tabs } from "expo-router";
import { Dumbbell, ListTodo, User } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../../context/theme";

export default function TabsLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.primary,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text,
      }}
    >
      <Tabs.Screen
        name="quests"
        options={{
          title: "Quests",
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
