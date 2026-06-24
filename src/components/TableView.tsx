"use client";

import React from "react";
import { useEditorStore } from "../store/editorStore";
import { useSidebarStore } from "../store/sidebarStore";
import { PlusIcon, FileTextIcon, ClockIcon, StarIcon } from "./ColorfulIcons";

export function TableView() {
  const pages = useEditorStore((s) => s.pages);
  const createPage = useEditorStore((s) => s.createPage);
  const loadPage = useEditorStore((s) => s.loadPage);
  const setMainView = useSidebarStore((s) => s.setMainView);

  const pageList = Object.values(pages).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "今天";
    if (days === 1) return "昨天";
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString("zh-CN");
  };

  return (
    <div className="flex flex-col flex-1">
      {/* 标题栏 */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">历史记录</h1>
            <p className="text-sm text-muted-foreground mt-1">
              共 {pageList.length} 个文档
            </p>
          </div>
          <button
            onClick={() => setMainView("editor")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <FileTextIcon size={16} />
            返回编辑器
          </button>
        </div>
      </div>

      {/* 表格内容 */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  图标
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  更新时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <FileTextIcon className="mx-auto text-muted-foreground/30 mb-2" size={48} />
                    <p className="text-muted-foreground">暂无文档</p>
                    <button
                      onClick={() => createPage(null)}
                      className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <PlusIcon className="inline mr-1" size={16} />
                      创建第一个文档
                    </button>
                  </td>
                </tr>
              ) : (
                pageList.map((page) => (
                  <tr
                    key={page.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      loadPage(page.id);
                      setMainView("editor");
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">
                        {page.icon || "📄"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        {page.title || "无标题"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(page.updatedAt || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadPage(page.id);
                          setMainView("editor");
                        }}
                        className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-md hover:bg-primary/20 transition-colors"
                      >
                        打开
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
