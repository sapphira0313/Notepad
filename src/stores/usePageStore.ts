import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { generateId } from "@/lib/id";
import type { PageMeta, PageData, WorkspaceMeta, Block, TrashEntry } from "@/types/page";
import { getStorage } from "@/lib/storage/StorageManager";

/** 检查 targetId 是否是 parentId 的后代节点 */
function isDescendant(
  parentId: string,
  targetId: string,
  pages: Record<string, PageMeta>
): boolean {
  const page = pages[parentId];
  if (!page) return false;
  for (const childId of page.childIds) {
    if (childId === targetId) return true;
    if (isDescendant(childId, targetId, pages)) return true;
  }
  return false;
}

// ── 持久化辅助（从 store 解耦）──────────────────────

async function buildAndSaveWorkspace(
  pages: Record<string, PageMeta>,
  rootPageIds: string[]
) {
  const storage = await getStorage();
  const pageTree: WorkspaceMeta["pageTree"] = {};
  const trashTree: Record<string, TrashEntry> = {};

  for (const [id, meta] of Object.entries(pages)) {
    if (meta.deletedAt) {
      trashTree[id] = {
        title: meta.title,
        icon: meta.icon,
        childIds: meta.childIds,
        deletedAt: meta.deletedAt,
      };
    } else {
      pageTree[id] = {
        title: meta.title,
        icon: meta.icon,
        childIds: meta.childIds,
      };
    }
  }
  await storage.saveWorkspace({
    version: 1,
    name: "My Workspace",
    rootPageIds,
    pageTree,
    databaseIds: [],
    lastModified: Date.now(),
    trashTree,
  });
}

// ── Store 接口 ────────────────────────────────────────

interface PageStore {
  rootPageIds: string[];
  pages: Record<string, PageMeta>;
  currentPageId: string | null;
  currentPageData: PageData | null;
  isLoaded: boolean;

  loadWorkspace: () => Promise<void>;
  createPage: (parentId: string | null, title?: string) => Promise<string>;
  deletePage: (pageId: string) => Promise<void>;
  softDeletePage: (pageId: string) => Promise<void>;
  restorePage: (pageId: string) => Promise<void>;
  permanentDeletePage: (pageId: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  updatePageMeta: (pageId: string, updates: Partial<PageMeta>) => Promise<void>;
  toggleFavorite: (pageId: string) => Promise<void>;
  togglePin: (pageId: string) => Promise<void>;
  movePage: (pageId: string, newParentId: string | null) => Promise<void>;
  reorderPages: (parentId: string | null, fromIndex: number, toIndex: number) => Promise<void>;
  loadPage: (pageId: string) => Promise<void>;
  updateBlocks: (blocks: Block[]) => Promise<void>;
  setCurrentPage: (pageId: string | null) => void;
  /** 获取回收站中的页面 */
  getTrashPages: () => PageMeta[];
  /** 更新页面图标（emoji） */
  setPageIcon: (pageId: string, icon: string) => Promise<void>;
}

export const usePageStore = create<PageStore>()(
  immer((set, get) => ({
    rootPageIds: [],
    pages: {},
    currentPageId: null,
    currentPageData: null,
    isLoaded: false,

    loadWorkspace: async () => {
      try {
        const storage = await getStorage();
        const workspace = await storage.loadWorkspace();

        if (workspace) {
        const pages: Record<string, PageMeta> = {};
        for (const [id, entry] of Object.entries(workspace.pageTree)) {
          pages[id] = {
            id,
            title: entry.title,
            icon: entry.icon,
            parentId: null,
            childIds: entry.childIds,
            createdAt: 0,
            updatedAt: workspace.lastModified,
          };
        }
        // Reconstruct parentId from tree
        for (const [parentId, meta] of Object.entries(pages)) {
          for (const childId of meta.childIds) {
            if (pages[childId]) pages[childId].parentId = parentId;
          }
        }

        // Restore trash pages from trashTree
        if (workspace.trashTree) {
          for (const [id, entry] of Object.entries(workspace.trashTree)) {
            pages[id] = {
              id,
              title: entry.title,
              icon: entry.icon,
              parentId: null,
              childIds: entry.childIds,
              createdAt: 0,
              updatedAt: workspace.lastModified,
              deletedAt: entry.deletedAt,
            };
          }
          // Reconstruct parentId for trash pages
          for (const [parentId, entry] of Object.entries(workspace.trashTree)) {
            for (const childId of entry.childIds) {
              if (pages[childId]) pages[childId].parentId = parentId;
            }
          }
        }

        set((state) => {
          state.rootPageIds = workspace.rootPageIds;
          state.pages = pages;
          state.isLoaded = true;
        });
      } else {
        const welcomeId = generateId();
        const welcomePage: PageData = {
          id: welcomeId,
          meta: {
            id: welcomeId,
            title: "欢迎使用 Notion 本地版",
            icon: "🚀",
            parentId: null,
            childIds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          blocks: [
            { id: generateId(), type: "heading", props: { level: 1, textContent: "欢迎使用 Notion 本地版 🎉" }, content: [], parentId: null },
            { id: generateId(), type: "paragraph", props: { textContent: "这是一个本地优先的 Notion 替代品，所有数据保存在你的浏览器中。" }, content: [], parentId: null },
            { id: generateId(), type: "paragraph", props: { textContent: "在左侧边栏中创建新页面开始使用吧！" }, content: [], parentId: null },
          ],
        };

        await storage.savePage(welcomePage);
        await storage.saveWorkspace({
          version: 1,
          name: "My Workspace",
          rootPageIds: [welcomeId],
          pageTree: { [welcomeId]: { title: welcomePage.meta.title, icon: welcomePage.meta.icon, childIds: [] } },
          databaseIds: [],
          lastModified: Date.now(),
        });

        set((state) => {
          state.rootPageIds = [welcomeId];
          state.pages = { [welcomeId]: welcomePage.meta };
          state.isLoaded = true;
        });
      }
      } catch (error) {
        console.error("Failed to load workspace:", error);
        set((state) => {
          state.isLoaded = true;
        });
      }
    },

    createPage: async (parentId, title = "无标题") => {
      try {
        const id = generateId();
        const now = Date.now();
        const meta: PageMeta = {
          id, title, icon: "📄", parentId, childIds: [],
          createdAt: now, updatedAt: now,
        };

        const pageData: PageData = { id, meta, blocks: [] };
        const storage = await getStorage();
        await storage.savePage(pageData);

        set((state) => {
          state.pages[id] = meta;
          if (parentId && state.pages[parentId]) {
            state.pages[parentId].childIds.push(id);
          } else {
            state.rootPageIds.push(id);
          }
        });

        await buildAndSaveWorkspace(get().pages, get().rootPageIds);
        return id;
      } catch (error) {
        console.error("Failed to create page:", error);
        throw error;
      }
    },

    deletePage: async (pageId) => {
      try {
        const page = get().pages[pageId];
        if (!page) return;

        // 递归删除子页面
        for (const childId of page.childIds) {
          await get().deletePage(childId);
        }

        const storage = await getStorage();
        await storage.deletePage(pageId);

        set((state) => {
          const pid = state.pages[pageId]?.parentId;
          if (pid && state.pages[pid]) {
            state.pages[pid].childIds = state.pages[pid].childIds.filter((id) => id !== pageId);
          } else {
            state.rootPageIds = state.rootPageIds.filter((id) => id !== pageId);
          }
          delete state.pages[pageId];
          if (state.currentPageId === pageId) {
            state.currentPageId = null;
            state.currentPageData = null;
          }
        });

        await buildAndSaveWorkspace(get().pages, get().rootPageIds);
      } catch (error) {
        console.error("Failed to delete page:", error);
        throw error;
      }
    },

    updatePageMeta: async (pageId, updates) => {
      try {
        set((state) => {
          if (state.pages[pageId]) {
            Object.assign(state.pages[pageId], updates, { updatedAt: Date.now() });
          }
          if (state.currentPageData?.id === pageId) {
            Object.assign(state.currentPageData.meta, updates, { updatedAt: Date.now() });
          }
        });

        const s = get();
        if (s.currentPageData?.id === pageId) {
          const storage = await getStorage();
          await storage.savePage(s.currentPageData);
        }
        await buildAndSaveWorkspace(s.pages, s.rootPageIds);
      } catch (error) {
        console.error("Failed to update page meta:", error);
        throw error;
      }
    },

    loadPage: async (pageId) => {
      try {
        const storage = await getStorage();
        const pageData = await storage.loadPage(pageId);
        if (pageData) {
          set((state) => {
            state.currentPageId = pageId;
            state.currentPageData = pageData;
          });
        }
      } catch (error) {
        console.error("Failed to load page:", error);
        throw error;
      }
    },

    updateBlocks: async (blocks) => {
      try {
        const s = get();
        if (!s.currentPageData) return;

        const updatedData: PageData = { ...s.currentPageData, blocks };
        const storage = await getStorage();
        await storage.savePage(updatedData);

        set((state) => {
          if (state.currentPageData) {
            state.currentPageData.blocks = blocks;
            state.currentPageData.meta.updatedAt = Date.now();
          }
        });
      } catch (error) {
        console.error("Failed to update blocks:", error);
        throw error;
      }
    },

    setCurrentPage: (pageId) => {
      set((state) => {
        state.currentPageId = pageId;
        if (!pageId) state.currentPageData = null;
      });
    },

    // ── #1 收藏 ──────────────────────────────────────
    toggleFavorite: async (pageId) => {
      try {
        const current = get().pages[pageId]?.isFavorite;
        await get().updatePageMeta(pageId, { isFavorite: !current });
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        throw error;
      }
    },

    // ── #11 置顶 ─────────────────────────────────────
    togglePin: async (pageId) => {
      try {
        const current = get().pages[pageId]?.isPinned;
        await get().updatePageMeta(pageId, { isPinned: !current });
      } catch (error) {
        console.error("Failed to toggle pin:", error);
        throw error;
      }
    },

    // ── #4 回收站 - 软删除（递归处理子页面） ───────────
    softDeletePage: async (pageId) => {
      try {
        const page = get().pages[pageId];
        if (!page) return;
        const now = Date.now();
        // 收集所有后代 ID（含自身）
        const allDescendantIds: string[] = [];
        const collectDescendants = (id: string) => {
          allDescendantIds.push(id);
          const p = get().pages[id];
          if (p) p.childIds.forEach(collectDescendants);
        };
        collectDescendants(pageId);

        set((state) => {
          const pid = state.pages[pageId]?.parentId;
          if (pid && state.pages[pid]) {
            state.pages[pid].childIds = state.pages[pid].childIds.filter((id) => id !== pageId);
          } else {
            state.rootPageIds = state.rootPageIds.filter((id) => id !== pageId);
          }
          // 递归标记 deletedAt
          for (const id of allDescendantIds) {
            if (state.pages[id]) {
              state.pages[id].deletedAt = now;
            }
          }
          if (allDescendantIds.includes(state.currentPageId!)) {
            state.currentPageId = null;
            state.currentPageData = null;
          }
        });
        await buildAndSaveWorkspace(get().pages, get().rootPageIds);
      } catch (error) {
        console.error("Failed to soft delete page:", error);
        throw error;
      }
    },

    // ── #4 回收站 - 恢复（递归恢复子页面） ────────────
    restorePage: async (pageId) => {
      try {
        const page = get().pages[pageId];
        if (!page || !page.deletedAt) return;
        // 收集所有后代 ID（含自身）
        const allDescendantIds: string[] = [];
        const collectDescendants = (id: string) => {
          allDescendantIds.push(id);
          const p = get().pages[id];
          if (p) p.childIds.forEach(collectDescendants);
        };
        collectDescendants(pageId);

        set((state) => {
          // 递归清除 deletedAt
          for (const id of allDescendantIds) {
            if (state.pages[id]) {
              delete state.pages[id].deletedAt;
            }
          }
          // 恢复到根级别
          if (!state.rootPageIds.includes(pageId)) {
            state.rootPageIds.push(pageId);
          }
        });
        await buildAndSaveWorkspace(get().pages, get().rootPageIds);
      } catch (error) {
        console.error("Failed to restore page:", error);
        throw error;
      }
    },

    // ── #4 回收站 - 永久删除 ─────────────────────────
    permanentDeletePage: async (pageId) => {
      await get().deletePage(pageId);
    },

    // ── #4 回收站 - 清空 ─────────────────────────────
    emptyTrash: async () => {
      const trashPages = get().getTrashPages();
      for (const p of trashPages) {
        await get().deletePage(p.id);
      }
    },

    // ── #4 回收站 - 获取回收站页面 ───────────────────
    getTrashPages: () => {
      return Object.values(get().pages)
        .filter((p) => !!p.deletedAt)
        .sort((a, b) => (b.deletedAt ?? 0) - (a.deletedAt ?? 0));
    },

    // ── #5 页面移动 ──────────────────────────────────
    movePage: async (pageId, newParentId) => {
      try {
        const page = get().pages[pageId];
        if (!page) return;
        // 防止移动到自身
        if (newParentId === pageId) return;
        // 防止移动到自身的后代节点下（避免循环引用）
        if (newParentId && isDescendant(pageId, newParentId, get().pages)) return;

        set((state) => {
          const oldPid = state.pages[pageId]?.parentId;
          // 从旧父级移除
          if (oldPid && state.pages[oldPid]) {
            state.pages[oldPid].childIds = state.pages[oldPid].childIds.filter((id) => id !== pageId);
          } else if (!oldPid) {
            state.rootPageIds = state.rootPageIds.filter((id) => id !== pageId);
          }
          // 添加到新父级
          if (newParentId && state.pages[newParentId]) {
            state.pages[newParentId].childIds.push(pageId);
            if (state.pages[pageId]) state.pages[pageId].parentId = newParentId;
          } else {
            state.rootPageIds.push(pageId);
            if (state.pages[pageId]) state.pages[pageId].parentId = null;
          }
        });
        await buildAndSaveWorkspace(get().pages, get().rootPageIds);
      } catch (error) {
        console.error("Failed to move page:", error);
        throw error;
      }
    },

    // ── #2 拖拽排序 ──────────────────────────────────
    reorderPages: async (parentId, fromIndex, toIndex) => {
      if (fromIndex === toIndex) return;
      set((state) => {
        if (parentId && state.pages[parentId]) {
          const arr = [...state.pages[parentId].childIds];
          const [moved] = arr.splice(fromIndex, 1);
          arr.splice(toIndex, 0, moved);
          state.pages[parentId].childIds = arr;
        } else {
          const arr = [...state.rootPageIds];
          const [moved] = arr.splice(fromIndex, 1);
          arr.splice(toIndex, 0, moved);
          state.rootPageIds = arr;
        }
      });
      await buildAndSaveWorkspace(get().pages, get().rootPageIds);
    },

    // ── #9 自定义页面图标 ────────────────────────────
    setPageIcon: async (pageId, icon) => {
      try {
        await get().updatePageMeta(pageId, { icon });
      } catch (error) {
        console.error("Failed to set page icon:", error);
        throw error;
      }
    },
  }))
);
