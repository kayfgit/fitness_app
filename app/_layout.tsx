import { Stack } from "expo-router";
import { QuestsProvider } from "../context/quests";
import { ThemeProvider } from "../context/theme";
import "../global.css";

export default function RootLayout() {
  return (
    <QuestsProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </QuestsProvider>
  );
}
