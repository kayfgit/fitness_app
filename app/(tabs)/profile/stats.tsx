import { useRouter } from "expo-router";
import { ArrowLeft, ChevronUp } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/theme";

const StatItem = ({
  label,
  value,
  showUp,
}: {
  label: string;
  value: string | number;
  showUp?: boolean;
}) => {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ color: theme.text, fontSize: 18 }}>{label}:</Text>
        <Text style={{ color: theme["text-light"], fontSize: 18, fontWeight: "600" }}>{value}</Text>
      </View>
      {showUp && (
        <Pressable
          style={{
            padding: 4,
            backgroundColor: theme.primary + "33",
            borderRadius: 6,
          }}
        >
          <ChevronUp size={18} color={theme.primary} />
        </Pressable>
      )}
    </View>
  );
};

export default function ProfileStatsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.primary + "33",
          backgroundColor: theme.panel + "E6",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <ArrowLeft size={22} color={theme.primary} />
        </Pressable>
        <Text
          style={{
            color: theme["text-light"],
            fontSize: 24,
            fontWeight: "bold",
            letterSpacing: 0.1,
          }}
        >
          STATS
        </Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={{ flex: 1, padding: 24 }}>
        <View
          style={{
            padding: 16,
            backgroundColor: theme.panel + "80",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.primary + "33",
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            <View style={{ width: "50%", paddingRight: 8 }}>
              <StatItem label="STRENGTH" value={16} showUp />
            </View>
            <View style={{ width: "50%", paddingLeft: 8 }}>
              <StatItem label="HEALTH" value={10} showUp />
            </View>
            <View style={{ width: "50%", paddingRight: 8, marginTop: 16 }}>
              <StatItem label="AGILITY" value={10} showUp />
            </View>
            <View style={{ width: "50%", paddingLeft: 8, marginTop: 16 }}>
              <StatItem label="INTELLIGENCE" value={10} showUp />
            </View>
            <View style={{ width: "50%", paddingRight: 8, marginTop: 16 }}>
              <StatItem label="SENSE" value={10} showUp />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
