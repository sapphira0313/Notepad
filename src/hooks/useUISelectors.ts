/**
 * UI Store 选择器 Hooks
 * 组件通过这些 hooks 访问 UI 状态，而非直接依赖 store 实现
 */
import { useUIStore } from "@/stores/useUIStore";

export function useSidebarOpen() {
  return useUIStore((s) => s.sidebarOpen);
}

export function useSidebarWidth() {
  return useUIStore((s) => s.sidebarWidth);
}

export function useSidebarTab() {
  return useUIStore((s) => s.sidebarTab);
}

export function useActiveView() {
  return useUIStore((s) => s.activeView);
}

export function useSearchOpen() {
  return useUIStore((s) => s.searchOpen);
}

export function useUIActions() {
  return {
    toggleSidebar: useUIStore((s) => s.toggleSidebar),
    setSidebarOpen: useUIStore((s) => s.setSidebarOpen),
    setSidebarWidth: useUIStore((s) => s.setSidebarWidth),
    setSidebarTab: useUIStore((s) => s.setSidebarTab),
    setActiveView: useUIStore((s) => s.setActiveView),
    openSearch: useUIStore((s) => s.openSearch),
    closeSearch: useUIStore((s) => s.closeSearch),
    toggleSearch: useUIStore((s) => s.toggleSearch),
  };
}
