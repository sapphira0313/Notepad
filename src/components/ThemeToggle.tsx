/**
 * ThemeToggle.tsx — 主题切换按钮
 *
 * 使用 next-themes 的 useTheme hook，切换 light/dark 模式。
 * 对应原 16n_7288zoqtd.js 中的 nk 组件。
 */

"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "./ColorfulIcons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        onClick={() =>
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        title="切换主题"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      title="切换主题"
    >
      {resolvedTheme === "dark" ? (
        <MoonIcon size={18} />
      ) : (
        <SunIcon size={18} />
      )}
    </button>
  );
}
