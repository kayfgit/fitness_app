import { Check, Clock, Info, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  AppState,
  AppStateStatus,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  onCompleteQuest: () => void;
  isCompleted: boolean;
};

const QuestInfo: React.FC<QuestInfoProps> = ({
  title,
  goals,
  onClose,
  onGoalPress,
  onCompleteQuest,
  isCompleted,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [clockColor, setClockColor] = useState("#06b6d4");

  const allGoalsComplete = goals.every((goal) => goal.current >= goal.target);

  useEffect(() => {
    if (!allGoalsComplete) {
      const getGradientColor = (percentage: number) => {
        const green = { r: 34, g: 197, b: 94 };
        const yellow = { r: 250, g: 204, b: 21 };
        const orange = { r: 249, g: 115, b: 22 };
        const red = { r: 239, g: 68, b: 68 };

        let c1, c2, p;

        if (percentage < 1 / 3) {
          c1 = green;
          c2 = yellow;
          p = percentage * 3;
        } else if (percentage < 2 / 3) {
          c1 = yellow;
          c2 = orange;
          p = (percentage - 1 / 3) * 3;
        } else {
          c1 = orange;
          c2 = red;
          p = (percentage - 2 / 3) * 3;
        }

        const r = Math.round(c1.r * (1 - p) + c2.r * p);
        const g = Math.round(c1.g * (1 - p) + c2.g * p);
        const b = Math.round(c1.b * (1 - p) + c2.b * p);

        return `rgb(${r}, ${g}, ${b})`;
      };

      const updateColor = () => {
        const now = new Date();
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const secondsInDay = 24 * 60 * 60;
        const secondsPassed = (now.getTime() - startOfDay.getTime()) / 1000;
        const percentage = secondsPassed / secondsInDay;
        setClockColor(getGradientColor(percentage));
      };

      let interval: NodeJS.Timeout | null = null;

      const startTimer = () => {
        if (interval) clearInterval(interval);
        updateColor();
        //@ts-ignore
        interval = setInterval(updateColor, 60000);
      };

      const stopTimer = () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      };

      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          startTimer();
        } else {
          stopTimer();
        }
      };

      const subscription = AppState.addEventListener(
        "change",
        handleAppStateChange
      );

      startTimer(); // initial start

      return () => {
        subscription.remove();
        stopTimer();
      };
    }
  }, [allGoalsComplete]);
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
          <Text className="text-center text-green-400 text-2xl font-bold mb-4">
            GOALS
          </Text>
          {goals.map((goal, index) => {
            const isComplete = goal.current >= goal.target;
            return (
              <TouchableOpacity
                key={goal.id || index}
                onPress={() => {
                  if (isCompleted) return;
                  setSelectedIndex(index);
                  onGoalPress?.(goal, index);
                }}
                className={`mb-3 p-2 rounded-lg ${
                  selectedIndex === index ? "bg-cyan-500/20" : ""
                } ${
                  isCompleted ? "opacity-50" : ""
                }`}
                activeOpacity={0.7}
                disabled={isCompleted}
              >
                <View className="flex-row justify-between items-center">
                  <Text
                    className={`text-lg ${
                      selectedIndex === index ? "text-cyan-300" : "text-white"
                    } ${selectedIndex === index ? "font-bold" : ""}`}
                  >
                    -{goal.exercise}
                  </Text>
                  <View className="flex-row items-center">
                    <Text
                      className={`text-lg ${
                        selectedIndex === index ? "text-cyan-300" : "text-white"
                      } ${selectedIndex === index ? "font-bold" : ""}`}
                    >
                      [{goal.current}/{goal.target}
                      {goal.unit || ""}]
                    </Text>
                    {isComplete && (
                      <Check size={20} color="#22c55e" className="ml-2" />
                    )}
                  </View>
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
            );
          })}
        </View>

        {!allGoalsComplete && (
          <View className="mb-6">
            <Text className="text-white text-lg text-center">
              <Text className="text-red-500 font-bold text-lg mb-2">
                CAUTION!{" "}
              </Text>
              - IF THE DAILY QUEST{"\n"}REMAINS INCOMPLETE, PENALTIES{"\n"}
              WILL BE GIVEN ACCORDINGLY.
            </Text>
          </View>
        )}

        {!allGoalsComplete && (
          <View className="items-center mt-4">
            <Clock size={40} color={clockColor} />
          </View>
        )}

        {allGoalsComplete && (
          <View className="mb-6">
            <Text className="mb-6 text-white text-lg text-center">
              ALL GOALS HAVE BEEN MET!
            </Text>

            <Pressable
              onPress={onCompleteQuest}
              disabled={isCompleted}
              className={`rounded-2xl border border-cyan-500/30 ${isCompleted ? 'bg-gray-600/70' : 'bg-green-800/70'} px-4 py-4`}>
              <Text className={`text-center font-bold text-lg ${isCompleted ? 'text-gray-400' : 'text-green-500'}`}>
                {isCompleted ? "COMPLETED" : "COMPLETE QUEST"}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <View className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl" />
      <View className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-xl" />
      <View className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-xl" />
      <View className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl" />
    </View>
  );
};

export default QuestInfo;
