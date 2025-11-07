import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressModal from "../../components/progress-modal";
import QuestInfo from "../../components/quest-info";
import { useQuests } from "../../context/quests";

export default function CurrentScreen() {
  const { activeQuest, updateGoalProgress, isQuestCompletedToday, completeQuest } = useQuests();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<{
    exercise: string;
    id?: string;
    current: number;
    target: number;
    unit?: string;
  } | null>(null);

  const handleGoalPress = (goal: typeof selectedGoal, _index: number) => {
    setSelectedGoal(goal);
    setModalVisible(true);
  };

  const handleSave = (goalId: string, newValue: number) => {
    if (activeQuest && goalId) {
      updateGoalProgress(activeQuest.id, goalId, newValue);
    }
  };

  const isCompleted = activeQuest ? isQuestCompletedToday(activeQuest.id) : false;

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 items-center justify-center p-4">
        {activeQuest ? (
          <QuestInfo
            title={activeQuest.title}
            goals={activeQuest.goals}
            onGoalPress={handleGoalPress}
            isCompleted={isCompleted}
            onCompleteQuest={() => completeQuest(activeQuest.id)}
          />
        ) : (
          <Text className="text-slate-300">No active quest selected.</Text>
        )}
      </View>

      <ProgressModal
        visible={modalVisible}
        goal={selectedGoal}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}
