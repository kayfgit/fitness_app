import React from "react";
import { Text, View } from "react-native";

export default function QuestHubScreen() {
  return (
    <View className="flex-1 bg-slate-900 items-center justify-center p-6">
      <Text className="text-white text-xl font-semibold mb-2">QuestHub</Text>
      <Text className="text-slate-300 text-center">
        Create, edit, and select A/B/C day routines here. (Coming soon)
      </Text>
    </View>
  );
}
