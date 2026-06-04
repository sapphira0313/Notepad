import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ActiveView = "page" | "database";
type SidebarTab = "all" | "recent" | "favorite" | "trash";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface UIStore {
  // 侧栏
  sidebarOpen: boolean;
  sidebarWidth: number;
  sidebarTab: SidebarTab;

  // 视图
  activeView: ActiveView;

  // 对话框状态
  searchOpen: boolean;
  shortcutsOpen: boolean;
  movePageDialogOpen: boolean;
  movePageTargetId: string | null;

  // Toast 消息
  toasts: ToastMessage[];

  // 操作
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  setActiveView: (view: ActiveView) => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openShortcuts: () => void;
  closeShortcuts: () => void;
  toggleShortcuts: () => void;
  openMovePageDialog: (pageId: string) => void;
  closeMovePageDialog: () => void;
  showToast: (message: string, type?: ToastMessage["type"], duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>()(
  immer((set) => ({
    sidebarOpen: true,
    sidebarWidth: 288,
    sidebarTab: "all" as SidebarTab,
    activeView: "page" as ActiveView,
    searchOpen: false,
    shortcutsOpen: false,
    movePageDialogOpen: false,
    movePageTargetId: null,
    toasts: [],

    toggleSidebar: () => set((state) => { state.sidebarOpen = !state.sidebarOpen; }),
    setSidebarOpen: (open) => set((state) => { state.sidebarOpen = open; }),
    setSidebarWidth: (width) => set((state) => { state.sidebarWidth = Math.max(220, Math.min(400, width)); }),
    setSidebarTab: (tab) => set((state) => { state.sidebarTab = tab; }),
    setActiveView: (view) => set((state) => { state.activeView = view; }),
    openSearch: () => set((state) => { state.searchOpen = true; }),
    closeSearch: () => set((state) => { state.searchOpen = false; }),
    toggleSearch: () => set((state) => { state.searchOpen = !state.searchOpen; }),
    openShortcuts: () => set((state) => { state.shortcutsOpen = true; }),
    closeShortcuts: () => set((state) => { state.shortcutsOpen = false; }),
    toggleShortcuts: () => set((state) => { state.shortcutsOpen = !state.shortcutsOpen; }),
    openMovePageDialog: (pageId) => set((state) => { state.movePageDialogOpen = true; state.movePageTargetId = pageId; }),
    closeMovePageDialog: () => set((state) => { state.movePageDialogOpen = false; state.movePageTargetId = null; }),
    showToast: (message, type = "info", duration = 3000) => {
      const id = `toast-${Date.now()}`;
      set((state) => {
        state.toasts.push({ id, message, type, duration });
      });
      setTimeout(() => {
        set((state) => {
          state.toasts = state.toasts.filter((t) => t.id !== id);
        });
      }, duration);
    },
    removeToast: (id) => {
      set((state) => {
        state.toasts = state.toasts.filter((t) => t.id !== id);
      });
    },
  }))
);
