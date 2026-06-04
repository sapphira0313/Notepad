"use client";

import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import { useCreateBlockNote, BlockNoteViewEditor, SuggestionMenuController } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { offset, shift, flip } from "@floating-ui/react";
import { zh } from "@blocknote/core/locales";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { usePageStore } from "@/stores/usePageStore";
import { useTheme } from "next-themes";
import type { Block, BlockType } from "@/types/page";
import { nanoid } from "nanoid";
import { useAutoSave } from "@/hooks/useAutoSave";
import { cn } from "@/lib/utils";
import { PenLine, FileText, ImageIcon, X, Search, Type, Star } from "lucide-react";

function mapAppTypeToBN(type: string): string {
  const mapping: Record<string, string> = {
    paragraph: "paragraph",
    heading: "heading",
    quote: "quote",
    bulletList: "bulletListItem",
    numberedList: "numberedList",
    checkListItem: "checkListItem",
    codeBlock: "codeBlock",
    divider: "divider",
  };
  return mapping[type] || "paragraph";
}

function mapBNTypeToApp(type: string): BlockType {
  const mapping: Record<string, BlockType> = {
    paragraph: "paragraph",
    heading: "heading",
    quote: "quote",
    bulletListItem: "bulletList",
    numberedListItem: "numberedList",
    checkListItem: "checkListItem",
    codeBlock: "codeBlock",
    divider: "divider",
  };
  return mapping[type] || "paragraph";
}

// Placeholder cover gradients
const COVER_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
];

// Common emoji icons for quick selection
const EMOJI_LIST = [
  "📄", "📝", "📋", "📌", "📎", "📁", "📂", "🗂️",
  "🚀", "💡", "⭐", "🎯", "🎨", "🔥", "💎", "🌟",
  "📊", "📈", "🧮", "💻", "🔧", "⚙️", "🛠️", "🔑",
  "❤️", "💚", "💙", "💜", "🧡", "💛", "🖤", "🤍",
  "✅", "❌", "⚠️", "💬", "📢", "🎉", "🏆", "🎪",
];

export function BlockEditor() {
  const currentPageData = usePageStore((s) => s.currentPageData);
  const updateBlocks = usePageStore((s) => s.updateBlocks);
  const updatePageMeta = usePageStore((s) => s.updatePageMeta);
  const { resolvedTheme } = useTheme();
  const lastPageIdRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPageSearch, setShowPageSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMatchCount, setSearchMatchCount] = useState(0);

  const editor = useCreateBlockNote({ dictionary: zh });

  // Load blocks when page changes
  useEffect(() => {
    if (!currentPageData || !editor) return;
    if (lastPageIdRef.current === currentPageData.id) return;
    lastPageIdRef.current = currentPageData.id;
    setShowPageSearch(false);
    setSearchTerm("");

    const bnBlocks = currentPageData.blocks.length > 0
      ? currentPageData.blocks.map((b) => ({
          id: b.id,
          type: mapAppTypeToBN(b.type),
          props: {
            textContent: (b.props.textContent as string) || "",
            ...(b.type === "heading" ? { level: (b.props.level as number) || 1 } : {}),
            ...(b.type === "codeBlock" ? { language: (b.props.language as string) || "javascript" } : {}),
            ...(b.type === "checkListItem" ? { checked: (b.props.checked as boolean) || false } : {}),
          },
          children: [],
        }))
      : [{ type: "paragraph", props: { textContent: "" }, children: [] }];

    editor.replaceBlocks(editor.document, bnBlocks as any);
  }, [currentPageData?.id, editor]);

  // Real-time auto-save with debouncing
  const saveBlocks = useCallback(async () => {
    if (!currentPageData || !editor || isSavingRef.current) return;
    
    isSavingRef.current = true;
    setSaveStatus("saving");
    try {
      const bnBlocks = editor.document;
      const appBlocks: Block[] = bnBlocks.map((b) => ({
        id: b.id || nanoid(),
        type: mapBNTypeToApp(b.type as string),
        props: { ...b.props },
        content: [],
        parentId: null,
      }));

      await updateBlocks(appBlocks);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("unsaved");
    } finally {
      isSavingRef.current = false;
    }
  }, [currentPageData?.id, editor, updateBlocks]);

  const triggerAutoSave = useAutoSave(saveBlocks, 1000);

  // Handle editor change - trigger auto-save
  const handleChange = useCallback(() => {
    if (saveStatus === "saved") {
      setSaveStatus("unsaved");
    }
    triggerAutoSave();
  }, [triggerAutoSave, saveStatus]);

  // Handle title change with auto-save
  const handleTitleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!currentPageData) return;
      setSaveStatus("saving");
      try {
        await updatePageMeta(currentPageData.id, { title: e.target.value });
        setSaveStatus("saved");
      } catch {
        setSaveStatus("unsaved");
      }
    },
    [currentPageData, updatePageMeta]
  );

  // Handle title Enter key - focus editor
  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        editor.focus();
      }
    },
    [editor]
  );

  // Cover image handling
  const handleSetCover = useCallback((gradient: string) => {
    if (!currentPageData) return;
    updatePageMeta(currentPageData.id, { coverUrl: gradient });
    setShowCoverPicker(false);
  }, [currentPageData, updatePageMeta]);

  const handleRemoveCover = useCallback(() => {
    if (!currentPageData) return;
    updatePageMeta(currentPageData.id, { coverUrl: undefined });
  }, [currentPageData, updatePageMeta]);

  // #9 自定义页面图标
  const handleSetEmoji = useCallback((emoji: string) => {
    if (!currentPageData) return;
    usePageStore.getState().setPageIcon(currentPageData.id, emoji);
    setShowEmojiPicker(false);
  }, [currentPageData]);

  // #14 字数统计
  const wordCount = useMemo(() => {
    if (!currentPageData) return { chars: 0, words: 0 };
    const text = currentPageData.blocks
      .map((b) => (b.props.textContent as string) || "")
      .join(" ");
    const chars = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { chars, words };
  }, [currentPageData]);

  // #6 页面内搜索
  useEffect(() => {
    if (!searchTerm.trim() || !editor) {
      setSearchMatchCount(0);
      return;
    }
    // Count matches in block text
    const text = currentPageData?.blocks
      .map((b) => (b.props.textContent as string) || "")
      .join("\n") || "";
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches = text.match(regex);
    setSearchMatchCount(matches?.length ?? 0);
  }, [searchTerm, currentPageData, editor]);

  if (!currentPageData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <PenLine className="w-10 h-10 text-primary/50" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <p className="text-lg font-semibold font-[var(--font-heading)]">选择一个页面开始编辑</p>
            <p className="text-sm text-muted-foreground max-w-xs">在左侧边栏中选择或创建新页面，开始你的创作之旅</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
            <kbd className="px-2 py-1 bg-muted rounded-md border border-border/60">Ctrl+N</kbd>
            <span>新建页面</span>
          </div>
        </div>
      </div>
    );
  }

  const hasCover = !!currentPageData.meta.coverUrl;

  return (
    <div className="min-h-full bg-background flex flex-col">
      {/* Cover Image Area */}
      {hasCover && (
        <div className="relative h-44 sm:h-52 group">
          <div
            className="absolute inset-0"
            style={{ background: currentPageData.meta.coverUrl }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setShowCoverPicker(true)}
              aria-label="更换封面"
              className="px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg text-xs font-medium text-foreground hover:bg-background/95 transition-all shadow-sm"
            >
              更换封面
            </button>
            <button
              onClick={handleRemoveCover}
              aria-label="移除封面"
              className="p-1.5 bg-background/80 backdrop-blur-sm rounded-lg text-foreground hover:bg-background/95 transition-all shadow-sm"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className={cn(
        "border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-14 z-10 shadow-sm shadow-black/4",
        hasCover && "-mt-8 relative z-10"
      )}>
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              {/* #9 可点击的页面图标 */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xl shadow-sm shadow-primary/10 transition-all duration-200 hover:shadow-md hover:shadow-primary/15 shrink-0 hover:scale-105"
                title="更换图标"
              >
                {currentPageData.meta.icon ? (
                  <span className="text-xl">{currentPageData.meta.icon}</span>
                ) : (
                  <FileText className="w-5 h-5 text-primary/70" aria-hidden="true" />
                )}
              </button>
              <input
                type="text"
                value={currentPageData.meta.title}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeyDown}
                placeholder="无标题"
                aria-label="页面标题"
                className="w-full text-xl font-semibold bg-transparent outline-none placeholder:text-muted-foreground/40 border-none mt-0.5 transition-all duration-200 focus:placeholder:text-muted-foreground/60 font-[var(--font-heading)]"
              />
            </div>
            {/* Auto-save status + actions */}
            <div className="flex items-center gap-2 shrink-0 ml-3">
              {/* #6 页面内搜索按钮 */}
              <button
                onClick={() => setShowPageSearch(!showPageSearch)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  showPageSearch ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
                title="页面内搜索 (Ctrl+F)"
              >
                <Search className="w-4 h-4" />
              </button>
              {/* Save status */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-live="polite">
                {saveStatus === "saving" && (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-muted-foreground/70 hidden sm:inline">保存中...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-600 hidden sm:inline">已保存</span>
                  </>
                )}
                {saveStatus === "unsaved" && (
                  <>
                    <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-yellow-600 hidden sm:inline">未保存</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Page search bar (inline) */}
          {showPageSearch && (
            <div className="mt-3 flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 animate-in slide-in-from-top-1">
              <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="在页面中搜索..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/50"
                autoFocus
              />
              {searchTerm && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {searchMatchCount} 个匹配
                </span>
              )}
              <button onClick={() => { setShowPageSearch(false); setSearchTerm(""); }} className="p-1 hover:bg-accent rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          )}

          {/* Add cover button (when no cover) */}
          {!hasCover && (
            <button
              onClick={() => setShowCoverPicker(true)}
              aria-label="添加封面图"
              className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
              添加封面
            </button>
          )}
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
          <div className="absolute z-50 top-36 left-1/2 -translate-x-1/2 w-72 bg-popover border border-border rounded-xl shadow-xl p-4 animate-scale-in">
            <p className="text-sm font-medium mb-3 font-[var(--font-heading)]">选择页面图标</p>
            <div className="grid grid-cols-8 gap-1">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSetEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent/60 transition-all hover:scale-125 text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Cover Picker */}
      {showCoverPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowCoverPicker(false)} />
          <div className="absolute z-50 top-48 left-1/2 -translate-x-1/2 w-80 bg-popover border border-border rounded-xl shadow-xl p-4 animate-scale-in">
            <p className="text-sm font-medium mb-3 font-[var(--font-heading)]">选择封面样式</p>
            <div className="grid grid-cols-3 gap-2">
              {COVER_GRADIENTS.map((g, i) => (
                <button
                  key={i}
                  onClick={() => handleSetCover(g)}
                  aria-label={`封面样式 ${i + 1}`}
                  className="h-12 rounded-lg hover:ring-2 hover:ring-primary/50 transition-all hover:scale-105"
                  style={{ background: g }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* BlockNote Editor */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-10 sm:pt-14 pb-4 min-h-[calc(100vh-200px)] flex-1">
        <BlockNoteView
          editor={editor}
          onChange={handleChange}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          renderEditor={false}
          slashMenu={false}
          sideMenu={false}
          filePanel={false}
        >
          <BlockNoteViewEditor>
            <SuggestionMenuController
              triggerCharacter="/"
              floatingUIOptions={{
                useFloatingOptions: {
                  placement: "bottom-start",
                  middleware: [
                    offset(8),
                    shift({ padding: 8 }),
                    flip({
                      fallbackPlacements: [
                        "top-start",
                        "bottom-end",
                        "top-end",
                      ],
                    }),
                  ],
                },
              }}
            />
          </BlockNoteViewEditor>
        </BlockNoteView>
      </div>

      {/* #14 字数统计状态栏 */}
      <div className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-1.5 flex items-center justify-between text-xs text-muted-foreground/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Type className="w-3 h-3" />
              {wordCount.chars} 字符
            </span>
            <span>{wordCount.words} 词</span>
            <span>{currentPageData.blocks.length} 块</span>
          </div>
          <div className="flex items-center gap-2">
            {currentPageData.meta.isFavorite && (
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            )}
            <span>最后编辑: {new Date(currentPageData.meta.updatedAt).toLocaleString("zh-CN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
