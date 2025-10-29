import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-white text-xl font-semibold mb-2">Profile</Text>
        <Text className="text-slate-300 text-center">
          Track stats like weight, body fat, and measurements. (Coming soon)
        </Text>
      </View>
    </SafeAreaView>
  );
}
