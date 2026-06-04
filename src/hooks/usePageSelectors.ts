/**
 * 页面 Store 选择器 Hooks
 * 组件通过这些 hooks 访问页面数据，而非直接依赖 store 实现
 */
import { usePageStore } from "@/stores/usePageStore";

export function usePages() {
  return usePageStore((s) => s.pages);
}

export function useRootPageIds() {
  return usePageStore((s) => s.rootPageIds);
}

export function useCurrentPageId() {
  return usePageStore((s) => s.currentPageId);
}

export function useCurrentPageData() {
  return usePageStore((s) => s.currentPageData);
}

export function useIsLoaded() {
  return usePageStore((s) => s.isLoaded);
}

export function usePageActions() {
  return {
    loadWorkspace: usePageStore((s) => s.loadWorkspace),
    createPage: usePageStore((s) => s.createPage),
    deletePage: usePageStore((s) => s.deletePage),
    updatePageMeta: usePageStore((s) => s.updatePageMeta),
    loadPage: usePageStore((s) => s.loadPage),
    updateBlocks: usePageStore((s) => s.updateBlocks),
    setCurrentPage: usePageStore((s) => s.setCurrentPage),
  };
}
