import { useRouter } from "expo-router";
import { ArrowLeft, FileDown, Moon, Shield, Siren } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsMenuScreen() {
  const router = useRouter();

  const Item = ({
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
        <Text className="text-cyan-300">›</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="p-4 border-b border-cyan-500/20 bg-slate-900/90">
        <Pressable onPress={() => router.back()} className="p-2 w-8">
          <ArrowLeft size={22} color="#06b6d4" />
        </Pressable>
      </View>
      <View className="flex-1 p-6">
        <Text className="text-white text-2xl font-bold text-center mb-6 tracking-widest">
          SETTINGS
        </Text>

        <Item
          label="theme"
          onPress={() =>
            router.push({ pathname: "/(tabs)/profile/settings/theme" } as any)
          }
          icon={<Moon size={20} color="#22d3ee" />}
        />
        <Item
          label="notifications"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/profile/settings/notifications",
            } as any)
          }
          icon={<Siren size={20} color="#22d3ee" />}
        />
        <Item
          label="permissions"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/profile/settings/permissions",
            } as any)
          }
          icon={<Shield size={20} color="#22d3ee" />}
        />
        <Item
          label="penalties"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/profile/settings/penalties",
            } as any)
          }
          icon={<Shield size={20} color="#22d3ee" />}
        />

        <View className="flex-1" />

        <Pressable className="mt-auto rounded-2xl border border-cyan-500/40 bg-slate-800/70 px-4 py-4 items-center justify-center">
          <View className="flex-row items-center gap-2">
            <FileDown size={20} color="#06b6d4" />
            <Text className="text-cyan-300 text-lg">download data</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
