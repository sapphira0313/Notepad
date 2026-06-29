/**
 * editorStore.ts — Zustand Store，管理文档树和编辑状态
 *
 * 重构要点：
 * 1. Immer 中间件 + 生产环境关闭 autoFreeze
 * 2. 完整的 IndexedDB CRUD（通过 src/lib/storage.ts）
 * 3. 细粒度 Selector 导出，避免不必要的重渲染
 * 4. Save Status 由 AutoSaveEngine 管理，store 保持同步
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { setAutoFreeze } from "immer";
import { generateId } from "../lib/id";
import {
  getStorage,
  type PageDocument,
  type WorkspaceData,
} from "../lib/storage";

// ─── 生产环境关闭 Immer autoFreeze ──────────────────────────────────

if (process.env.NODE_ENV === "production") {
  setAutoFreeze(false);
}

// ─── 类型定义 ────────────────────────────────────────────────────────

export interface PageMeta {
  id: string;
  title: string;
  icon: string;
  parentId: string | null;
  childIds: string[];
  createdAt: number;
  updatedAt: number;
  isStarred: boolean;
  lastOpenedAt: number;
}

export interface StoredBlock {
  id: string;
  type: string;
  props: Record<string, unknown>;
  content: unknown[];
  children?: StoredBlock[];
  parentId?: string | null;
}

export interface PageData {
  id: string;
  meta: PageMeta;
  blocks: StoredBlock[];
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";
export type ActiveView = "page" | "database";

export interface EditorStoreState {
  // ── Workspace ──
  rootPageIds: string[];
  pages: Record<string, PageMeta>;
  currentPageId: string | null;
  currentPageData: PageData | null;
  isLoaded: boolean;

  // ── View ──
  activeView: ActiveView;

  // ── Save Status ──
  saveStatus: SaveStatus;
  lastSavedAt: number | null;
  lastSaveError: string | null;

  // ── Dirty Tracking ──
  isDirty: boolean;

  // ── Actions ──
  loadWorkspace: () => Promise<void>;
  loadPage: (id: string) => Promise<void>;
  createPage: (
    parentId?: string | null,
    title?: string
  ) => Promise<string>;
  deletePage: (id: string) => Promise<void>;
  updatePageMeta: (
    id: string,
    meta: Partial<Pick<PageMeta, "title" | "icon">>
  ) => void;
  toggleStar: (id: string) => void;
  updateBlocks: (blocks: StoredBlock[]) => Promise<void>;
  setCurrentPage: (id: string | null) => void;
  setActiveView: (view: ActiveView) => void;

  // ── Save Status Actions ──
  markSaving: () => void;
  markSaved: () => void;
  markSaveError: (error: string) => void;
}

// ─── 辅助函数 ────────────────────────────────────────────────────────

/** 从 workspace 数据重建 pages map */
function rebuildPageMap(wp: WorkspaceData): Record<string, PageMeta> {
  const pages: Record<string, PageMeta> = {};
  for (const [id, node] of Object.entries(wp.pageTree)) {
    pages[id] = {
      id,
      title: node.title,
      icon: node.icon,
      parentId: null,
      childIds: node.childIds,
      createdAt: 0,
      updatedAt: wp.lastModified,
      isStarred: false,
      lastOpenedAt: 0,
    };
  }
  // 第二遍：补全 parentId
  for (const [, page] of Object.entries(pages)) {
    for (const childId of page.childIds) {
      if (pages[childId]) {
        pages[childId].parentId = page.id;
      }
    }
  }
  return pages;
}

/** 从 page map 构建 workspace 兼容的 pageTree */
function buildPageTree(pages: Record<string, PageMeta>) {
  const tree: Record<
    string,
    { title: string; icon: string; childIds: string[] }
  > = {};
  for (const [, page] of Object.entries(pages)) {
    tree[page.id] = {
      title: page.title,
      icon: page.icon,
      childIds: page.childIds,
    };
  }
  return tree;
}

/** 持久化 workspace 元数据 */
async function persistWorkspace(store: EditorStoreState): Promise<void> {
  const storage = await getStorage();
  await storage.saveWorkspace({
    version: 1,
    name: "My Workspace",
    rootPageIds: store.rootPageIds,
    pageTree: buildPageTree(store.pages),
    databaseIds: [],
    lastModified: Date.now(),
    currentPageId: store.currentPageId,
  });
}

/** 创建默认欢迎页面 */
function createWelcomeBlocks(): StoredBlock[] {
  const h1Id = generateId();
  const p1Id = generateId();
  const p2Id = generateId();
  return [
    {
      id: h1Id,
      type: "heading",
      props: {
        level: 1,
        textContent: "欢迎使用 云文档 🎉",
      },
      content: [],
      parentId: null,
    },
    {
      id: p1Id,
      type: "paragraph",
      props: {
        textContent:
          "这是一个本地优先的 Notion 替代品，所有数据保存在你的浏览器中。",
      },
      content: [],
      parentId: null,
    },
    {
      id: p2Id,
      type: "paragraph",
      props: {
        textContent:
          "在左侧边栏中创建新页面开始使用吧！",
      },
      content: [],
      parentId: null,
    },
  ] as StoredBlock[];
}

// ─── Store 实现 ──────────────────────────────────────────────────────

export const useEditorStore = create<EditorStoreState>()(
  immer((set, get) => ({
    // ── 初始状态 ──
    rootPageIds: [],
    pages: {},
    currentPageId: null,
    currentPageData: null,
    isLoaded: false,
    activeView: "page" as ActiveView,
    saveStatus: "idle" as SaveStatus,
    lastSavedAt: null,
    lastSaveError: null,
    isDirty: false,

    // ── Save Status Actions ────────────────────────────────────

    markSaving: () => {
      set((s) => {
        s.saveStatus = "saving";
      });
    },
    markSaved: () => {
      set((s) => {
        s.saveStatus = "saved";
        s.lastSavedAt = Date.now();
        s.isDirty = false;
        s.lastSaveError = null;
      });
    },
    markSaveError: (error: string) => {
      set((s) => {
        s.saveStatus = "error";
        s.lastSaveError = error;
      });
    },

    // ── Workspace 操作 ─────────────────────────────────────────

    loadWorkspace: async () => {
      const storage = await getStorage();
      const wp = await storage.loadWorkspace();

      if (wp && Object.keys(wp.pageTree).length > 0) {
        const pages = rebuildPageMap(wp);
        // 优先使用保存的当前页面 ID（如果存在且页面存在），否则使用第一个页面
        const savedPageId = wp.currentPageId;
        let targetPageId = (savedPageId && savedPageId in pages)
          ? savedPageId
          : wp.rootPageIds[0] ?? null;
        
        let currentPageData: PageData | null = null;
        if (targetPageId) {
          const page = await storage.loadPage(targetPageId);
          currentPageData = page || null;
        }
        
        // 如果目标页面加载失败，尝试加载其他页面
        if (!currentPageData && wp.rootPageIds.length > 0) {
          for (const pageId of wp.rootPageIds) {
            if (pageId !== targetPageId) {
              const page = await storage.loadPage(pageId);
              if (page) {
                currentPageData = page;
                targetPageId = pageId;
                break;
              }
            }
          }
        }
        
        set((s) => {
          s.rootPageIds = wp.rootPageIds;
          s.pages = pages;
          s.currentPageId = targetPageId;
          s.currentPageData = currentPageData;
          s.isLoaded = true;
        });
      } else {
        // 首次启动：创建欢迎页面
        const pageId = generateId();
        const now = Date.now();

        const meta: PageMeta = {
        id: pageId,
        title: "欢迎使用 云文档",
        icon: "🚀",
        parentId: null,
        childIds: [],
        createdAt: now,
        updatedAt: now,
        isStarred: false,
        lastOpenedAt: now,
      };

        const page: PageDocument = {
          id: pageId,
          meta,
          blocks: createWelcomeBlocks(),
        };

        await storage.savePage(page);
        await storage.saveWorkspace({
          version: 1,
          name: "My Workspace",
          rootPageIds: [pageId],
          pageTree: {
            [pageId]: {
              title: meta.title,
              icon: meta.icon,
              childIds: [],
            },
          },
          databaseIds: [],
          lastModified: now,
          currentPageId: pageId,
        });

        set((s) => {
          s.rootPageIds = [pageId];
          s.pages = { [pageId]: meta };
          s.currentPageId = pageId;
          s.currentPageData = page;
          s.isLoaded = true;
        });
      }
    },

    loadPage: async (id: string) => {
      const storage = await getStorage();
      const page = await storage.loadPage(id);
      if (page) {
        const now = Date.now();
        set((s) => {
          s.currentPageId = id;
          s.currentPageData = page;
          s.isDirty = false;
          if (s.pages[id]) {
            s.pages[id].lastOpenedAt = now;
          }
        });
        // 保存当前页面 ID 到 workspace
        await persistWorkspace(get());
      }
    },

    createPage: async (
      parentId = null,
      title = "无标题"
    ): Promise<string> => {
      const pageId = generateId();
      const now = Date.now();

      const meta: PageMeta = {
        id: pageId,
        title,
        icon: "📄",
        parentId: parentId ?? null,
        childIds: [],
        createdAt: now,
        updatedAt: now,
        isStarred: false,
        lastOpenedAt: now,
      };

      const page: PageDocument = {
        id: pageId,
        meta,
        blocks: [],
      };

      const storage = await getStorage();
      await storage.savePage(page);

      // Immer 中直接修改 state
      set((s) => {
        s.pages[pageId] = meta;
        if (parentId && s.pages[parentId]) {
          s.pages[parentId].childIds.push(pageId);
        } else {
          s.rootPageIds.push(pageId);
        }
      });

      // 持久化 workspace（根节点或子节点变化）
      await persistWorkspace(get());
      return pageId;
    },

    deletePage: async (id: string) => {
      const state = get();
      const page = state.pages[id];
      if (!page) return;

      // 递归删除所有子页面
      const collectSubtree = (pageId: string): string[] => {
        const p = state.pages[pageId];
        if (!p) return [];
        const ids: string[] = [];
        for (const childId of p.childIds) {
          ids.push(...collectSubtree(childId));
        }
        ids.push(pageId);
        return ids;
      };

      const allIds = collectSubtree(id);
      const storage = await getStorage();

      // 删除所有子树的页面数据
      for (const pageId of allIds) {
        await storage.deletePage(pageId);
      }

      // 更新状态
      set((s) => {
        const parentId = s.pages[id]?.parentId;
        // 从父节点的 childIds 或 rootPageIds 中移除
        if (parentId && s.pages[parentId]) {
          s.pages[parentId].childIds = s.pages[
            parentId
          ].childIds.filter((cid) => cid !== id);
        } else {
          s.rootPageIds = s.rootPageIds.filter(
            (rid) => rid !== id
          );
        }
        // 移除所有子树中的页面
        for (const pageId of allIds) {
          delete s.pages[pageId];
        }
        // 如果当前页面是被删除的页面之一，清空当前状态
        if (s.currentPageId && allIds.includes(s.currentPageId)) {
          s.currentPageId = null;
          s.currentPageData = null;
        }
      });

      await persistWorkspace(get());
    },

    updatePageMeta: async (
      id: string,
      partial: Partial<Pick<PageMeta, "title" | "icon">>
    ) => {
      const { title, icon } = partial;
      set((s) => {
        if (s.pages[id]) {
          if (title !== undefined) s.pages[id].title = title;
          if (icon !== undefined) s.pages[id].icon = icon;
          s.pages[id].updatedAt = Date.now();
        }
        // 同步更新 currentPageData
        if (s.currentPageData?.id === id) {
          if (title !== undefined)
            s.currentPageData.meta.title = title;
          if (icon !== undefined)
            s.currentPageData.meta.icon = icon;
          s.currentPageData.meta.updatedAt = Date.now();
        }
        s.isDirty = true;
      });

      const state = get();
      // 如果当前页面正是被修改的页面，重新持久化页面数据
      if (state.currentPageData?.id === id) {
        const storage = await getStorage();
        await storage.savePage(state.currentPageData);
      }
      await persistWorkspace(state);
    },

    toggleStar: (id: string) => {
      set((s) => {
        if (s.pages[id]) {
          s.pages[id].isStarred = !s.pages[id].isStarred;
          s.pages[id].updatedAt = Date.now();
        }
        if (s.currentPageData?.id === id) {
          s.currentPageData.meta.isStarred = !s.currentPageData.meta.isStarred;
          s.currentPageData.meta.updatedAt = Date.now();
        }
        s.isDirty = true;
      });
      const state = get();
      persistWorkspace(state);
    },

    updateBlocks: async (blocks: StoredBlock[]) => {
      const state = get();
      if (!state.currentPageData) return;

      const storage = await getStorage();
      const updatedPage: PageDocument = {
        ...state.currentPageData,
        blocks,
        meta: {
          ...state.currentPageData.meta,
          updatedAt: Date.now(),
        },
      };

      await storage.savePage(updatedPage);
      // 同时保存 workspace（确保 currentPageId 被保存）
      await persistWorkspace({ ...state, currentPageData: updatedPage });

      set((s) => {
        if (s.currentPageData) {
          s.currentPageData.blocks = blocks;
          s.currentPageData.meta.updatedAt = Date.now();
        }
      });
    },

    setCurrentPage: (id: string | null) => {
      set((s) => {
        s.currentPageId = id;
        if (!id) {
          s.currentPageData = null;
        }
      });
    },

    setActiveView: (view: ActiveView) => {
      set((s) => {
        s.activeView = view;
      });
    },
  }))
);

// ─── 细粒度 Selector 导出 ────────────────────────────────────────────

export function selectSaveStatus(
  state: EditorStoreState
) {
  return {
    saveStatus: state.saveStatus,
    lastSavedAt: state.lastSavedAt,
    lastSaveError: state.lastSaveError,
    isDirty: state.isDirty,
  };
}

export function selectPageList(state: EditorStoreState) {
  return Object.values(state.pages);
}

export function selectCurrentPage(
  state: EditorStoreState
) {
  return state.currentPageData;
}

export function selectCurrentBlocks(
  state: EditorStoreState
): StoredBlock[] | null {
  return state.currentPageData?.blocks ?? null;
}

export function selectIsLoaded(state: EditorStoreState) {
  return state.isLoaded;
}

export function selectPageById(id: string) {
  return (state: EditorStoreState) => state.pages[id] ?? null;
}
