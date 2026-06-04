"use client";

import { useState, useRef, useEffect } from "react";
import { useUIStore } from "@/stores/useUIStore";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ExportMenu } from "@/components/common/ExportMenu";
import { Menu, Search, Share2, MoreVertical, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close "more" menu on outside click
  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  return (
    <header className="h-14 border-b border-border/60 flex items-center px-3 sm:px-4 shrink-0 bg-background/95 backdrop-blur-md sticky top-0 z-30 shadow-sm shadow-black/2">
      {/* Left: toggle + logo */}
      <div className="flex items-center gap-2 sm:gap-3 mr-3 sm:mr-6">
        <button
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "收起侧边栏" : "展开侧边栏"}
          className="p-2 rounded-lg hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md shadow-primary/30 transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/40">
            <span className="text-white font-bold text-sm font-[var(--font-heading)]">云</span>
          </div>
          <span className="font-semibold text-lg text-foreground tracking-tight hidden sm:inline font-[var(--font-heading)]">云文档</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <Breadcrumb />
      </div>

      {/* Actions - primary always visible, secondary in overflow */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Primary: Search (always visible) */}
        <button
          onClick={() => useUIStore.getState().openSearch()}
          aria-label="搜索文档 (Ctrl+K)"
          className={cn(
            "flex items-center gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-sm transition-all duration-200",
            "bg-accent/60 hover:bg-accent text-muted-foreground hover:text-foreground",
            "hover:shadow-md hover:shadow-black/8 focus:outline-none focus:ring-2 focus:ring-primary/30"
          )}
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">搜索</span>
        </button>

        {/* Theme toggle (always visible) */}
        <ThemeToggle />

        {/* Secondary actions - overflow menu on small screens */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            aria-label="分享"
            className="p-2.5 rounded-xl hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-all duration-200 hover:shadow-md hover:shadow-black/8"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
          </button>
          <ExportMenu />
        </div>

        {/* More menu - consolidates secondary actions on mobile */}
        <div className="relative sm:hidden" ref={moreRef}>
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            aria-label="更多操作"
            aria-expanded={moreOpen}
            className="p-2.5 rounded-xl hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <MoreVertical className="w-4 h-4" aria-hidden="true" />
          </button>
          {moreOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-popover border border-border rounded-lg shadow-lg py-1 animate-scale-in">
              <button
                onClick={() => { setMoreOpen(false); }}
                aria-label="分享"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <Share2 className="w-4 h-4" /> 分享
              </button>
              <button
                onClick={() => { setMoreOpen(false); }}
                aria-label="导入导出"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <Download className="w-4 h-4" /> 导入/导出
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
