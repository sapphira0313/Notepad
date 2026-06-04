"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={resolvedTheme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
      className="p-2 rounded-xl hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-all duration-200 hover:shadow-md hover:shadow-black/8"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="w-4 h-4" aria-hidden="true" />
      ) : (
        <Sun className="w-4 h-4" aria-hidden="true" />
      )}
    </button>
  );
}
