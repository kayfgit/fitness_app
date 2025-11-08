import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/theme";

export default function SettingsNotificationsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.primary + "33",
          backgroundColor: theme.panel + "E6",
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8, width: 40 }}>
          <ArrowLeft size={22} color={theme.primary} />
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Text style={{ color: theme["text-light"], fontSize: 20 }}>
          Notification settings (coming soon)
        </Text>
      </View>
    </SafeAreaView>
  );
}
