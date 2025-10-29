import React from "react";
import { Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-slate-900 items-center justify-center p-6">
      <Text className="text-white text-xl font-semibold mb-2">Profile</Text>
      <Text className="text-slate-300 text-center">
        Track stats like weight, body fat, and measurements. (Coming soon)
      </Text>
    </View>
  );
}
