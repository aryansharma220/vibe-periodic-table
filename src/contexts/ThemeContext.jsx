import { createContext, useContext, useState, useEffect } from "react";

// Create Theme Context
const ThemeContext = createContext();

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Check if dark mode is stored in localStorage or if user prefers dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("dark-mode");
    if (savedTheme !== null) {
      return savedTheme === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Effect to update HTML class when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dark-mode", darkMode);
  }, [darkMode]);

  // Toggle function
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Value object provided to context consumers
  const value = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
