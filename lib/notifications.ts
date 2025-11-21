import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { loadObject, saveObject } from "./storage";

export interface NotificationSlot {
    id: string;
    time: Date; // We only care about hours and minutes
    days: number[]; // 1 = Monday, 7 = Sunday (ISO)
    enabled: boolean;
}

const NOTIFICATION_STORAGE_KEY = "notification_slots";

// Default slots: 10 AM and 9 PM daily
const DEFAULT_SLOTS: NotificationSlot[] = [
    {
        id: "default-morning",
        time: new Date(new Date().setHours(10, 0, 0, 0)),
        days: [1, 2, 3, 4, 5, 6, 7],
        enabled: true,
    },
    {
        id: "default-evening",
        time: new Date(new Date().setHours(21, 0, 0, 0)),
        days: [1, 2, 3, 4, 5, 6, 7],
        enabled: true,
    },
];

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            // handle failure
            return false;
        }
        return true;
    } else {
        // alert('Must use physical device for Push Notifications');
        return false;
    }
}

export async function getNotificationSlots(): Promise<NotificationSlot[]> {
    const slots = await loadObject<NotificationSlot[]>(NOTIFICATION_STORAGE_KEY);
    if (!slots) {
        // Initialize defaults if nothing stored
        await saveObject(NOTIFICATION_STORAGE_KEY, DEFAULT_SLOTS);
        return DEFAULT_SLOTS;
    }
    // Rehydrate Dates from JSON strings
    return slots.map((s) => ({
        ...s,
        time: new Date(s.time),
    }));
}

export async function saveNotificationSlots(slots: NotificationSlot[]) {
    await saveObject(NOTIFICATION_STORAGE_KEY, slots);
    await scheduleNotifications(slots);
}

export async function scheduleNotifications(slots: NotificationSlot[]) {
    // Cancel all existing
    await Notifications.cancelAllScheduledNotificationsAsync();

    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission) return;

    for (const slot of slots) {
        if (!slot.enabled) continue;

        const hour = slot.time.getHours();
        const minute = slot.time.getMinutes();

        for (const day of slot.days) {
            // Expo Notifications 'weekday': 1 = Sunday, 2 = Monday, ...
            // Our 'days' array: 1 = Monday, ..., 7 = Sunday (ISO)
            // Conversion:
            // ISO 1 (Mon) -> Expo 2
            // ISO 7 (Sun) -> Expo 1
            const expoWeekday = day === 7 ? 1 : day + 1;

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Quest Reminder",
                    body: "Don't forget to complete your quest!",
                    sound: true,
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                    weekday: expoWeekday,
                    hour: hour,
                    minute: minute,
                },
            });
        }
    }
}

// Call this on app start
export async function initializeNotifications() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });

    // Ensure slots exist
    await getNotificationSlots();
}
