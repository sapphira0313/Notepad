/**
 * EditorShell.tsx — 编辑器外壳组件（集成所有重构模块）
 *
 * 职责：
 * 1. 初始化 BlockNote 编辑器
 * 2. 绑定声明式热键（Mantine useHotkeys）
 * 3. 绑定选区变化防抖
 * 4. 绑定自动保存引擎
 * 5. 渲染编辑器 UI + 保存状态指示
 *
 * 对应原 16n_7288zoqtd.js 中的主 React 组件逻辑。
 */

"use client";

import React, {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { type BlockNoteEditor as BlockNoteEditorType } from "@blocknote/core";
import { BlockNoteEditor } from "./BlockNoteEditor";
import { EmojiPicker } from "./EmojiPicker";
import { useEditorStore } from "../store/editorStore";
import { useEditorHotkeys } from "../hooks/useEditorHotkeys";
import { useSelectionThrottle } from "../hooks/useSelectionThrottle";
import {
  AutoSaveEngine,
  useAutoSaveStatus,
} from "../store/autoSave";
import { SaveIndicator } from "../hooks/useSaveIndicator";
import { safeUndo, safeRedo } from "../lib/editorHistory";
import {
  getStorage,
  type StoredBlock,
} from "../lib/storage";

// ─── Auto-Save 引擎（模块级惰性单例） ──────────────────────────────

let autoSaveEngine: AutoSaveEngine<{
  id: string;
  blocks: StoredBlock[];
}> | null = null;

function getAutoSaveEngine() {
  if (!autoSaveEngine) {
    autoSaveEngine = new AutoSaveEngine({
      debounceMs: 1500,
      persistFn: async (data) => {
        const storage = await getStorage();
        await storage.savePage({
          id: data.id,
          meta: {
            ...useEditorStore.getState().currentPageData!
              .meta,
            updatedAt: Date.now(),
          },
          blocks: data.blocks,
        });
      },
      getDataFn: () => {
        const state = useEditorStore.getState();
        return {
          id: state.currentPageId!,
          blocks:
            state.currentPageData?.blocks ?? [],
        };
      },
    });
  }
  return autoSaveEngine;
}

// ─── EditorShell 组件 ───────────────────────────────────────────────

export function EditorShell() {
  const isLoaded = useEditorStore((s) => s.isLoaded);
  const currentPageData = useEditorStore(
    (s) => s.currentPageData
  );
  const currentPageId = useEditorStore(
    (s) => s.currentPageId
  );
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const updatePageMeta = useEditorStore(
    (s) => s.updatePageMeta
  );
  const createPage = useEditorStore(
    (s) => s.createPage
  );
  const loadPage = useEditorStore((s) => s.loadPage);
  const loadWorkspace = useEditorStore(
    (s) => s.loadWorkspace
  );

  // ── Auto-Save Engine ──
  const engine = useMemo(
    () => getAutoSaveEngine(),
    []
  );
  const autoSaveStatus = useAutoSaveStatus(engine);

  // ── 编辑器引用 ──
  const [editorRef, setEditorRef] =
    useState<BlockNoteEditorType | null>(null);

  const [emojiPicker, setEmojiPicker] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInsidePicker = target.closest(".emoji-picker");
      const isIconButton = target.closest('button[title="点击更换图标"]');
      
      if (!isInsidePicker && !isIconButton) {
        setEmojiPicker(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ── 加载工作空间 ──
  const workspaceLoadedRef = useRef(false);
  useEffect(() => {
    if (workspaceLoadedRef.current) return;
    workspaceLoadedRef.current = true;
    loadWorkspace();
  }, [loadWorkspace]);

  // ── 热键绑定 ──
  useEditorHotkeys(
    {
      onNewPage: useCallback(async () => {
        const newId = await createPage(null);
        await loadPage(newId);
      }, [createPage, loadPage]),

      onSave: useCallback(() => {
        engine.flush();
      }, [engine]),

      onUndo: useCallback(() => {
        if (editorRef) {
          safeUndo(editorRef as Parameters<typeof safeUndo>[0]);
        }
      }, [editorRef]),

      onRedo: useCallback(() => {
        if (editorRef) {
          safeRedo(editorRef as Parameters<typeof safeRedo>[0]);
        }
      }, [editorRef]),

      onEscape: useCallback(() => {
        // 关闭所有弹窗 — 由子组件自己处理
      }, []),

      onOpenSearch: useCallback(() => {
        // 聚焦搜索框 — 由父组件处理
      }, []),
    },
    editorRef as Parameters<
      typeof useEditorHotkeys
    >[1]
  );

  // ── 加载状态 ──
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            加载中...
          </p>
        </div>
      </div>
    );
  }

  // ── 空状态 ──
  if (!currentPageId) {
    return (
      <div className="flex items-center justify-center flex-1 bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <span className="text-3xl">📝</span>
          </div>
          <p className="text-muted-foreground">
            选择左侧文档开始编辑，或创建新文档
          </p>
          <button
            onClick={() => createPage(null)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            新建文档
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      {/* ── 页面标题栏 ── */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* 图标 + 标题 */}
            <div className="flex items-start gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  setEmojiPicker({ x: rect.left, y: rect.bottom + 8 });
                }}
                className="w-10 h-10 flex items-center justify-center text-xl hover:bg-muted/50 transition-colors cursor-pointer"
                title="点击更换图标"
              >
                {currentPageData?.meta.icon || "📄"}
              </button>
              <input
                name="page-title"
                placeholder="无标题"
                className="w-full text-xl font-semibold bg-transparent outline-none placeholder:text-muted-foreground/40 border-none mt-1"
                type="text"
                value={
                  currentPageData?.meta.title || ""
                }
                onChange={(e) => {
                  if (currentPageId) {
                    updatePageMeta(currentPageId, {
                      title: e.target.value,
                    });
                  }
                }}
              />
            </div>

            {/* 保存状态指示 */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {saveStatus === "saving" && (
                <span>保存中...</span>
              )}
              {saveStatus === "saved" && (
                <>
                  <svg
                    className="h-4 w-4 text-green-500"
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
                  <span>已保存</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── BlockNote 编辑器区域 ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6 min-h-[calc(100vh-140px)]">
          <BlockNoteEditorArea
            pageData={currentPageData}
            onEditorReady={setEditorRef}
            onContentChange={() => {
            // 将编辑器内容同步到 store
            if (editorRef) {
              const blocks = (editorRef as any).document;
              useEditorStore.getState().updateBlocks(blocks);
            }
            engine.notifyDirty();
          }}
          />
        </div>
      </div>

      {/* ── 保存状态浮层 ── */}
      <SaveIndicator
        saveStatus={autoSaveStatus.saveStatus}
        className="transition-all duration-300"
      />

      {/* ── Emoji 选择器 ── */}
      {emojiPicker && (
        <EmojiPicker
          onSelect={(emoji) => {
            if (currentPageId) {
              updatePageMeta(currentPageId, { icon: emoji });
            }
          }}
          onClose={() => setEmojiPicker(null)}
          position={emojiPicker}
          currentEmoji={currentPageData?.meta.icon || ""}
        />
      )}
    </div>
  );
}

// ─── BlockNote 编辑器渲染区域 ───────────────────────────────────────

function BlockNoteEditorArea({
  pageData,
  onEditorReady,
  onContentChange,
}: {
  pageData: {
    blocks: StoredBlock[];
  } | null;
  onEditorReady: (editor: BlockNoteEditorType) => void;
  onContentChange: () => void;
}) {
  return (
    <BlockNoteEditor
      pageData={pageData}
      onEditorReady={onEditorReady}
      onContentChange={onContentChange}
    />
  );
}

// ─── Block 渲染 ─────────────────────────────────────────────────────

function BlockRender({
  block,
}: {
  block: StoredBlock;
}) {
  const type = block.type || "paragraph";
  const text =
    (block.props?.textContent as string) || "";
  const level = (block.props?.level as number) || 1;

  switch (type) {
    case "heading":
      if (level === 1)
        return <h1 className="text-3xl font-bold my-4">{text}</h1>;
      if (level === 2)
        return <h2 className="text-2xl font-bold my-3">{text}</h2>;
      return <h3 className="text-xl font-bold my-2">{text}</h3>;

    case "quote":
      return (
        <blockquote className="border-l-4 border-muted pl-4 my-4 text-muted-foreground">
          {text}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre className="bg-muted p-4 rounded-lg my-4 overflow-x-auto text-sm font-mono">
          <code>{text || "\n"}</code>
        </pre>
      );

    case "divider":
      return <hr className="my-6 border-border" />;

    case "bulletList":
    case "bulletListItem":
      return <li className="ml-6 list-disc my-1">{text}</li>;
    case "numberedList":
    case "numberedListItem":
      return (
        <li className="ml-6 list-decimal my-1">{text}</li>
      );
    case "checkListItem":
      return (
        <div className="flex items-center gap-2 my-1">
          <input
            type="checkbox"
            name="checklist-item"
            checked={
              (block.props?.checked as boolean) ||
              false
            }
            readOnly
            className="rounded"
          />
          <span>{text}</span>
        </div>
      );

    case "image": {
      const url = (block.props?.url as string) || "";
      const caption =
        (block.props?.caption as string) || "";
      return (
        <figure className="my-4">
          <img
            src={url}
            alt={caption}
            className="max-w-full rounded-lg"
          />
          {caption && (
            <figcaption className="text-sm text-muted-foreground text-center mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "bookmark": {
      const url = (block.props?.url as string) || "";
      return (
        <a
          href={url}
          className="text-primary underline hover:no-underline my-4 block"
          target="_blank"
          rel="noopener noreferrer"
        >
          {text || url}
        </a>
      );
    }

    case "paragraph":
    default:
      return <p className="my-2 leading-relaxed">{text}</p>;
  }
}
