"use client";

import { useUIStore } from "@/stores/useUIStore";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS = [
  { group: "通用", items: [
    { keys: ["Ctrl", "N"], desc: "新建页面" },
    { keys: ["Ctrl", "Shift", "N"], desc: "新建子页面" },
    { keys: ["Ctrl", "S"], desc: "保存当前页面" },
    { keys: ["Ctrl", "K"], desc: "搜索文档" },
    { keys: ["Ctrl", "D"], desc: "收藏当前页面" },
    { keys: ["Ctrl", "/"], desc: "快捷键帮助" },
  ]},
  { group: "编辑", items: [
    { keys: ["Ctrl", "F"], desc: "页面内搜索" },
    { keys: ["Ctrl", "B"], desc: "加粗" },
    { keys: ["Ctrl", "I"], desc: "斜体" },
    { keys: ["Ctrl", "Shift", "K"], desc: "代码" },
    { keys: ["/"], desc: "斜杠菜单" },
  ]},
  { group: "导航", items: [
    { keys: ["Ctrl", "\\"], desc: "切换侧栏" },
    { keys: ["Esc"], desc: "关闭对话框" },
  ]},
];

export function ShortcutsHelpDialog() {
  const { shortcutsOpen, closeShortcuts } = useUIStore();

  if (!shortcutsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in-0">
      <div className="w-full max-w-md bg-popover border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold font-[var(--font-heading)]">键盘快捷键</h3>
          </div>
          <button onClick={closeShortcuts} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5 max-h-96 overflow-y-auto">
          {SHORTCUTS.map((group) => (
            <div key={group.group}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{group.group}</p>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <div key={item.desc} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-foreground/80">{item.desc}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, i) => (
                        <span key={i}>
                          <kbd className="px-2 py-0.5 text-xs font-mono bg-muted border border-border/60 rounded-md min-w-[24px] text-center inline-block">
                            {key}
                          </kbd>
                          {i < item.keys.length - 1 && <span className="text-muted-foreground/40 mx-0.5">+</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
