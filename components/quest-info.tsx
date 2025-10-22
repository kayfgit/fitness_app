import React from "react";
import { Text, View } from "react-native";

const QuestInfo = () => {
  return (
    <View className="flex-1 items-center justify-center bg-gradient-to-b from-[#2a3b47] to-[#e3e3e3]">
      <View className="w-80 bg-[#0c1624] rounded-lg border border-[#2e3d4d] p-4 shadow-lg">
        {/* Title */}
        <Text className="text-white text-lg font-bold text-center mb-4 tracking-widest">
          QUEST INFO
        </Text>

        {/* Subtitle */}
        <Text className="text-center text-white text-sm mb-6">
          DAILY QUEST - TRAIN TO BECOME{"\n"}A FORMIDABLE COMBATANT
        </Text>

        {/* Goals Header */}
        <Text className="text-green-500 font-bold text-center mb-3">GOALS</Text>

        {/* Goals List */}
        <View className="space-y-2 mb-6">
          <Text className="text-white">
            - PUSH-UPS <Text className="text-gray-300">[0/100]</Text>
          </Text>
          <Text className="text-white">
            - SIT-UPS <Text className="text-gray-300">[0/100]</Text>
          </Text>
          <Text className="text-white">
            - SQUATS <Text className="text-gray-300">[0/100]</Text>
          </Text>
          <Text className="text-white">
            - RUN <Text className="text-gray-300">[0/10KM]</Text>
          </Text>
        </View>

        {/* Caution Section */}
        <Text className="text-red-500 font-bold text-center">CAUTION!</Text>
        <Text className="text-white text-center text-xs mb-6">
          - IF THE DAILY QUEST{"\n"}REMAINS INCOMPLETE, PENALTIES{"\n"}WILL BE
          GIVEN ACCORDINGLY.
        </Text>

        {/* Clock Icon Placeholder */}
        <View className="items-center">
          <Text className="text-white text-3xl">🕒</Text>
        </View>
      </View>
    </View>
  );
};

export default QuestInfo;
