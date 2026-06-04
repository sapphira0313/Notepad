"use client";

import { useState, useMemo } from "react";
import { usePageStore } from "@/stores/usePageStore";
import { useUIStore } from "@/stores/useUIStore";
import { FolderOpen, FileText, Search, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MovePageDialog() {
  const { movePageDialogOpen, movePageTargetId, closeMovePageDialog } = useUIStore();
  const { pages, rootPageIds, movePage } = usePageStore();
  const [search, setSearch] = useState("");

  const candidates = useMemo(() => {
    if (!movePageTargetId) return [];
    const allPages = Object.values(pages).filter(
      (p) => !p.deletedAt && p.id !== movePageTargetId
    );
    if (!search.trim()) return allPages;
    const q = search.toLowerCase();
    return allPages.filter((p) => p.title.toLowerCase().includes(q));
  }, [pages, movePageTargetId, search]);

  if (!movePageDialogOpen || !movePageTargetId) return null;

  const sourcePage = pages[movePageTargetId];
  if (!sourcePage) return null;

  const handleMove = async (targetId: string | null) => {
    await movePage(movePageTargetId, targetId);
    closeMovePageDialog();
    setSearch("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in-0">
      <div className="w-full max-w-md bg-popover border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h3 className="text-base font-semibold font-[var(--font-heading)]">移动页面</h3>
          <button onClick={closeMovePageDialog} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source info */}
        <div className="px-5 py-3 bg-accent/30 border-b border-border/40">
          <p className="text-sm text-muted-foreground">
            移动 <span className="font-medium text-foreground">{sourcePage.icon} {sourcePage.title}</span> 到：
          </p>
        </div>

        {/* Search */}
        <div className="px-5 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索目标页面..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border/60 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Candidate list */}
        <div className="max-h-64 overflow-y-auto px-3 pb-3">
          {/* Root level option */}
          <button
            onClick={() => handleMove(null)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-accent/60 transition-colors"
          >
            <FolderOpen className="w-5 h-5 text-primary/70 shrink-0" />
            <span className="font-medium">根目录（顶层）</span>
            <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground/40" />
          </button>

          {candidates.map((page) => (
            <button
              key={page.id}
              onClick={() => handleMove(page.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-accent/60 transition-colors"
            >
              {page.childIds.length > 0 ? (
                <FolderOpen className="w-5 h-5 text-primary/70 shrink-0" />
              ) : (
                <FileText className="w-5 h-5 text-muted-foreground/70 shrink-0" />
              )}
              <span className="truncate">{page.icon} {page.title}</span>
              <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground/40 shrink-0" />
            </button>
          ))}

          {candidates.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-6">未找到匹配的页面</p>
          )}
        </div>
      </div>
    </div>
  );
}
