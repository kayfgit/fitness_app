import { useRouter } from "expo-router";
import { ChevronRight, TriangleAlert, Bell, User2, Palette, ChartLine } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuests } from "../../../context/quests";
import { useTheme } from "../../../context/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const { devModeBypass, toggleDevMode } = useQuests();
  const { theme } = useTheme();

  const Row = ({
    label,
    onPress,
    icon,
  }: {
    label: string;
    onPress: () => void;
    icon: React.ReactNode;
  }) => (
    <Pressable
      onPress={onPress}
      style={{
        marginBottom: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.primary + "4D",
        backgroundColor: theme.panel + "B3",
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {icon}
          <Text style={{ color: theme["text-light"], fontSize: 18 }}>{label}</Text>
        </View>
        <ChevronRight size={20} color={theme["primary-light"]} />
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1, padding: 24 }}>
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              borderWidth: 2,
              borderColor: theme["primary-light"] + "99",
              backgroundColor: theme.panel,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User2 size={40} color={theme.primary} />
          </View>
          <Text
            style={{
              marginTop: 12,
              color: theme["text-light"],
              fontSize: 20,
              letterSpacing: 0.05,
            }}
          >
            PROFILE
          </Text>
        </View>

        <Row
          label="Stats"
          onPress={() =>
            router.push({ pathname: "/(tabs)/profile/stats" } as any)
          }
          icon={<ChartLine size={20} color={theme["primary-light"]} />}
        />
        <Row
          label="Notifications"
          onPress={() =>
            router.push({ pathname: "/(tabs)/profile/notifications" } as any)
          }
          icon={<Bell size={20} color={theme["primary-light"]} />}
        />
        <Row
          label="Penalties"
          onPress={() =>
            router.push({ pathname: "/(tabs)/profile/penalties" } as any)
          }
          icon={<TriangleAlert size={20} color={theme["primary-light"]} />}
        />


        <Row
          label="Themes"
          onPress={() =>
            router.push({ pathname: "/(tabs)/profile/theme" } as any)
          }
          icon={<Palette size={20} color={theme["primary-light"]} />}
        />

        <View style={{ marginTop: "auto", paddingTop: 16 }}>
          <Pressable
            onPress={toggleDevMode}
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#f59e0b" + "4D",
              backgroundColor: theme.panel + "B3",
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            <Text style={{ textAlign: "center", color: "#fbbf24" }}>
              Dev: Bypass Daily Reset ({devModeBypass ? "ON" : "OFF"})
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
