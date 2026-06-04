"use client";

import { useEffect, useCallback } from "react";
import { usePageStore } from "@/stores/usePageStore";
import { useUIStore } from "@/stores/useUIStore";

export function useKeyboardShortcuts() {
  const createPage = usePageStore((s) => s.createPage);
  const loadPage = usePageStore((s) => s.loadPage);
  const currentPageData = usePageStore((s) => s.currentPageData);
  const currentPageId = usePageStore((s) => s.currentPageId);
  const updateBlocks = usePageStore((s) => s.updateBlocks);
  const toggleSearch = useUIStore((s) => s.toggleSearch);
  const showToast = useUIStore((s) => s.showToast);

  // 手动保存当前页面
  const handleSave = useCallback(async () => {
    if (!currentPageData) return;
    try {
      await updateBlocks([...currentPageData.blocks]);
      showToast("保存成功", "success");
    } catch (err) {
      console.error("Save failed:", err);
      showToast("保存失败，请重试", "error");
    }
  }, [currentPageData, updateBlocks, showToast]);

  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      // Cmd/Ctrl + N: 新建页面
      if (mod && !e.shiftKey && e.key === "n") {
        e.preventDefault();
        const id = await createPage(null);
        await loadPage(id);
      }

      // Cmd/Ctrl + Shift + N: 新建子页面
      if (mod && e.shiftKey && e.key === "N") {
        e.preventDefault();
        if (currentPageId) {
          const id = await createPage(currentPageId);
          await loadPage(id);
        }
      }

      // Cmd/Ctrl + S: 手动保存
      if (mod && e.key === "s") {
        e.preventDefault();
        handleSave();
      }

      // Cmd/Ctrl + F: 页面内搜索
      if (mod && e.key === "f") {
        e.preventDefault();
        // 触发页面内搜索（通过 DOM 查找搜索输入框）
        const searchBtn = document.querySelector<HTMLElement>('[title*="页面内搜索"]');
        if (searchBtn) searchBtn.click();
      }

      // Cmd/Ctrl + K: 搜索
      if (mod && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }

      // Cmd/Ctrl + D: 收藏当前页面
      if (mod && e.key === "d") {
        e.preventDefault();
        if (currentPageId) {
          usePageStore.getState().toggleFavorite(currentPageId);
        }
      }

      // Cmd/Ctrl + /: 快捷键帮助面板
      if (mod && (e.key === "/" || e.key === "?")) {
        e.preventDefault();
        useUIStore.getState().toggleShortcuts();
      }

      // Cmd/Ctrl + \: 切换侧栏
      if (mod && e.key === "\\") {
        e.preventDefault();
        useUIStore.getState().toggleSidebar();
      }

      // Escape: 关闭对话框
      if (e.key === "Escape") {
        const ui = useUIStore.getState();
        if (ui.searchOpen) {
          ui.closeSearch();
        } else if (ui.shortcutsOpen) {
          ui.closeShortcuts();
        } else if (ui.movePageDialogOpen) {
          ui.closeMovePageDialog();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [createPage, loadPage, handleSave, toggleSearch, currentPageId]);
}
