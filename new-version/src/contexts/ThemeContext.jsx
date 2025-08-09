import React, { createContext, useContext, useState, useEffect } from "react";

// Theme types
export const THEME_TYPES = {
  LIGHT: "light",
  DARK: "dark",
  DEVICE: "device",
};

// Create theme context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEME_TYPES.LIGHT);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get system theme preference
  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEME_TYPES.DARK
      : THEME_TYPES.LIGHT;
  };

  // Check if system theme is dark
  const isSystemDark = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // Apply theme to document
  const applyTheme = (newTheme) => {
    const actualTheme =
      newTheme === THEME_TYPES.DEVICE ? getSystemTheme() : newTheme;
    const isDark = actualTheme === THEME_TYPES.DARK;

    document.documentElement.setAttribute("data-theme", actualTheme);
    document.body.classList.toggle("dark-theme", isDark);
    setIsDarkMode(isDark);
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("keep-theme");
    const initialTheme = savedTheme || THEME_TYPES.DEVICE;
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === THEME_TYPES.DEVICE) {
        applyTheme(THEME_TYPES.DEVICE);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Update theme
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("keep-theme", newTheme);
    applyTheme(newTheme);
  };

  // Get current effective theme (for display purposes)
  const getEffectiveTheme = () => {
    return theme === THEME_TYPES.DEVICE ? getSystemTheme() : theme;
  };

  // Check if device theme is currently active
  const isDeviceThemeActive = () => {
    return theme === THEME_TYPES.DEVICE;
  };

  const value = {
    theme,
    isDarkMode,
    updateTheme,
    getEffectiveTheme,
    isDeviceThemeActive,
    THEME_TYPES,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
