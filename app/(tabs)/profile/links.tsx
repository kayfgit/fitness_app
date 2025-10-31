import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileLinksScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="p-4 border-b border-cyan-500/20 bg-slate-900/90">
        <Pressable onPress={() => router.back()} className="p-2 w-8">
          <ArrowLeft size={22} color="#06b6d4" />
        </Pressable>
      </View>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-white text-xl font-semibold mb-2">Links</Text>
        <Text className="text-slate-300 text-center">
          Connect to other apps (coming soon)
        </Text>
      </View>
    </SafeAreaView>
  );
}
