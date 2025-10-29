import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuestInfo from "../../components/quest-info";
import { useQuests } from "../../context/quests";

export default function CurrentScreen() {
  const { activeQuest } = useQuests();

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 items-center justify-center p-4">
        {activeQuest ? (
          <QuestInfo title={activeQuest.title} goals={activeQuest.goals} />
        ) : (
          <Text className="text-slate-300">No active quest selected.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
