import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/theme";
import {
    getNotificationSlots,
    NotificationSlot,
    saveNotificationSlots,
} from "../../../lib/notifications";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function SettingsNotificationsScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const [slots, setSlots] = useState<NotificationSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSlot, setEditingSlot] = useState<NotificationSlot | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        loadSlots();
    }, []);

    const loadSlots = async () => {
        const loaded = await getNotificationSlots();
        setSlots(loaded);
        setLoading(false);
    };

    const toggleSlot = async (id: string, value: boolean) => {
        const newSlots = slots.map((s) => (s.id === id ? { ...s, enabled: value } : s));
        setSlots(newSlots);
        await saveNotificationSlots(newSlots);
    };

    const deleteSlot = async (id: string) => {
        const newSlots = slots.filter((s) => s.id !== id);
        setSlots(newSlots);
        await saveNotificationSlots(newSlots);
    };

    const saveSlot = async () => {
        if (!editingSlot) return;

        let newSlots;
        const existingIndex = slots.findIndex((s) => s.id === editingSlot.id);

        if (existingIndex >= 0) {
            newSlots = [...slots];
            newSlots[existingIndex] = editingSlot;
        } else {
            newSlots = [...slots, editingSlot];
        }

        setSlots(newSlots);
        await saveNotificationSlots(newSlots);
        setEditingSlot(null);
    };

    const addNewSlot = () => {
        setEditingSlot({
            id: Date.now().toString(),
            time: new Date(new Date().setHours(12, 0, 0, 0)),
            days: [1, 2, 3, 4, 5, 6, 7],
            enabled: true,
        });
    };

    const toggleDay = (dayIndex: number) => {
        if (!editingSlot) return;
        const currentDays = editingSlot.days;
        const day = dayIndex + 1; // 1-based index

        let newDays;
        if (currentDays.includes(day)) {
            newDays = currentDays.filter((d) => d !== day);
        } else {
            newDays = [...currentDays, day].sort();
        }

        setEditingSlot({ ...editingSlot, days: newDays });
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: theme["text-light"] }}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <View
                style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.primary + "33",
                    backgroundColor: theme.panel + "E6",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
                    <ArrowLeft size={22} color={theme.primary} />
                </Pressable>
                <Text style={{ color: theme["text-light"], fontSize: 18, fontWeight: "bold" }}>
                    Notifications
                </Text>
                <Pressable onPress={addNewSlot} style={{ padding: 8 }}>
                    <Plus size={22} color={theme.primary} />
                </Pressable>
            </View>

            <ScrollView style={{ flex: 1, padding: 16 }}>
                {slots.map((slot) => (
                    <View
                        key={slot.id}
                        style={{
                            backgroundColor: theme.panel,
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 12,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderWidth: 1,
                            borderColor: theme.primary + "20",
                        }}
                    >
                        <Pressable
                            style={{ flex: 1 }}
                            onPress={() => setEditingSlot(slot)}
                        >
                            <Text style={{ color: theme["text-light"], fontSize: 24, fontWeight: "bold" }}>
                                {slot.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </Text>
                            <Text style={{ color: theme.text, marginTop: 4 }}>
                                {slot.days.length === 7
                                    ? "Every day"
                                    : slot.days.length === 0
                                        ? "Never"
                                        : slot.days.map((d) => DAYS[d - 1]).join(", ")}
                            </Text>
                        </Pressable>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                            <Switch
                                value={slot.enabled}
                                onValueChange={(val) => toggleSlot(slot.id, val)}
                                trackColor={{ false: theme.panel, true: theme.primary }}
                                thumbColor={theme["text-light"]}
                            />
                            <Pressable onPress={() => deleteSlot(slot.id)}>
                                <Trash2 size={20} color={theme.danger || "#ef4444"} />
                            </Pressable>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Modal
                visible={!!editingSlot}
                transparent
                animationType="slide"
                onRequestClose={() => setEditingSlot(null)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "flex-end",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: theme.background,
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            padding: 24,
                            minHeight: 400,
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
                            <Text style={{ color: theme["text-light"], fontSize: 20, fontWeight: "bold" }}>
                                Edit Reminder
                            </Text>
                            <Pressable onPress={() => setEditingSlot(null)}>
                                <Text style={{ color: theme.text, fontSize: 16 }}>Cancel</Text>
                            </Pressable>
                        </View>

                        {editingSlot && (
                            <>
                                <View style={{ alignItems: "center", marginBottom: 24 }}>
                                    <Pressable
                                        onPress={() => setShowTimePicker(true)}
                                        style={{
                                            backgroundColor: theme.panel,
                                            padding: 16,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: theme.primary + "40",
                                        }}
                                    >
                                        <Text style={{ color: theme.primary, fontSize: 32, fontWeight: "bold" }}>
                                            {editingSlot.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </Text>
                                    </Pressable>
                                </View>

                                {showTimePicker && (
                                    <DateTimePicker
                                        value={editingSlot.time}
                                        mode="time"
                                        display="spinner"
                                        onChange={(event, date) => {
                                            setShowTimePicker(false);
                                            if (date) {
                                                setEditingSlot({ ...editingSlot, time: date });
                                            }
                                        }}
                                    />
                                )}

                                <Text style={{ color: theme.text, marginBottom: 12 }}>Repeat</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 32 }}>
                                    {DAYS.map((day, index) => {
                                        const isSelected = editingSlot.days.includes(index + 1);
                                        return (
                                            <Pressable
                                                key={index}
                                                onPress={() => toggleDay(index)}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 20,
                                                    backgroundColor: isSelected ? theme.primary : theme.panel,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderWidth: 1,
                                                    borderColor: isSelected ? theme.primary : theme.primary + "20",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: isSelected ? "#fff" : theme.text,
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {day}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>

                                <TouchableOpacity
                                    onPress={saveSlot}
                                    style={{
                                        backgroundColor: theme.primary,
                                        padding: 16,
                                        borderRadius: 12,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Save</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
