import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const darkMode = true;

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    console.log("Theme switching is disabled");
  };

  const value = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
