import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Quest, QuestGoal, useQuests } from "../context/quests";

export default function QuestEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { quests, updateQuest } = useQuests();
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
      <SafeAreaView className="flex-1 bg-slate-900">
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-white">Quest not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-row items-center justify-between p-4 border-b border-cyan-500/20 bg-slate-900/90">
        <Pressable onPress={() => router.back()} className="p-2">
          <ArrowLeft size={22} color="#06b6d4" />
        </Pressable>
        <Text className="text-white text-xl font-bold">EDIT QUEST</Text>
        <Pressable
          onPress={onSave}
          className="px-4 py-2 rounded-lg border border-cyan-500/40"
        >
          <Text className="text-cyan-300">Save</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <View className="mb-6">
          <Text className="text-slate-300 mb-2">TITLE</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Quest title"
            placeholderTextColor="#64748b"
            className="text-white rounded-2xl border border-cyan-500/30 bg-slate-800/70 px-4 py-3"
          />
        </View>

        <Text className="text-green-400 text-xl mb-3">GOALS</Text>

        {goals.map((g) => (
          <View
            key={g.id}
            className="mb-3 rounded-2xl border border-cyan-500/20 bg-slate-800/60 p-3"
          >
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Text className="text-slate-300 mb-1">Exercise</Text>
                <TextInput
                  value={g.exercise}
                  onChangeText={(t) => updateGoal(g.id, { exercise: t })}
                  placeholder="Exercise"
                  placeholderTextColor="#64748b"
                  className="text-white rounded-xl border border-cyan-500/20 bg-slate-900/60 px-3 py-2"
                />
              </View>
              <View style={{ width: 96 }}>
                <Text className="text-slate-300 mb-1">Target</Text>
                <TextInput
                  value={String(g.target)}
                  onChangeText={(t) =>
                    updateGoal(g.id, { target: Number(t) || 0 })
                  }
                  keyboardType="number-pad"
                  className="text-white rounded-xl border border-cyan-500/20 bg-slate-900/60 px-3 py-2"
                />
              </View>
              <View style={{ width: 80 }}>
                <Text className="text-slate-300 mb-1">Unit</Text>
                <TextInput
                  value={g.unit || ""}
                  onChangeText={(t) =>
                    updateGoal(g.id, { unit: t || undefined })
                  }
                  placeholder="e.g. KM"
                  placeholderTextColor="#64748b"
                  className="text-white rounded-xl border border-cyan-500/20 bg-slate-900/60 px-3 py-2"
                />
              </View>
              <Pressable
                onPress={() => onRemoveGoal(g.id)}
                className="justify-end pb-1 pl-2"
              >
                <Trash2 size={20} color="#ef4444" />
              </Pressable>
            </View>
          </View>
        ))}

        <Pressable
          onPress={onAddGoal}
          className="mt-1 self-start flex-row items-center gap-2 rounded-full border border-cyan-500/40 px-4 py-2 bg-slate-800/60"
        >
          <Plus size={18} color="#06b6d4" />
          <Text className="text-cyan-300">Add Goal</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
