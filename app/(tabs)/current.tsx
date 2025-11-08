import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressModal from "../../components/progress-modal";
import QuestInfo from "../../components/quest-info";
import { useQuests } from "../../context/quests";
import { useTheme } from "../../context/theme";

export default function CurrentScreen() {
  const {
    activeQuest,
    updateGoalProgress,
    isQuestCompletedToday,
    completeQuest,
    uncompleteQuest,
  } = useQuests();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<{
    exercise: string;
    id?: string;
    current: number;
    target: number;
    unit?: string;
  } | null>(null);
  const { theme } = useTheme();

  const handleGoalPress = (goal: typeof selectedGoal, _index: number) => {
    setSelectedGoal(goal);
    setModalVisible(true);
  };

  const handleSave = (goalId: string, newValue: number) => {
    if (activeQuest && goalId) {
      updateGoalProgress(activeQuest.id, goalId, newValue);
    }
  };

  const isCompleted = activeQuest
    ? isQuestCompletedToday(activeQuest.id)
    : false;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        {activeQuest ? (
          <QuestInfo
            title={activeQuest.title}
            goals={activeQuest.goals}
            onGoalPress={handleGoalPress}
            isCompleted={isCompleted}
            onCompleteQuest={() => completeQuest(activeQuest.id)}
            onUncompleteQuest={() => uncompleteQuest(activeQuest.id)}
          />
        ) : (
          <Text style={{ color: theme.text }}>No active quest selected.</Text>
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
