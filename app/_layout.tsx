import { Stack } from "expo-router";
import { QuestsProvider } from "../context/quests";
import "../global.css";

export default function RootLayout() {
  return (
    <QuestsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </QuestsProvider>
  );
}
