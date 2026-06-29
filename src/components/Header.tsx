/**
 * Header.tsx — 顶部导航栏
 *
 * 包含侧边栏切换、面包屑导航、搜索、分享、导入/导出、主题切换、更多菜单。
 * 对应原 index.html 中的 header 结构和 16n_7288zoqtd.js 中的 nk/nj 组件。
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useEditorStore } from "../store/editorStore";
import { useSidebarStore } from "../store/sidebarStore";
import { ThemeToggle } from "./ThemeToggle";
import { Breadcrumb } from "./Breadcrumb";
import { SettingsModal } from "./SettingsModal";
import {
  PanelLeftIcon,
  PanelLeftCloseIcon,
  ShareIcon,
  DownloadIcon,
  UploadIcon,
  MoreVerticalIcon,
  FileTextIcon,
  CodeIcon,
  PlusIcon,
  ClockIcon,
} from "./ColorfulIcons";

// ─── Block → Markdown 转换（简化版，保持与原 nC 函数一致） ──────

function blockToMarkdown(block: {
  type: string;
  props?: Record<string, unknown>;
}): string {
  const text = (block.props?.textContent as string) || "";
  switch (block.type) {
    case "heading": {
      const level = (block.props?.level as number) || 1;
      return "#".repeat(level) + " " + text;
    }
    case "paragraph":
    default:
      return text;
    case "quote":
      return "> " + text;
    case "bulletList":
    case "bulletListItem":
      return "- " + text;
    case "numberedList":
    case "numberedListItem":
      return "1. " + text;
    case "checkListItem": {
      const checked = block.props?.checked ? "x" : " ";
      return `- [${checked}] ${text}`;
    }
    case "codeBlock":
      return (
        "```" +
        ((block.props?.language as string) || "") +
        "\n" +
        text +
        "\n```"
      );
    case "divider":
      return "---";
    case "image": {
      const url = (block.props?.url as string) || "";
      const caption =
        (block.props?.caption as string) || "";
      return `![${caption}](${url})`;
    }
    case "bookmark": {
      const url = (block.props?.url as string) || "";
      return `[${text || url}](${url})`;
    }
    case "math": {
      const formula =
        (block.props?.formula as string) || "";
      return `$${formula}$`;
    }
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c] || c);
}

function blocksToHtml(
  blocks: { type: string; props?: Record<string, unknown> }[]
): string {
  let html = "";
  for (const block of blocks) {
    const text = (block.props?.textContent as string) || "";
    switch (block.type) {
      case "heading": {
        const level = (block.props?.level as number) || 1;
        html += `<h${level}>${escapeHtml(text)}</h${level}>\n`;
        break;
      }
      case "paragraph":
        html += `<p>${escapeHtml(text)}</p>\n`;
        break;
      case "quote":
        html += `<blockquote>${escapeHtml(text)}</blockquote>\n`;
        break;
      case "bulletList":
      case "bulletListItem":
        html += `<ul><li>${escapeHtml(text)}</li></ul>\n`;
        break;
      case "numberedList":
      case "numberedListItem":
        html += `<ol><li>${escapeHtml(text)}</li></ol>\n`;
        break;
      case "divider":
        html += "<hr>\n";
        break;
      case "codeBlock":
        html += `<pre><code>${
          escapeHtml(text) || "\n"
        }</code></pre>\n`;
        break;
      case "image": {
        const url =
          (block.props?.url as string) || "";
        const caption =
          (block.props?.caption as string) || "";
        html += `<figure><img src="${escapeHtml(url)}" alt="${escapeHtml(caption)}">${
          caption
            ? `<figcaption>${escapeHtml(caption)}</figcaption>`
            : ""
        }</figure>\n`;
        break;
      }
    }
  }
  return html;
}

// ─── 文件下载辅助 ───────────────────────────────────────────────────

function downloadFile(
  filename: string,
  content: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Header 组件 ────────────────────────────────────────────────────

export function Header() {
  const { toggleSidebar, sidebarOpen } = useSidebarStore();
  const currentPageData = useEditorStore(
    (s) => s.currentPageData
  );
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const createPage = useEditorStore((s) => s.createPage);
  const loadPage = useEditorStore((s) => s.loadPage);

  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCreateNewPage = useCallback(async () => {
    const newId = await createPage(null);
    await loadPage(newId);
    setShowMoreMenu(false);
  }, [createPage, loadPage]);

  // ── 导入处理 ──
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
    setShowImport(false);
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const fileName = file.name.replace(/\.[^/.]+$/, "");

        let blocks: any[] = [];

        if (file.name.endsWith(".md") || file.name.endsWith(".markdown")) {
          const lines = content.split("\n");
          let currentType = "paragraph";
          let currentText = "";

          for (const line of lines) {
            if (line.startsWith("# ")) {
              blocks.push({
                type: "heading",
                props: { level: 1, textContent: line.slice(2) },
                content: [],
                children: [],
              });
            } else if (line.startsWith("## ")) {
              blocks.push({
                type: "heading",
                props: { level: 2, textContent: line.slice(3) },
                content: [],
                children: [],
              });
            } else if (line.startsWith("### ")) {
              blocks.push({
                type: "heading",
                props: { level: 3, textContent: line.slice(4) },
                content: [],
                children: [],
              });
            } else if (line.startsWith("> ")) {
              blocks.push({
                type: "quote",
                props: { textContent: line.slice(2) },
                content: [],
                children: [],
              });
            } else if (line.startsWith("- [ ] ")) {
              blocks.push({
                type: "checkListItem",
                props: { checked: false, textContent: line.slice(6) },
                content: [],
                children: [],
              });
            } else if (line.startsWith("- [x] ") || line.startsWith("- [X] ")) {
              blocks.push({
                type: "checkListItem",
                props: { checked: true, textContent: line.slice(6) },
                content: [],
                children: [],
              });
            } else if (line.startsWith("- ") || line.startsWith("* ")) {
              blocks.push({
                type: "bulletList",
                props: { textContent: line.slice(2) },
                content: [],
                children: [],
              });
            } else if (/^\d+\.\s/.test(line)) {
              blocks.push({
                type: "numberedList",
                props: { textContent: line.replace(/^\d+\.\s/, "") },
                content: [],
                children: [],
              });
            } else if (line.startsWith("```")) {
              if (currentType === "codeBlock") {
                blocks.push({
                  type: "codeBlock",
                  props: { language: "", textContent: currentText.trim() },
                  content: [],
                  children: [],
                });
                currentType = "paragraph";
                currentText = "";
              } else {
                currentType = "codeBlock";
                currentText = "";
              }
            } else if (line === "---") {
              blocks.push({
                type: "paragraph",
                props: { textContent: "――――――――――――――――" },
                content: [],
                children: [],
              });
            } else if (currentType === "codeBlock") {
              currentText += line + "\n";
            } else if (line.trim() === "") {
              if (currentText) {
                blocks.push({
                  type: "paragraph",
                  props: { textContent: currentText },
                  content: [],
                  children: [],
                });
                currentText = "";
              }
            } else {
              currentText += (currentText ? "\n" : "") + line;
            }
          }

          if (currentText) {
            blocks.push({
              type: "paragraph",
              props: { textContent: currentText },
              content: [],
              children: [],
            });
          }
        } else if (file.name.endsWith(".html") || file.name.endsWith(".htm")) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, "text/html");
          const body = doc.body;

          const elements = body.querySelectorAll("h1, h2, h3, p, blockquote, hr, pre, ul, ol");
          elements.forEach((el) => {
            const text = el.textContent || "";
            switch (el.tagName.toLowerCase()) {
              case "h1":
                blocks.push({ type: "heading", props: { level: 1, textContent: text }, content: [], children: [] });
                break;
              case "h2":
                blocks.push({ type: "heading", props: { level: 2, textContent: text }, content: [], children: [] });
                break;
              case "h3":
                blocks.push({ type: "heading", props: { level: 3, textContent: text }, content: [], children: [] });
                break;
              case "blockquote":
                blocks.push({ type: "quote", props: { textContent: text }, content: [], children: [] });
                break;
              case "hr":
                blocks.push({ type: "divider", props: {}, content: [], children: [] });
                break;
              case "pre":
                blocks.push({ type: "codeBlock", props: { language: "", textContent: text }, content: [], children: [] });
                break;
              case "p":
                blocks.push({ type: "paragraph", props: { textContent: text }, content: [], children: [] });
                break;
              case "ul":
                Array.from(el.children).forEach((li) => {
                  blocks.push({
                    type: "bulletListItem",
                    props: { textContent: li.textContent || "" },
                    content: [],
                    children: [],
                  });
                });
                break;
              case "ol":
                Array.from(el.children).forEach((li) => {
                  blocks.push({
                    type: "numberedListItem",
                    props: { textContent: li.textContent || "" },
                    content: [],
                    children: [],
                  });
                });
                break;
            }
          });
        }

        if (blocks.length > 0) {
          const newPageId = await createPage(null, fileName);
          await loadPage(newPageId);
          const state = useEditorStore.getState();
          if (state.currentPageData) {
            await state.updateBlocks(blocks);
          }
        }

        event.target.value = "";
      };
      reader.readAsText(file);
    },
    [createPage, loadPage]
  );

  // ── 导出处理 ──
  const handleExportMarkdown = useCallback(() => {
    if (!currentPageData) return;
    const md = currentPageData.blocks
      .map(blockToMarkdown)
      .join("\n\n");
    downloadFile(
      `${currentPageData.meta.title}.md`,
      md,
      "text/markdown"
    );
    setShowExport(false);
  }, [currentPageData]);

  const handleExportHtml = useCallback(() => {
    if (!currentPageData) return;
    const body = blocksToHtml(currentPageData.blocks);
    const title = escapeHtml(
      currentPageData.meta.title
    );
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #1a1a1a; }
    h1 { font-size: 2.2em; margin-bottom: 0.5em; }
    blockquote { border-left: 3px solid #ccc; padding-left: 1em; color: #666; }
    pre { background: #f5f5f5; padding: 1em; border-radius: 6px; overflow-x: auto; }
    img { max-width: 100%; border-radius: 6px; }
    .callout { background: #f0f7ff; border-radius: 6px; padding: 1em; margin: 1em 0; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${body}
</body>
</html>`;
    downloadFile(
      `${currentPageData.meta.title}.html`,
      html,
      "text/html"
    );
    setShowExport(false);
  }, [currentPageData]);

  const closeAllMenus = useCallback(() => {
    setShowExport(false);
    setShowImport(false);
    setShowMoreMenu(false);
    setShowShareMenu(false);
    setShowSettings(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInsideMenu = target.closest(".header-menu");
      const isButton = target.closest("button");
      
      if (!isInsideMenu && !isButton) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeAllMenus]);

  return (
    <>
      <header className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background">
      {/* ── 左侧：侧边栏切换 + 面包屑 ── */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors shrink-0"
          title={sidebarOpen ? "收起侧边栏" : "展开侧边栏"}
        >
          {sidebarOpen ? (
            <PanelLeftCloseIcon size={20} />
          ) : (
            <PanelLeftIcon size={20} />
          )}
        </button>
        <Breadcrumb />
      </div>

      {/* ── 右侧：操作按钮 ── */}
      <div className="flex items-center gap-1">
        {/* 保存状态指示 */}
        {saveStatus === "saving" && (
          <span className="text-xs text-muted-foreground mr-2">
            保存中...
          </span>
        )}
        {saveStatus === "saved" && (
          <span className="flex items-center gap-1 text-xs text-green-500 mr-2">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            已保存
          </span>
        )}
        {saveStatus === "error" && (
          <span className="text-xs text-red-500 mr-2">
            保存出错
          </span>
        )}

        {/* 分享 */}
        <div className="relative header-menu">
          <button
            onClick={() => {
              setShowShareMenu(!showShareMenu);
              setShowExport(false);
              setShowImport(false);
              setShowMoreMenu(false);
            }}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="分享"
          >
            <ShareIcon size={16} />
          </button>
          {showShareMenu && (
            <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] bg-popover border border-border rounded-lg shadow-lg py-1">
              <button
                onClick={() => {
                  if (currentPageData?.blocks) {
                    const text = currentPageData.blocks
                      .map((b: any) => (b.props?.textContent || ""))
                      .join("\n");
                    navigator.clipboard.writeText(text);
                  }
                  setShowShareMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                <FileTextIcon size={16} />
                复制文本
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowShareMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                <ShareIcon size={16} />
                复制链接
              </button>
            </div>
          )}
        </div>

        {/* 导入 */}
        <div className="relative header-menu">
          <input
            ref={fileInputRef}
            type="file"
            name="file-import"
            accept=".md,.markdown,.html,.htm"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="导入"
          >
            <UploadIcon size={16} />
          </button>
        </div>

        {/* 导出 */}
        <div className="relative header-menu">
          <button
            onClick={() => {
              setShowExport(!showExport);
              setShowImport(false);
              setShowShareMenu(false);
              setShowMoreMenu(false);
            }}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="导出"
          >
            <DownloadIcon size={16} />
          </button>

          {showExport && (
            <div className="absolute right-0 top-full mt-1 z-50 min-w-[200px] bg-popover border border-border rounded-lg shadow-lg py-1">
              <div className="px-3 py-1.5 text-xs text-muted-foreground font-medium">
                导出为
              </div>
              <button
                onClick={handleExportMarkdown}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                <FileTextIcon size={16} />
                Markdown (.md)
              </button>
              <button
                onClick={handleExportHtml}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                <CodeIcon size={16} />
                HTML (.html)
              </button>
            </div>
          )}
        </div>

        {/* 主题切换 */}
        <ThemeToggle />

        {/* 更多 */}
        <div className="relative header-menu">
          <button
            onClick={() => {
              setShowMoreMenu(!showMoreMenu);
              setShowExport(false);
              setShowImport(false);
              setShowShareMenu(false);
            }}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="更多"
          >
            <MoreVerticalIcon size={16} />
          </button>
          {showMoreMenu && (
            <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] bg-popover border border-border rounded-lg shadow-lg py-1">
              <button
                onClick={handleCreateNewPage}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                <PlusIcon size={16} />
                新建文档
              </button>
              <button
                onClick={() => {
                  alert("历史记录功能开发中...");
                  setShowMoreMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                <ClockIcon size={16} />
                历史记录
              </button>
              <button
                onClick={() => {
                  setShowSettings(true);
                  setShowMoreMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                <MoreVerticalIcon size={16} />
                设置
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
