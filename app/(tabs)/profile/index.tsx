import { useRouter } from "expo-router";
import { ChevronRight, TriangleAlert, Bell, User2, Palette, ChartLine } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuests } from "../../../context/quests";

export default function ProfileScreen() {
  const router = useRouter();
  const { devModeBypass, toggleDevMode } = useQuests();

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
      className="mb-4 rounded-2xl border border-cyan-500/30 bg-slate-800/70 px-4 py-4"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {icon}
          <Text className="text-white text-lg">{label}</Text>
        </View>
        <ChevronRight size={20} color="#22d3ee" />
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 p-6">
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full border-2 border-cyan-400/60 bg-slate-800 items-center justify-center">
            <User2 size={40} color="#06b6d4" />
          </View>
          <Text className="mt-3 text-white text-xl tracking-wide">
            PROFILE
          </Text>
        </View>

        <Row
          label="Stats"
          onPress={() =>
            router.push({ pathname: "/(tabs)/profile/stats" } as any)
          }
          icon={<ChartLine size={20} color="#22d3ee" />}
        />
        <Row
          label="Notifications"
          onPress={() =>
            router.push({ pathname: "/(tabs)/profile/notifications" } as any)
          }
          icon={<Bell size={20} color="#22d3ee" />}
        />
        <Row
          label="Penalties"
          onPress={() =>
            router.push({ pathname: "/(tabs)/profile/penalties" } as any)
          }
          icon={<TriangleAlert size={20} color="#22d3ee" />}
        />


        <Row
          label="Themes"
          onPress={() =>
            router.push({ pathname: "/(tabs)/profile/theme" } as any)
          }
          icon={<Palette size={20} color="#22d3ee" />}
        />

        <View className="mt-auto pt-4">
          <Pressable
            onPress={toggleDevMode}
            className="rounded-2xl border border-yellow-500/30 bg-slate-800/70 px-4 py-4"
          >
            <Text className="text-center text-yellow-400">
              Dev: Bypass Daily Reset ({devModeBypass ? "ON" : "OFF"})
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
