import { createContext, useContext, useEffect } from "react";

// Create Theme Context
const ThemeContext = createContext();

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Always use dark mode, no state needed since it doesn't change
  const darkMode = true;

  // Effect to ensure dark mode class is added to HTML
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Empty toggle function that doesn't actually change the theme
  const toggleDarkMode = () => {
    // Does nothing - theme stays dark
    console.log("Theme switching is disabled");
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
