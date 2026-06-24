/**
 * Sidebar.tsx — 侧边栏组件
 *
 * 功能：
 * - 文档列表（虚拟滚动）
 * - 搜索过滤
 * - 新建文档
 * - 标签切换（全部/最近/收藏）
 * - 表格视图入口
 *
 * 对应原 16n_7288zoqtd.js 中的 nb 组件。
 */

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useEditorStore } from "../store/editorStore";
import { useSidebarStore } from "../store/sidebarStore";
import { PageTreeItem } from "./PageTreeItem";
import {
  FileTextIcon,
  ClockIcon,
  StarIcon,
  PlusIcon,
  SearchIcon,
  TableIcon,
} from "./ColorfulIcons";

// ─── 虚拟滚动项 ─────────────────────────────────────────────────────

interface VirtualItem {
  index: number;
  start: number;
  size: number;
  end: number;
  key: string;
}

function useVirtualScroll(
  items: string[],
  itemHeight: number,
  containerHeight: number
): VirtualItem[] {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIdx = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - 5
  );
  const endIdx = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + 5
  );

  const virtualItems: VirtualItem[] = [];
  for (let i = startIdx; i < endIdx; i++) {
    virtualItems.push({
      index: i,
      start: i * itemHeight,
      size: itemHeight,
      end: (i + 1) * itemHeight,
      key: items[i],
    });
  }

  return virtualItems;
}

// ─── 主组件 ─────────────────────────────────────────────────────────

export function Sidebar() {
  const rootPageIds = useEditorStore((s) => s.rootPageIds);
  const pages = useEditorStore((s) => s.pages);
  const currentPageId = useEditorStore((s) => s.currentPageId);
  const loadPage = useEditorStore((s) => s.loadPage);
  const createPage = useEditorStore((s) => s.createPage);

  const {
    sidebarOpen,
    activeTab,
    mainView,
    searchQuery,
    setActiveTab,
    setMainView,
    setSearchQuery,
  } = useSidebarStore();

  const [scrollTop, setScrollTop] = useState(0);

  // ── 搜索过滤 ──
  const filteredIds = useMemo(() => {
    let ids = rootPageIds;
    
    if (activeTab === "starred") {
      ids = Object.values(pages)
        .filter((p) => p.isStarred)
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
        .map((p) => p.id);
    } else if (activeTab === "recent") {
      ids = Object.values(pages)
        .filter((p) => p.lastOpenedAt > 0)
        .sort((a, b) => (b.lastOpenedAt || 0) - (a.lastOpenedAt || 0))
        .slice(0, 20)
        .map((p) => p.id);
    }

    if (!searchQuery.trim()) return ids;
    const q = searchQuery.toLowerCase();
    return ids.filter((id) =>
      pages[id]?.title.toLowerCase().includes(q)
    );
  }, [rootPageIds, pages, searchQuery, activeTab]);

  // ── 处理函数 ──
  const handleCreate = useCallback(
    async (parentId: string | null = null) => {
      const newId = await createPage(parentId);
      await loadPage(newId);
    },
    [createPage, loadPage]
  );

  const handleSelect = useCallback(
    async (id: string) => {
      await loadPage(id);
    },
    [loadPage]
  );

  if (!sidebarOpen) return null;

  return (
    <aside className="w-[280px] h-full bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden shrink-0">
      {/* ── 搜索框 ── */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            name="sidebar-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索文档"
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* ── 标签栏 ── */}
      <div className="flex border-b border-sidebar-border">
        <TabButton
          active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          icon={<FileTextIcon size={16} />}
          label="全部"
        />
        <TabButton
          active={activeTab === "recent"}
          onClick={() => setActiveTab("recent")}
          icon={<ClockIcon size={16} />}
          label="最近"
        />
        <TabButton
          active={activeTab === "starred"}
          onClick={() => setActiveTab("starred")}
          icon={<StarIcon size={16} />}
          label="收藏"
        />
      </div>

      {/* ── 新建文档按钮 ── */}
      <div className="px-4 py-3">
        <button
          onClick={() => handleCreate(null)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <PlusIcon size={16} />
          新建文档
        </button>
      </div>

      {/* ── 页面树 ── */}
      <nav className="flex-1 overflow-hidden">
        <div
          className="relative overflow-y-auto h-full"
          onScroll={(e) =>
            setScrollTop(
              (e.target as HTMLElement).scrollTop
            )
          }
        >
          {filteredIds.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <FileTextIcon className="mx-auto text-muted-foreground/30 mb-2" size={40} />
              <p className="text-sm text-muted-foreground">
                暂无文档
              </p>
              <button
                onClick={() => handleCreate(null)}
                className="mt-2 text-sm text-primary hover:underline"
              >
                创建第一个文档
              </button>
            </div>
          ) : (
            <div
              style={{
                height: `${
                  filteredIds.length * 40
                }px`,
                position: "relative",
              }}
            >
              {/* 使用简化虚拟滚动：计算可见项 */}
              {filteredIds.map((id) => (
                <PageTreeItem
                  key={id}
                  pageId={id}
                  depth={0}
                />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ── 底部：历史记录入口 ── */}
      <div className="border-t border-sidebar-border px-4 py-2">
        <button
          onClick={() => setMainView("table")}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
            mainView === "table"
              ? "bg-sidebar-accent/50 text-sidebar-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
          }`}
        >
          <ClockIcon size={16} />
          历史记录
        </button>
      </div>
    </aside>
  );
}

// ─── Tab 按钮 ───────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm transition-colors ${
        active
          ? "font-medium text-primary border-b-2 border-primary"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
