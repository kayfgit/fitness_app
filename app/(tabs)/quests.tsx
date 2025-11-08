import { useRouter } from "expo-router";
import { Pencil, Plus, ShieldCheck, X } from "lucide-react-native";
import React, { useMemo } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuests } from "../../context/quests";
import { useTheme } from "../../context/theme";

export default function QuestHubScreen() {
  const {
    quests,
    activeQuestId,
    setActiveQuestId,
    createQuest,
    deleteQuest,
    isQuestCompletedToday,
  } = useQuests();
  const router = useRouter();
  const { theme } = useTheme();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text
          style={{
            color: theme["text-light"],
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 16,
            letterSpacing: 0.1,
          }}
        >
          QUEST HUB
        </Text>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {sorted.map((q) => {
            const isActive = q.id === activeQuestId;
            const isCompleted = isQuestCompletedToday(q.id);
            return (
              <View key={q.id} style={{ marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 16,
                    borderWidth: 1,
                    padding: 16,
                    borderColor: isActive
                      ? theme["primary-light"]
                      : theme.primary,
                    backgroundColor: isActive ? theme.panel : theme.background,
                    opacity: isCompleted ? 0.5 : 1,
                  }}
                >
                  <Pressable
                    onPress={() => setActiveQuestId(q.id)}
                    style={{ flex: 1, paddingRight: 12 }}
                    disabled={isCompleted}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      {isActive ? (
                        <ShieldCheck size={18} color={theme.primary} />
                      ) : null}
                      <Text
                        style={{
                          fontSize: 18,
                          color: isCompleted ? theme.text : theme["text-light"],
                        }}
                      >
                        {q.title}
                      </Text>
                    </View>
                  </Pressable>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <Pressable
                      accessibilityLabel="Edit quest"
                      onPress={() =>
                        router.push({
                          pathname: "/quest-edit",
                          params: { id: q.id },
                        } as any)
                      }
                      hitSlop={8}
                      disabled={isCompleted}
                    >
                      <Pencil
                        size={22}
                        color={isCompleted ? theme.text : theme["primary-light"]}
                      />
                    </Pressable>
                    <Pressable
                      accessibilityLabel="Delete quest"
                      onPress={() => confirmDelete(q.id, q.title)}
                      hitSlop={8}
                      disabled={isCompleted}
                    >
                      <X
                        size={22}
                        color={isCompleted ? theme.text : theme.danger}
                      />
                    </Pressable>
                  </View>
                </View>
                <Pressable
                  onPress={() => {
                    const created = createQuest("NEW QUEST");
                    router.push({
                      pathname: "/quest-edit",
                      params: { id: created.id },
                    } as any);
                  }}
                  style={{
                    marginTop: 16,
                    alignSelf: "center",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 9999,
                    borderWidth: 1,
                    borderColor: theme.primary,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: theme.panel,
                    opacity: isCompleted ? 0.5 : 1,
                  }}
                  disabled={isCompleted}
                >
                  <Plus size={20} color={theme.primary} />
                  <Text style={{ color: theme["primary-lighter"], fontSize: 16 }}>
                    New Quest
                  </Text>
                </Pressable>

                {isCompleted && (
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 80,
                      fontWeight: "bold",
                      color: theme["text-light"],
                      fontSize: 16,
                    }}
                  >
                    QuestHub disabled if current quest has been completed.
                  </Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
