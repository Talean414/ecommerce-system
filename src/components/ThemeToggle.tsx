"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md transition-colors duration-300 bg-secondary hover:bg-secondary/80"
    >
      {theme === "light" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
    </button>
  );
}