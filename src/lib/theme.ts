import { useEffect, useState } from "react";
import { getUserSettings, updateUserSettings } from "./settings";

type ThemeMode = "light" | "dark" | "system";

export interface ThemePreferences {
  mode: ThemeMode;
  primaryColor?: string;
  fontFamily?: string;
}

// Apply theme to document
export const applyTheme = (theme: ThemeMode) => {
  const root = window.document.documentElement;

  // Remove previous theme classes
  root.classList.remove("light", "dark");

  // Apply new theme
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }

  // Store theme in localStorage for persistence
  localStorage.setItem("theme", theme);
};

// Hook to manage theme
export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // Get theme from localStorage or default to system
    const savedTheme = localStorage.getItem("theme") as ThemeMode;
    return savedTheme || "system";
  });

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    // Save to user settings in database if user is logged in
    try {
      await updateUserSettings({ theme: newTheme });
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Set specific theme
  const setThemeMode = async (newTheme: ThemeMode) => {
    setTheme(newTheme);

    // Save to user settings in database if user is logged in
    try {
      await updateUserSettings({ theme: newTheme });
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  return { theme, toggleTheme, setThemeMode };
};

// Initialize theme from user settings
export const initializeThemeFromSettings = async () => {
  try {
    const settings = await getUserSettings();
    if (settings?.theme) {
      applyTheme(settings.theme as ThemeMode);
    }
  } catch (error) {
    console.error("Error initializing theme from settings:", error);
  }
};
