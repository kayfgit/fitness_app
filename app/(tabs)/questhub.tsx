import { useRouter } from "expo-router";
import { Pencil, Plus, ShieldCheck, X } from "lucide-react-native";
import React, { useMemo } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuests } from "../../context/quests";

export default function QuestHubScreen() {
  const { quests, activeQuestId, setActiveQuestId, createQuest, deleteQuest } =
    useQuests();
  const router = useRouter();

  const sorted = useMemo(() => {
    return [...quests].sort(
      (a, b) =>
        (a.id === activeQuestId ? -1 : 0) - (b.id === activeQuestId ? -1 : 0)
    );
  }, [quests, activeQuestId]);

  function confirmDelete(id: string, title: string) {
    Alert.alert(
      "Delete Quest",
      `Are you sure you want to delete "${title}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteQuest(id),
        },
      ]
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 p-4">
        <Text className="text-white text-2xl font-bold text-center mb-4 tracking-widest">
          QUEST HUB
        </Text>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {sorted.map((q) => {
            const isActive = q.id === activeQuestId;
            return (
              <View key={q.id} className="mb-3">
                <View
                  className={`flex-row items-center justify-between rounded-2xl border p-4 ${
                    isActive
                      ? "border-cyan-400/60 bg-slate-800/70"
                      : "border-cyan-500/20 bg-slate-800/50"
                  }`}
                >
                  <Pressable
                    onPress={() => setActiveQuestId(q.id)}
                    className="flex-1 pr-3"
                  >
                    <View className="flex-row items-center gap-2">
                      {isActive ? (
                        <ShieldCheck size={18} color="#06b6d4" />
                      ) : null}
                      <Text className="text-white text-lg">{q.title}</Text>
                    </View>
                  </Pressable>
                  <View className="flex-row items-center gap-3">
                    <Pressable
                      accessibilityLabel="Edit quest"
                      onPress={() =>
                        router.push({
                          pathname: "/quest-edit",
                          params: { id: q.id },
                        } as any)
                      }
                      hitSlop={8}
                    >
                      <Pencil size={22} color="#22d3ee" />
                    </Pressable>
                    <Pressable
                      accessibilityLabel="Delete quest"
                      onPress={() => confirmDelete(q.id, q.title)}
                      hitSlop={8}
                    >
                      <X size={22} color="#ef4444" />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}

          <Pressable
            onPress={() => {
              const created = createQuest("NEW QUEST");
              router.push({
                pathname: "/quest-edit",
                params: { id: created.id },
              } as any);
            }}
            className="mt-4 self-center flex-row items-center gap-2 rounded-full border border-cyan-500/40 px-4 py-2 bg-slate-800/60"
          >
            <Plus size={20} color="#06b6d4" />
            <Text className="text-cyan-300 text-base">New Quest</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
