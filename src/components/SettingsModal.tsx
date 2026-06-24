"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import {
  X,
  Sun,
  Moon,
  Monitor,
  Info,
  Download,
  Upload,
  Trash2,
  Palette,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("appearance");

  if (!isOpen) return null;

  const handleExportAll = () => {
    alert("导出所有数据功能开发中...");
  };

  const handleImportAll = () => {
    alert("导入数据功能开发中...");
  };

  const handleClearData = () => {
    if (confirm("确定要清空所有数据吗？此操作不可恢复！")) {
      indexedDB.deleteDatabase("notion-local-db");
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-popover border border-border rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">设置</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r border-border p-2 space-y-1 shrink-0">
            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === "appearance"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Palette size={16} />
              外观
            </button>
            <button
              onClick={() => setActiveTab("data")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === "data"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Download size={16} />
              数据管理
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === "about"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Info size={16} />
              关于
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-4">主题模式</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        theme === "light"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <Sun size={24} className="text-amber-500" />
                      <span className="text-sm font-medium">浅色</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        theme === "dark"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <Moon size={24} className="text-indigo-500" />
                      <span className="text-sm font-medium">深色</span>
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        theme === "system"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <Monitor size={24} className="text-gray-500" />
                      <span className="text-sm font-medium">跟随系统</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-2">数据导出</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    将所有文档数据导出为 JSON 文件，方便备份和迁移。
                  </p>
                  <button
                    onClick={handleExportAll}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Download size={16} />
                    导出所有数据
                  </button>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold mb-2">数据导入</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    从之前导出的 JSON 文件中恢复数据。
                  </p>
                  <button
                    onClick={handleImportAll}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                  >
                    <Upload size={16} />
                    导入数据
                  </button>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold mb-2 text-destructive">
                    清空数据
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    永久删除所有文档和数据，此操作不可恢复。
                  </p>
                  <button
                    onClick={handleClearData}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
                  >
                    <Trash2 size={16} />
                    清空所有数据
                  </button>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">云文档</h3>
                  <p className="text-sm text-muted-foreground">
                    版本 1.0.0
                  </p>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    一个本地优先的 Notion-like 富文本记事本，所有数据保存在你的浏览器中。
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>支持 Markdown / HTML 导入导出</li>
                    <li>支持多级文档嵌套</li>
                    <li>深色 / 浅色主题切换</li>
                    <li>数据完全存储在本地 IndexedDB</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
