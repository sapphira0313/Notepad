"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { usePageStore } from "@/stores/usePageStore";
import { useUIStore } from "@/stores/useUIStore";
import {
  Plus, ChevronRight, ChevronDown, Trash2, Edit3, Star,
  Table, FileText, Search, Clock, FolderOpen, GripVertical,
  Pin, ArrowRightLeft, RotateCcw, Delete,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContextMenu, type ContextMenuAction } from "@/components/common/ContextMenu";
import { VirtualScroll } from "../VirtualScroll";

type SidebarTab = "all" | "recent" | "favorite" | "trash";

const TABS: { key: SidebarTab; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "全部", icon: <FileText className="w-4 h-4" /> },
  { key: "recent", label: "最近", icon: <Clock className="w-4 h-4" /> },
  { key: "favorite", label: "收藏", icon: <Star className="w-4 h-4" /> },
  { key: "trash", label: "回收站", icon: <Trash2 className="w-4 h-4" /> },
];

export function Sidebar() {
  const { rootPageIds, pages, currentPageId, loadPage, createPage, softDeletePage, restorePage, permanentDeletePage, emptyTrash, getTrashPages } = usePageStore();
  const { sidebarOpen, sidebarWidth, sidebarTab, setSidebarTab, activeView } = useUIStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; pageId: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleCreatePage = useCallback(async (parentId: string | null) => {
    const id = await createPage(parentId);
    await loadPage(id);
  }, [createPage, loadPage]);

  const handleSelectPage = useCallback(async (pageId: string) => {
    await loadPage(pageId);
    useUIStore.getState().setActiveView("page");
  }, [loadPage]);

  const handleSoftDelete = useCallback(async (pageId: string) => {
    await softDeletePage(pageId);
  }, [softDeletePage]);

  const handleContextMenu = useCallback((e: React.MouseEvent, pageId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, pageId });
  }, []);

  const getContextMenuActions = useCallback((pageId: string): ContextMenuAction[] => {
    const page = pages[pageId];
    const isFav = page?.isFavorite;
    const isPinned = page?.isPinned;
    return [
      {
        label: "新建子页面",
        icon: <Plus className="w-4 h-4" />,
        onClick: () => handleCreatePage(pageId),
      },
      {
        label: isFav ? "取消收藏" : "添加收藏",
        icon: <Star className={cn("w-4 h-4", isFav && "fill-amber-500 text-amber-500")} />,
        onClick: () => usePageStore.getState().toggleFavorite(pageId),
      },
      {
        label: isPinned ? "取消置顶" : "置顶页面",
        icon: <Pin className={cn("w-4 h-4", isPinned && "text-primary")} />,
        onClick: () => usePageStore.getState().togglePin(pageId),
      },
      {
        label: "移动到...",
        icon: <ArrowRightLeft className="w-4 h-4" />,
        onClick: () => useUIStore.getState().openMovePageDialog(pageId),
      },
      {
        label: "重命名",
        icon: <Edit3 className="w-4 h-4" />,
        onClick: () => {
          const title = prompt("输入新标题：", pages[pageId]?.title || "");
          if (title) usePageStore.getState().updatePageMeta(pageId, { title });
        },
      },
      { label: "", icon: null, onClick: () => {}, divider: true },
      {
        label: "移至回收站",
        icon: <Trash2 className="w-4 h-4" />,
        onClick: () => handleSoftDelete(pageId),
        danger: true,
      },
    ];
  }, [handleCreatePage, handleSoftDelete, pages]);

  // Pinned pages
  const pinnedPageIds = useMemo(() => {
    return rootPageIds.filter((id) => pages[id]?.isPinned && !pages[id]?.deletedAt);
  }, [rootPageIds, pages]);

  // Tab-based filtering (exclude trash and pinned from normal lists)
  const filteredPageIds = useMemo(() => {
    if (sidebarTab === "trash") return []; // trash uses separate render
    // 收集所有非回收站页面 ID（包含嵌套子页面）
    const allIds = Object.keys(pages).filter((id) => !pages[id]?.deletedAt);
    let ids: string[];
    if (sidebarTab === "favorite") {
      ids = allIds.filter((id) => pages[id]?.isFavorite);
    } else if (sidebarTab === "recent") {
      ids = [...allIds].sort((a, b) => (pages[b]?.updatedAt ?? 0) - (pages[a]?.updatedAt ?? 0));
    } else {
      ids = rootPageIds.filter((id) => !pages[id]?.deletedAt);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      ids = ids.filter((id) => pages[id]?.title.toLowerCase().includes(q));
    }
    return ids;
  }, [rootPageIds, pages, sidebarTab, searchQuery]);

  // Trash pages
  const trashPages = useMemo(() => getTrashPages(), [getTrashPages]);

  // Drag-and-drop reorder handlers
  const handleDragStart = useCallback((e: React.DragEvent, pageId: string) => {
    e.dataTransfer.setData("text/plain", pageId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, overId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(overId);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    
    // 验证拖拽数据有效性
    if (!draggedId) {
      setDragOverId(null);
      return;
    }
    
    // 不能拖放到自身
    if (draggedId === targetId) {
      setDragOverId(null);
      return;
    }
    
    // 验证目标页面存在
    const targetPage = pages[targetId];
    if (!targetPage) {
      setDragOverId(null);
      return;
    }
    
    // 验证被拖拽页面存在
    const draggedPage = pages[draggedId];
    if (!draggedPage) {
      setDragOverId(null);
      return;
    }
    
    // 获取父级页面 ID 和同级页面列表
    const parentId = targetPage.parentId ?? null;
    const siblings = parentId ? pages[parentId]?.childIds ?? [] : rootPageIds;
    
    // 验证被拖拽页面确实在同级列表中
    const fromIndex = siblings.indexOf(draggedId);
    const toIndex = siblings.indexOf(targetId);
    
    // 验证索引有效性
    if (fromIndex < 0 || toIndex < 0) {
      setDragOverId(null);
      return;
    }
    
    // 防止无效排序（相同位置）
    if (fromIndex === toIndex) {
      setDragOverId(null);
      return;
    }
    
    await usePageStore.getState().reorderPages(parentId, fromIndex, toIndex);
    setDragOverId(null);
  }, [pages, rootPageIds]);

  // Drag resize
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = { startX: e.clientX, startWidth: sidebarWidth };
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const delta = ev.clientX - resizeRef.current.startX;
      useUIStore.getState().setSidebarWidth(resizeRef.current.startWidth + delta);
    };
    const onUp = () => {
      resizeRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [sidebarWidth]);

  // Close sidebar on mobile when page selected
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;
    if (currentPageId) useUIStore.getState().setSidebarOpen(false);
  }, [currentPageId]);

  if (!sidebarOpen) return null;

  return (
    <aside
      className="h-full bg-sidebar/95 backdrop-blur-md border-r border-sidebar-border/80 flex flex-col overflow-hidden shrink-0 shadow-sm shadow-black/4 relative md:relative max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50"
      style={{ width: sidebarWidth }}
      role="navigation"
      aria-label="文档导航侧栏"
    >
      {/* Search Box */}
      <div className="px-4 py-3.5 border-b border-sidebar-border/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索文档"
            aria-label="搜索文档"
            className="w-full pl-10 pr-4 py-2.5 bg-background/80 border border-border/60 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sidebar-border/60 px-2" role="tablist" aria-label="文档筛选">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={sidebarTab === tab.key}
            aria-label={tab.label}
            onClick={() => setSidebarTab(tab.key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium rounded-t-lg transition-all duration-200",
              sidebarTab === tab.key
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
            )}
          >
            {tab.icon}
            <span className="hidden min-[280px]:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* New Button (hidden in trash view) */}
      {sidebarTab !== "trash" && (
        <div className="px-4 py-3.5">
          <button
            onClick={() => handleCreatePage(null)}
            aria-label="新建文档"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-medium text-sm shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            新建文档
          </button>
        </div>
      )}

      {/* Page List */}
      <nav className="flex-1 overflow-hidden" aria-label="页面列表">
        {sidebarTab === "trash" ? (
          /* ── Trash View ── */
          <div className="h-full flex flex-col">
            {trashPages.length > 0 && (
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{trashPages.length} 个已删除页面</span>
                <button
                  onClick={() => { if (confirm("确定清空回收站？此操作不可撤销。")) emptyTrash(); }}
                  className="text-xs text-destructive/70 hover:text-destructive flex items-center gap-1 transition-colors"
                >
                  <Delete className="w-3 h-3" /> 清空
                </button>
              </div>
            )}
            {trashPages.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="w-14 h-14 mx-auto bg-accent/50 rounded-2xl flex items-center justify-center mb-3">
                  <Trash2 className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">回收站为空</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {trashPages.map((page) => (
                  <div
                    key={page.id}
                    className="group flex items-center gap-2.5 py-2 px-4 mx-2 rounded-xl text-sm hover:bg-accent/40 transition-all"
                  >
                    <span className="text-base shrink-0">{page.icon || "📄"}</span>
                    <span className="truncate flex-1 text-foreground/70">{page.title}</span>
                    <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => restorePage(page.id)}
                        className="p-1.5 rounded-lg hover:bg-green-500/10 text-green-600 transition-colors"
                        title="恢复"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { if (confirm("永久删除？此操作不可撤销。")) permanentDeletePage(page.id); }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        title="永久删除"
                      >
                        <Delete className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : filteredPageIds.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="w-14 h-14 mx-auto bg-accent/50 rounded-2xl flex items-center justify-center mb-3">
              <FileText className="w-7 h-7 text-muted-foreground/40" aria-hidden="true" />
            </div>
            <p className="text-sm text-muted-foreground">
              {sidebarTab === "favorite" ? "暂无收藏文档" : "暂无文档"}
            </p>
            {sidebarTab !== "favorite" && (
              <button
                onClick={() => handleCreatePage(null)}
                className="mt-3 px-4 py-1.5 text-sm text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all duration-200"
              >
                创建第一个文档
              </button>
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            {/* Pinned Section */}
            {pinnedPageIds.length > 0 && sidebarTab === "all" && !searchQuery.trim() && (
              <div className="mb-1">
                <div className="px-5 py-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-1">
                    <Pin className="w-3 h-3" /> 置顶
                  </span>
                </div>
                {pinnedPageIds.map((pageId) => (
                  <SidebarItem
                    key={`pin-${pageId}`}
                    pageId={pageId}
                    depth={0}
                    currentPageId={currentPageId}
                    pages={pages}
                    onSelect={handleSelectPage}
                    onContextMenu={handleContextMenu}
                    onCreateChild={handleCreatePage}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    isDragging={dragOverId === pageId}
                  />
                ))}
                <div className="mx-4 my-2 h-px bg-border/40" />
              </div>
            )}

            {/* Normal Page List */}
            {filteredPageIds
              .filter((id) => !(sidebarTab === "all" && !searchQuery.trim() && pages[id]?.isPinned))
              .map((pageId) => (
              <SidebarItem
                key={pageId}
                pageId={pageId}
                depth={0}
                currentPageId={currentPageId}
                pages={pages}
                onSelect={handleSelectPage}
                onContextMenu={handleContextMenu}
                onCreateChild={handleCreatePage}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={dragOverId === pageId}
              />
            ))}
          </div>
        )}
      </nav>

      {/* Database Section */}
      <div className="border-t border-sidebar-border/60 px-4 py-3">
        <button
          onClick={() => useUIStore.getState().setActiveView("database")}
          aria-label="打开表格视图"
          className={cn(
            "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl transition-all duration-200",
            activeView === "database"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-foreground"
          )}
        >
          <Table className="w-4 h-4" aria-hidden="true" />
          表格
        </button>
      </div>

      {/* Drag resize handle */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-primary/30 active:bg-primary/50 transition-colors z-10 hidden md:block max-md:hidden"
        aria-hidden="true"
      >
        <GripVertical className="w-3 h-3 text-muted-foreground/0 group-hover:text-muted-foreground absolute top-1/2 -translate-y-1/2 -left-0.5" />
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          actions={getContextMenuActions(contextMenu.pageId)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </aside>
  );
}

interface SidebarItemProps {
  pageId: string;
  depth: number;
  currentPageId: string | null;
  pages: Record<string, { title: string; icon?: string; childIds: string[]; isFavorite?: boolean; isPinned?: boolean; updatedAt?: number; deletedAt?: number }>;
  onSelect: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  onCreateChild: (parentId: string) => Promise<void>;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  isDragging?: boolean;
}

function SidebarItem({ pageId, depth, currentPageId, pages, onSelect, onContextMenu, onCreateChild, onDragStart, onDragOver, onDrop, isDragging }: SidebarItemProps) {
  const page = pages[pageId];
  const [expanded, setExpanded] = useState(depth < 1);

  if (!page) return null;

  const isActive = currentPageId === pageId;
  const hasChildren = page.childIds.length > 0;

  return (
    <div className="transition-all duration-200">
      <div
        draggable
        onDragStart={(e) => onDragStart(e, pageId)}
        onDragOver={(e) => onDragOver(e, pageId)}
        onDrop={(e) => onDrop(e, pageId)}
        onClick={() => onSelect(pageId)}
        onContextMenu={(e) => onContextMenu(e, pageId)}
        role="treeitem"
        aria-selected={isActive}
        aria-expanded={hasChildren ? expanded : undefined}
        aria-label={page.title}
        className={cn(
          "group flex items-center gap-2.5 py-2.5 px-3 mx-2 rounded-xl cursor-pointer transition-all duration-200 select-none",
          isActive
            ? "bg-primary/12 text-primary shadow-sm shadow-primary/10"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-foreground",
          "hover:shadow-md hover:shadow-black/6",
          isDragging && "ring-2 ring-primary/40 bg-primary/8"
        )}
        style={{ paddingLeft: `${depth * 14 + 12}px` }}
      >
        {/* Expand/Collapse */}
        {hasChildren && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            aria-label={expanded ? "折叠子页面" : "展开子页面"}
            className="p-1 rounded-lg hover:bg-sidebar-accent/80 shrink-0 transition-all duration-200 hover:scale-110"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        {!hasChildren && <span className="w-5" aria-hidden="true" />}

        {/* Icon - show emoji or fallback SVG */}
        <div className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 text-base",
          hasChildren ? "bg-primary/15" : "bg-secondary/80",
          isActive ? "ring-1 ring-primary/30" : ""
        )}>
          {page.icon ? (
            <span className="text-sm leading-none">{page.icon}</span>
          ) : hasChildren ? (
            <FolderOpen className="w-4 h-4 text-primary" aria-hidden="true" />
          ) : (
            <FileText className="w-4 h-4 text-muted-foreground/70" aria-hidden="true" />
          )}
        </div>

        {/* Title */}
        <span className="text-sm font-medium truncate flex-1">{page.title}</span>

        {/* Indicators */}
        <div className="flex items-center gap-1 shrink-0">
          {page.isPinned && (
            <Pin className="w-3 h-3 text-primary/60" aria-label="已置顶" />
          )}
          {page.isFavorite && (
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" aria-label="已收藏" />
          )}
        </div>

        {/* Quick add button on hover */}
        <button
          onClick={(e) => { e.stopPropagation(); onCreateChild(pageId); }}
          aria-label="新建子页面"
          className="hidden group-hover:flex p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary shrink-0 transition-all duration-200 hover:scale-110"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="overflow-hidden" role="group">
          <div className="transition-all duration-300 ease-out">
            {page.childIds.filter((childId) => !pages[childId]?.deletedAt).map((childId, index) => (
              <SidebarItem
                key={childId}
                pageId={childId}
                depth={depth + 1}
                currentPageId={currentPageId}
                pages={pages}
                onSelect={onSelect}
                onContextMenu={onContextMenu}
                onCreateChild={onCreateChild}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                isDragging={isDragging}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
