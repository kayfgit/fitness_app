import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/theme";

export default function SettingsThemeScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.primary,
          backgroundColor: theme.panel,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8, width: 32 }}>
          <ArrowLeft size={22} color={theme.primary} />
        </Pressable>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Text style={{ color: theme["text-light"], fontSize: 20, marginBottom: 24 }}>
          Select Theme
        </Text>
        <Pressable
          onPress={() => setTheme("blue")}
          style={{
            backgroundColor: theme.panel,
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme["text-light"], fontSize: 16 }}>Blue Theme</Text>
        </Pressable>
        <Pressable
          onPress={() => setTheme("purple")}
          style={{
            backgroundColor: theme.panel,
            padding: 16,
            borderRadius: 8,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme["text-light"], fontSize: 16 }}>Purple Theme</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
