import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Quest, QuestGoal, useQuests } from "../context/quests";
import { useTheme } from "../context/theme";

export default function QuestEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { quests, updateQuest } = useQuests();
  const { theme } = useTheme();
  const original = useMemo(
    () => quests.find((q) => q.id === id) || null,
    [quests, id]
  );

  const [title, setTitle] = useState<string>(original?.title || "");
  const [goals, setGoals] = useState<QuestGoal[]>(original?.goals || []);

  function onAddGoal() {
    const newGoal: QuestGoal = {
      id: `g_${Math.random().toString(36).slice(2, 10)}`,
      exercise: "NEW GOAL",
      target: 10,
      current: 0,
    };
    setGoals((prev) => [...prev, newGoal]);
  }

  function onRemoveGoal(goalId: string) {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }

  function updateGoal(goalId: string, patch: Partial<QuestGoal>) {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, ...patch } : g))
    );
  }

  function onSave() {
    if (!original) return;
    const next: Quest = { ...original, title, goals };
    updateQuest(next);
    router.back();
  }

  if (!original) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Text style={{ color: theme["text-light"] }}>Quest not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.primary + "33",
          backgroundColor: theme.panel + "E6",
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <ArrowLeft size={22} color={theme.primary} />
        </Pressable>
        <Text style={{ color: theme["text-light"], fontSize: 20, fontWeight: "bold" }}>
          EDIT QUEST
        </Text>
        <Pressable
          onPress={onSave}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.primary + "66",
          }}
        >
          <Text style={{ color: theme["primary-lighter"] }}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1, padding: 16 }}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: theme.text, marginBottom: 8 }}>TITLE</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Quest title"
            placeholderTextColor={theme.text}
            style={{
              color: theme["text-light"],
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.primary + "4D",
              backgroundColor: theme.panel + "B3",
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          />
        </View>

        <Text style={{ color: "#22c55e", fontSize: 20, marginBottom: 12 }}>
          GOALS
        </Text>

        {goals.map((g) => (
          <View
            key={g.id}
            style={{
              marginBottom: 12,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.primary + "33",
              backgroundColor: theme.panel + "99",
              padding: 12,
            }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, marginBottom: 4 }}>Exercise</Text>
                <TextInput
                  value={g.exercise}
                  onChangeText={(t) => updateGoal(g.id, { exercise: t })}
                  placeholder="Exercise"
                  placeholderTextColor={theme.text}
                  style={{
                    color: theme["text-light"],
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.primary + "33",
                    backgroundColor: theme.background + "99",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                />
              </View>
              <View style={{ width: 96 }}>
                <Text style={{ color: theme.text, marginBottom: 4 }}>Target</Text>
                <TextInput
                  value={String(g.target)}
                  onChangeText={(t) =>
                    updateGoal(g.id, { target: Number(t) || 0 })
                  }
                  keyboardType="number-pad"
                  style={{
                    color: theme["text-light"],
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.primary + "33",
                    backgroundColor: theme.background + "99",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                />
              </View>
              <View style={{ width: 80 }}>
                <Text style={{ color: theme.text, marginBottom: 4 }}>Unit</Text>
                <TextInput
                  value={g.unit || ""}
                  onChangeText={(t) =>
                    updateGoal(g.id, { unit: t || undefined })
                  }
                  placeholder="e.g. KM"
                  placeholderTextColor={theme.text}
                  style={{
                    color: theme["text-light"],
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.primary + "33",
                    backgroundColor: theme.background + "99",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                />
              </View>
              <Pressable
                onPress={() => onRemoveGoal(g.id)}
                style={{ justifyContent: "flex-end", paddingBottom: 4, paddingLeft: 8 }}
              >
                <Trash2 size={20} color={theme.danger} />
              </Pressable>
            </View>
          </View>
        ))}

        <Pressable
          onPress={onAddGoal}
          style={{
            marginTop: 4,
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.primary + "66",
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: theme.panel + "99",
          }}
        >
          <Plus size={18} color={theme.primary} />
          <Text style={{ color: theme["primary-lighter"] }}>Add Goal</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
