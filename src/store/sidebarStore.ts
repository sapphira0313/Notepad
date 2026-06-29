/**
 * SidebarStore.ts — 侧边栏 UI 状态
 *
 * 仅管理 UI 相关状态：侧边栏开关、宽度、当前活动视图。
 * 页面数据从 useEditorStore 获取。
 */

import { create } from "zustand";

export type SidebarView = "all" | "recent" | "starred";
export type MainView = "editor" | "table";

export interface SidebarStoreState {
  // ── 侧边栏 ──
  sidebarOpen: boolean;
  sidebarWidth: number;

  // ── 视图 Tab ──
  activeTab: SidebarView;

  // ── 主视图 ──
  mainView: MainView;

  // ── 搜索 ──
  searchQuery: string;

  // ── Actions ──
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setActiveTab: (tab: SidebarView) => void;
  setMainView: (view: MainView) => void;
  setSearchQuery: (query: string) => void;
}

export const useSidebarStore = create<SidebarStoreState>()(
  (set) => ({
    sidebarOpen: true,
    sidebarWidth: 280,
    activeTab: "all",
    mainView: "editor",
    searchQuery: "",

    toggleSidebar: () =>
      set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setSidebarWidth: (width) => set({ sidebarWidth: width }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setMainView: (view) => set({ mainView: view }),
    setSearchQuery: (query) => set({ searchQuery: query }),
  })
);
