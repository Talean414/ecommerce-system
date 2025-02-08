"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define available theme types
export type Theme = "light" | "dark" | "emerald" | "lavender" | "chocolate" | "rosegold" | "purple";

// Define the context structure
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void; // Add toggleTheme
}

// Create Context with a default value of undefined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider Component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  // Load theme from localStorage (if exists)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && ["light", "dark", "emerald", "lavender", "chocolate", "rosegold", "purple"].includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme); // Add the theme class to the document
    }
  }, []);

  // Update theme in localStorage & HTML class
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark", "emerald", "lavender", "chocolate", "rosegold", "purple");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for consuming Theme Context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};