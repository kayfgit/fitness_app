import React from "react";
import { View } from "react-native";
import QuestInfo, { QuestGoal } from "../../components/quest-info";

export default function CurrentScreen() {
  const questGoals: QuestGoal[] = [
    { exercise: "PUSH-UPS", current: 0, target: 100 },
    { exercise: "SIT-UPS", current: 0, target: 100 },
    { exercise: "SQUATS", current: 0, target: 100 },
    { exercise: "RUN", current: 0, target: 10, unit: "KM" },
  ];

  return (
    <View className="flex-1 bg-slate-900 items-center justify-center p-4">
      <QuestInfo
        title={"DAILY QUEST - TRAIN TO BECOME\nA FORMIDABLE COMBATANT"}
        goals={questGoals}
      />
    </View>
  );
}
