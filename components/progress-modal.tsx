import { AlertTriangle, Minus, Plus } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { QuestGoal } from "./quest-info";

type ProgressModalProps = {
  visible: boolean;
  goal: QuestGoal | null;
  onClose: () => void;
  onSave: (goalId: string, newValue: number) => void;
};

const ProgressModal: React.FC<ProgressModalProps> = ({
  visible,
  goal,
  onClose,
  onSave,
}) => {
  const [tempValue, setTempValue] = useState(0);

  React.useEffect(() => {
    if (goal) {
      setTempValue(goal.current);
    }
  }, [goal]);

  const handleAdjust = (amount: number) => {
    setTempValue((prev) => Math.max(0, prev + amount));
  };

  const handleSave = () => {
    if (goal && goal.id) {
      onSave(goal.id, tempValue);
    }
    onClose();
  };

  const handleCancel = () => {
    setTempValue(goal?.current || 0);
    onClose();
  };

  if (!goal) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/80 items-center justify-center p-6">
        <View className="w-full max-w-sm bg-slate-900/95 rounded-3xl border-2 border-cyan-400 shadow-2xl overflow-hidden">
          <View className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
          <View className="p-6 border-b border-cyan-500/30">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-400 items-center justify-center">
                <AlertTriangle size={20} color="#06b6d4" />
              </View>
              <Text className="text-cyan-300 text-xl font-bold">
                NOTIFICATION
              </Text>
            </View>
          </View>

          <View className="p-6">
            <Text className="text-cyan-200 text-lg mb-6 text-center leading-6">
              Update progress for{`\n`}
              <Text className="font-bold text-cyan-300">{goal.exercise}</Text>
            </Text>

            <View className="bg-slate-800/70 rounded-2xl border border-cyan-500/40 p-6 mb-6">
              <Text className="text-cyan-300 text-3xl font-bold text-center">
                {tempValue} / {goal.target}
                {goal.unit || ""}
              </Text>
            </View>

            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => handleAdjust(-100)}
                className="flex-1 py-4 rounded-xl border border-cyan-500/40 bg-slate-800/70 items-center"
              >
                <Minus size={24} color="#06b6d4" />
                <Text className="text-cyan-300 mt-2 font-semibold">100</Text>
              </Pressable>
              <Pressable
                onPress={() => handleAdjust(-10)}
                className="flex-1 py-4 rounded-xl border border-cyan-500/40 bg-slate-800/70 items-center"
              >
                <Minus size={24} color="#06b6d4" />
                <Text className="text-cyan-300 mt-2 font-semibold">10</Text>
              </Pressable>
              <Pressable
                onPress={() => handleAdjust(-1)}
                className="flex-1 py-4 rounded-xl border border-cyan-500/40 bg-slate-800/70 items-center"
              >
                <Minus size={24} color="#06b6d4" />
                <Text className="text-cyan-300 mt-2 font-semibold">1</Text>
              </Pressable>
            </View>

            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => handleAdjust(1)}
                className="flex-1 py-4 rounded-xl border border-cyan-500/40 bg-slate-800/70 items-center"
              >
                <Plus size={24} color="#06b6d4" />
                <Text className="text-cyan-300 mt-2 font-semibold">1</Text>
              </Pressable>
              <Pressable
                onPress={() => handleAdjust(10)}
                className="flex-1 py-4 rounded-xl border border-cyan-500/40 bg-slate-800/70 items-center"
              >
                <Plus size={24} color="#06b6d4" />
                <Text className="text-cyan-300 mt-2 font-semibold">10</Text>
              </Pressable>
              <Pressable
                onPress={() => handleAdjust(100)}
                className="flex-1 py-4 rounded-xl border border-cyan-500/40 bg-slate-800/70 items-center"
              >
                <Plus size={24} color="#06b6d4" />
                <Text className="text-cyan-300 mt-2 font-semibold">100</Text>
              </Pressable>
            </View>

            <View className="flex-row gap-3 justify-end">
              <Pressable
                onPress={handleCancel}
                className="px-6 py-3 rounded-xl border border-red-500/40 bg-slate-800/70"
              >
                <Text className="text-red-400 font-semibold">CANCEL</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                className="px-6 py-3 rounded-xl border border-cyan-500/40 bg-cyan-500/20"
              >
                <Text className="text-cyan-300 font-semibold">SAVE</Text>
              </Pressable>
            </View>
          </View>

          <View className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
          <View className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
          <View className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl" />
          <View className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-xl" />
        </View>
      </View>
    </Modal>
  );
};

export default ProgressModal;
