import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export const themes = {
  blue: {
    background: "#0f172a", // slate-900
    panel: "#1f2937", // slate-800
    primary: "#06b6d4", // cyan-500
    "primary-light": "#22d3ee", // cyan-400
    "primary-lighter": "#67e8f9", // cyan-300
    text: "#94a3b8", // slate-400
    "text-light": "#cbd5e1", // slate-300
    danger: "#ef4444", // red-500
  },
  purple: {
    background: "#1a1129",
    panel: "#2a1a42",
    primary: "#c026d3", // fuchsia-600
    "primary-light": "#d946ef", // fuchsia-500
    "primary-lighter": "#e879f9", // fuchsia-400
    text: "#a89ab5",
    "text-light": "#d1c5de",
    danger: "#ef4444", // red-500
  },
};

export type Theme = (typeof themes)["blue"] | (typeof themes)["purple"];
export type ThemeName = keyof typeof themes;

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>("blue");

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = (await AsyncStorage.getItem("theme")) as ThemeName;
      if (storedTheme && themes[storedTheme]) {
        setThemeName(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const setTheme = (newThemeName: ThemeName) => {
    if (themes[newThemeName]) {
      setThemeName(newThemeName);
      AsyncStorage.setItem("theme", newThemeName);
    }
  };

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
