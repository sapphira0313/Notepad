/**
 * Breadcrumb.tsx — 面包屑导航组件
 *
 * 显示当前页面的路径层级，点击任意层级可以导航到对应页面。
 * 对应原 16n_7288zoqtd.js 中的 nj 组件。
 */

"use client";

import React from "react";
import { useEditorStore, type PageMeta } from "../store/editorStore";
import { ChevronRight } from "lucide-react";

export function Breadcrumb() {
  const currentPageId = useEditorStore((s) => s.currentPageId);
  const pages = useEditorStore((s) => s.pages);
  const loadPage = useEditorStore((s) => s.loadPage);

  if (!currentPageId) return null;

  // 从当前页面向上溯源，构建路径数组
  const path: PageMeta[] = [];
  let cursor: string | null = currentPageId;
  while (cursor) {
    const page: PageMeta | undefined = pages[cursor];
    if (!page) break;
    path.unshift(page);
    cursor = page.parentId;
  }

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground flex-1 min-w-0 overflow-hidden">
      {path.map((page, idx) => (
        <span
          key={page.id}
          className="flex items-center gap-1 shrink-0"
        >
          {idx > 0 && (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          )}
          <button
            onClick={() => loadPage(page.id)}
            className="flex items-center gap-1 hover:text-foreground transition-colors truncate max-w-[150px]"
          >
            <span className="shrink-0">{page.icon || "📄"}</span>
            <span
              className={
                idx === path.length - 1
                  ? "font-medium text-foreground truncate"
                  : "truncate"
              }
            >
              {page.title}
            </span>
          </button>
        </span>
      ))}
    </div>
  );
}
