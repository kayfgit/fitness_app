import { AlertTriangle, Minus, Plus } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useTheme } from "../context/theme";
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
  const { theme } = useTheme();
  const [tempValue, setTempValue] = useState(0);

  React.useEffect(() => {
    if (goal) {
      setTempValue(goal.current);
    }
  }, [goal]);

  const handleAdjust = (amount: number) => {
    if (!goal) return;
    const maxAllowed = goal.target * 2;
    setTempValue((prev) => Math.min(maxAllowed, Math.max(0, prev + amount)));
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

  const maxAllowed = goal.target * 2; // Define maxAllowed here for use in JSX

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.8)",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 384,
            backgroundColor: theme.panel,
            borderRadius: 24,
            borderWidth: 2,
            borderColor: theme["primary-light"],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: theme.primary + "1A",
            }}
          />
          <View
            style={{
              padding: 24,
              borderBottomWidth: 1,
              borderBottomColor: theme.primary + "4D",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.primary + "33",
                  borderWidth: 2,
                  borderColor: theme["primary-light"],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AlertTriangle size={20} color={theme.primary} />
              </View>
              <Text
                style={{
                  color: theme["primary-lighter"],
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                NOTIFICATION
              </Text>
            </View>
          </View>

          <View style={{ padding: 24 }}>
            <Text
              style={{
                color: theme["primary-lighter"],
                fontSize: 18,
                marginBottom: 24,
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              Update progress for{"\n"}
              <Text style={{ fontWeight: "bold", color: theme["primary-lighter"] }}>
                {goal.exercise}
              </Text>
            </Text>

            <View
              style={{
                backgroundColor: theme.background + "B3",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.primary + "66",
                padding: 24,
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  color: theme["primary-lighter"],
                  fontSize: 30,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {tempValue} / {goal.target}
                {goal.unit || ""}
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
              <Pressable
                onPress={() => handleAdjust(-100)}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.primary + "66",
                  backgroundColor: theme.background + "B3",
                  alignItems: "center",
                }}
                disabled={tempValue <= 0}
              >
                <Minus size={24} color={tempValue <= 0 ? theme.text : theme.primary} />
                <Text
                  style={{
                    marginTop: 8,
                    fontWeight: "600",
                    color: tempValue <= 0 ? theme.text : theme["primary-lighter"],
                  }}
                >
                  100
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleAdjust(-10)}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.primary + "66",
                  backgroundColor: theme.background + "B3",
                  alignItems: "center",
                }}
                disabled={tempValue <= 0}
              >
                <Minus size={24} color={tempValue <= 0 ? theme.text : theme.primary} />
                <Text
                  style={{
                    marginTop: 8,
                    fontWeight: "600",
                    color: tempValue <= 0 ? theme.text : theme["primary-lighter"],
                  }}
                >
                  10
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleAdjust(-1)}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.primary + "66",
                  backgroundColor: theme.background + "B3",
                  alignItems: "center",
                }}
                disabled={tempValue <= 0}
              >
                <Minus size={24} color={tempValue <= 0 ? theme.text : theme.primary} />
                <Text
                  style={{
                    marginTop: 8,
                    fontWeight: "600",
                    color: tempValue <= 0 ? theme.text : theme["primary-lighter"],
                  }}
                >
                  1
                </Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
              <Pressable
                onPress={() => handleAdjust(1)}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.primary + "66",
                  backgroundColor: theme.background + "B3",
                  alignItems: "center",
                }}
                disabled={tempValue >= maxAllowed}
              >
                <Plus
                  size={24}
                  color={tempValue >= maxAllowed ? theme.text : theme.primary}
                />
                <Text
                  style={{
                    marginTop: 8,
                    fontWeight: "600",
                    color:
                      tempValue >= maxAllowed
                        ? theme.text
                        : theme["primary-lighter"],
                  }}
                >
                  1
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleAdjust(10)}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.primary + "66",
                  backgroundColor: theme.background + "B3",
                  alignItems: "center",
                }}
                disabled={tempValue >= maxAllowed}
              >
                <Plus
                  size={24}
                  color={tempValue >= maxAllowed ? theme.text : theme.primary}
                />
                <Text
                  style={{
                    marginTop: 8,
                    fontWeight: "600",
                    color:
                      tempValue >= maxAllowed
                        ? theme.text
                        : theme["primary-lighter"],
                  }}
                >
                  10
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleAdjust(100)}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.primary + "66",
                  backgroundColor: theme.background + "B3",
                  alignItems: "center",
                }}
                disabled={tempValue >= maxAllowed}
              >
                <Plus
                  size={24}
                  color={tempValue >= maxAllowed ? theme.text : theme.primary}
                />
                <Text
                  style={{
                    marginTop: 8,
                    fontWeight: "600",
                    color:
                      tempValue >= maxAllowed
                        ? theme.text
                        : theme["primary-lighter"],
                  }}
                >
                  100
                </Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: "row", gap: 12, justifyContent: "flex-end" }}>
              <Pressable
                onPress={handleCancel}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.danger + "66",
                  backgroundColor: theme.background + "B3",
                }}
              >
                <Text style={{ color: theme.danger, fontWeight: "600" }}>CANCEL</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.primary + "66",
                  backgroundColor: theme.primary + "33",
                }}
              >
                <Text style={{ color: theme["primary-lighter"], fontWeight: "600" }}>
                  SAVE
                </Text>
              </Pressable>
            </View>
          </View>

          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 32,
              height: 32,
              borderTopWidth: 2,
              borderLeftWidth: 2,
              borderColor: theme["primary-light"],
              borderTopLeftRadius: 22,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 32,
              height: 32,
              borderTopWidth: 2,
              borderRightWidth: 2,
              borderColor: theme["primary-light"],
              borderTopRightRadius: 22,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 32,
              height: 32,
              borderBottomWidth: 2,
              borderLeftWidth: 2,
              borderColor: theme["primary-light"],
              borderBottomLeftRadius: 22,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 32,
              height: 32,
              borderBottomWidth: 2,
              borderRightWidth: 2,
              borderColor: theme["primary-light"],
              borderBottomRightRadius: 22,
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ProgressModal;
