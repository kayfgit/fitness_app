import { useNavigation } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";

export default function ProfileStackLayout() {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    const onFocus = navigation.addListener("focus", () => {
      router.replace("/(tabs)/profile");
    });
    return onFocus;
  }, [navigation, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
