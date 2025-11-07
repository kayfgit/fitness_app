import { useRouter } from "expo-router";
import { ArrowLeft, ChevronUp } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StatItem = ({
  label,
  value,
  showUp,
}: {
  label: string;
  value: string | number;
  showUp?: boolean;
}) => (
  <View className="flex-row items-center justify-between">
    <View className="flex-row items-center gap-2">
      <Text className="text-slate-400 text-lg">{label}:</Text>
      <Text className="text-white text-lg font-semibold">{value}</Text>
    </View>
    {showUp && (
      <Pressable className="p-1 bg-cyan-500/20 rounded-md">
        <ChevronUp size={18} color="#06b6d4" />
      </Pressable>
    )}
  </View>
);

export default function ProfileStatsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="p-4 border-b border-cyan-500/20 bg-slate-900/90 flex-row justify-between items-center">
        <Pressable onPress={() => router.back()} className="p-2">
          <ArrowLeft size={22} color="#06b6d4" />
        </Pressable>
        <Text className="text-white text-2xl font-bold tracking-widest">
          STATS
        </Text>
        <View className="w-8" />
      </View>
      <View className="flex-1 p-6 space-y-6">

        <View className="p-4 bg-slate-800/50 rounded-lg border border-cyan-500/20">
          <View className="flex-row flex-wrap justify-between">
            <View className="w-1/2 pr-2">
              <StatItem label="STRENGTH" value={16} showUp />
            </View>
            <View className="w-1/2 pl-2">
              <StatItem label="HEALTH" value={10} showUp />
            </View>
            <View className="w-1/2 pr-2 mt-4">
              <StatItem label="AGILITY" value={10} showUp />
            </View>
            <View className="w-1/2 pl-2 mt-4">
              <StatItem label="INTELLIGENCE" value={10} showUp />
            </View>
            <View className="w-1/2 pr-2 mt-4">
              <StatItem label="SENSE" value={10} showUp />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
