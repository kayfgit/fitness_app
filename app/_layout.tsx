import { Stack } from "expo-router";
import { useEffect } from "react";
import { QuestsProvider } from "../context/quests";
import { ThemeProvider } from "../context/theme";
import "../global.css";
import { initializeNotifications } from "../lib/notifications";

export default function RootLayout() {
    useEffect(() => {
        initializeNotifications();
    }, []);

    return (
        <QuestsProvider>
            <ThemeProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
        </QuestsProvider>
    );
}
