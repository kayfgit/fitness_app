import { Clock, Info, X } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export type QuestGoal = {
  exercise: string;
  id?: string;
  current: number;
  target: number;
  unit?: string;
};

type QuestInfoProps = {
  title: string;
  goals: QuestGoal[];
  onClose?: () => void;
  onGoalPress?: (goal: QuestGoal, index: number) => void;
};

const QuestInfo: React.FC<QuestInfoProps> = ({
  title,
  goals,
  onClose,
  onGoalPress,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  return (
    <View className="w-full max-w-md bg-slate-800/90 rounded-3xl shadow-lg border border-cyan-500/20">
      <View className="flex-row justify-between items-center p-4 border-b border-cyan-500/20">
        <View className="flex-row items-center gap-2">
          <Info size={24} color="#06b6d4" />
          <Text className="text-white text-xl font-bold">QUEST INFO</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#06b6d4" />
        </TouchableOpacity>
      </View>

      <ScrollView className="p-4">
        <Text className="text-white text-2xl text-center mb-6">{title}</Text>

        <View className="mb-6">
          <Text className="text-green-400 text-xl mb-4">GOALS</Text>
          {goals.map((goal, index) => (
            <TouchableOpacity
              key={goal.id || index}
              onPress={() => {
                setSelectedIndex(index);
                onGoalPress?.(goal, index);
              }}
              className={`mb-3 p-2 rounded-lg ${selectedIndex === index ? "bg-cyan-500/20" : ""}`}
              activeOpacity={0.7}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`text-lg ${selectedIndex === index ? "text-cyan-300" : "text-white"} ${selectedIndex === index ? "font-bold" : ""}`}
                >
                  -{goal.exercise}
                </Text>
                <Text
                  className={`text-lg ${selectedIndex === index ? "text-cyan-300" : "text-white"} ${selectedIndex === index ? "font-bold" : ""}`}
                >
                  [{goal.current}/{goal.target}
                  {goal.unit || ""}]
                </Text>
              </View>
              {selectedIndex === index && (
                <View
                  className="absolute inset-0 border border-cyan-400 rounded-lg"
                  style={{
                    shadowColor: "#06b6d4",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-red-500 text-lg mb-2">CAUTION!</Text>
          <Text className="text-white text-lg text-center">
            - IF THE DAILY QUEST{"\n"}REMAINS INCOMPLETE, PENALTIES{"\n"}
            WILL BE GIVEN ACCORDINGLY.
          </Text>
        </View>

        <View className="items-center mt-4">
          <Clock size={40} color="#06b6d4" />
        </View>
      </ScrollView>

      <View className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl" />
      <View className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-xl" />
      <View className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-xl" />
      <View className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl" />
    </View>
  );
};

export default QuestInfo;
