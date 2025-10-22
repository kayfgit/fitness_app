import { Clock, Info, X } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function QuestScreen() {
  const questGoals = [
    { exercise: "PUSH-UPS", current: 0, target: 100 },
    { exercise: "SIT-UPS", current: 0, target: 100 },
    { exercise: "SQUATS", current: 0, target: 100 },
    { exercise: "RUN", current: 0, target: 10, unit: "KM" },
  ];

  return (
    <View className="flex-1 bg-slate-900">
      {/* Quest Card Container */}
      <View className="flex-1 items-center justify-center p-4">
        <View className="w-full max-w-md bg-slate-800/90 rounded-3xl shadow-lg border border-cyan-500/20">
          {/* Header with close and info buttons */}
          <View className="flex-row justify-between items-center p-4 border-b border-cyan-500/20">
            <View className="flex-row items-center gap-2">
              <Info size={24} color="#06b6d4" />
              <Text className="text-white text-xl font-bold">QUEST INFO</Text>
            </View>
            <TouchableOpacity>
              <X size={24} color="#06b6d4" />
            </TouchableOpacity>
          </View>

          {/* Quest Content */}
          <ScrollView className="p-4">
            {/* Quest Title */}
            <Text className="text-white text-2xl text-center mb-6">
              DAILY QUEST - TRAIN TO BECOME{"\n"}A FORMIDABLE COMBATANT
            </Text>

            {/* Goals Section */}
            <View className="mb-6">
              <Text className="text-green-400 text-xl mb-4">GOALS</Text>
              {questGoals.map((goal, index) => (
                <View key={index} className="flex-row justify-between mb-3">
                  <Text className="text-white text-lg">-{goal.exercise}</Text>
                  <Text className="text-white text-lg">
                    [{goal.current}/{goal.target}
                    {goal.unit || ""}]
                  </Text>
                </View>
              ))}
            </View>

            {/* Caution Message */}
            <View className="mb-6">
              <Text className="text-red-500 text-lg mb-2">CAUTION!</Text>
              <Text className="text-white text-lg text-center">
                - IF THE DAILY QUEST{"\n"}REMAINS INCOMPLETE, PENALTIES{"\n"}
                WILL BE GIVEN ACCORDINGLY.
              </Text>
            </View>

            {/* Timer Icon */}
            <View className="items-center mt-4">
              <Clock size={40} color="#06b6d4" />
            </View>
          </ScrollView>

          {/* Celtic-style corner decorations */}
          <View className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl" />
          <View className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-xl" />
          <View className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-xl" />
          <View className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl" />
        </View>
      </View>
    </View>
  );
}
