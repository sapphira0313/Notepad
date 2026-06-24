/**
 * useEditorHotkeys.ts — 声明式热键管理（替代全局 window.addEventListener）
 *
 * 重构说明：
 * - 废弃全局 window.addEventListener("keydown")，改用 Mantine 的 useHotkeys 钩子
 * - useHotkeys 内部已经处理了：
 *   1. 声明式绑定（React 生命周期自动 cleanup）
 *   2. 焦点隔离（默认忽略 input/textarea/select 中的按键）
 * - 额外提供 getExcludedElements() 兼容层，用于拦截弹窗/评论区域中的误触
 * - Ctrl+N / Ctrl+S / Ctrl+Z / Ctrl+Shift+Z / Escape 全部通过此模块声明
 */

import { useHotkeys } from "@mantine/hooks";
import { useCallback, useRef } from "react";
import { type BlockNoteEditor } from "@blocknote/core";

import { safeUndo, safeRedo } from "../lib/editorHistory";

// ─── Types ────────────────────────────────────────────────────────────

export interface HotkeyActions {
  /** Ctrl+N: 新建页面 */
  onNewPage: () => void;
  /** Ctrl+S: 手动触发保存（自动保存通常已覆盖，保留手动触发入口） */
  onSave: () => void;
  /** Ctrl+Z: Undo */
  onUndo: () => void;
  /** Ctrl+Shift+Z: Redo */
  onRedo: () => void;
  /** Escape: 关闭所有弹窗 */
  onEscape: () => void;
  /** Ctrl+K: 打开搜索 */
  onOpenSearch: () => void;
}

// ─── Focus Isolation Helpers ──────────────────────────────────────────

/**
 * 判断事件目标是否在"被隔离"的容器内（弹窗、评论输入框等）
 * 在这些容器内触发时，编辑器热键不响应
 */
function isTargetIsolated(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  return (
    target.closest('[role="dialog"]') !== null ||
    target.closest("[data-hotkey-isolated]") !== null ||
    target.closest(".mantine-Modal-root") !== null ||
    target.closest(".bn-comment-editor") !== null ||
    target.closest(".mantine-Popover-dropdown") !== null
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────

/**
 * 声明式编辑器热键管理 Hook
 *
 * 使用 Mantine 的 useHotkeys 替代 window.addEventListener。
 * useHotkeys 默认忽略 input/textarea/select 中的按键，
 * 但仍需要额外隔离弹窗场景。
 *
 * @param actions - 热键回调函数集合
 * @param editor  - BlockNote Editor 实例（用于焦点感知）
 */
export function useEditorHotkeys(
  actions: HotkeyActions,
  editor: BlockNoteEditor | null
): void {
  const editorRef = useRef(editor);
  editorRef.current = editor;

  // 带隔离检查的 safeAction wrapper
  const withIsolation = useCallback(
    (fn: () => void) => (event: KeyboardEvent) => {
      if (isTargetIsolated(event.target)) return;
      // 对于编辑器专属操作（undo/redo），额外检查编辑器是否聚焦
      fn();
    },
    []
  );

  // ── 热键声明 ──
  // 使用 useHotkeys 数组语法：
  // [keyCombo, handler, position?]
  // keyCombo 格式: "mod+N" (mod = Ctrl/Meta)
  useHotkeys([
    ["mod+N", () => actions.onNewPage(), { preventDefault: true }],
    [
      "mod+S",
      withIsolation(() => actions.onSave()),
      { preventDefault: true },
    ],
    // Ctrl+Z — Undo
    [
      "mod+Z",
      withIsolation(() => {
        if (editorRef.current?.isFocused()) {
          actions.onUndo();
        }
      }),
      { preventDefault: true },
    ],
    // Ctrl+Shift+Z — Redo
    [
      "mod+shift+Z",
      withIsolation(() => {
        if (editorRef.current?.isFocused()) {
          actions.onRedo();
        }
      }),
      { preventDefault: true },
    ],
    // Escape
    ["Escape", withIsolation(() => actions.onEscape()), {}],
    // Ctrl+K — 搜索
    ["mod+K", () => actions.onOpenSearch(), { preventDefault: true }],
  ]);
}

// ─── 兼容过渡：当无法使用 Mantine 时的降级方案 ────────────────────────

/**
 * 降级方案 —— 如果项目暂时不能引入 @mantine/hooks，
 * 可以使用此函数手动绑定（依然优于原全局监听）
 *
 * @returns cleanup 函数
 */
export function fallbackBindHotkeys(actions: HotkeyActions): () => void {
  const handler = (e: KeyboardEvent) => {
    const mod = e.metaKey || e.ctrlKey;
    const target = e.target;

    // 焦点隔离
    if (isTargetIsolated(target)) return;

    // 默认忽略 input/textarea/select（模拟 useHotkeys 行为）
    if (
      target instanceof HTMLElement &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT")
    ) {
      // 但编辑器内的 contenteditable 除外
      if (!target.closest('[contenteditable="true"]')) return;
    }

    if (mod && e.key === "n") {
      e.preventDefault();
      actions.onNewPage();
    } else if (mod && e.key === "s") {
      e.preventDefault();
      actions.onSave();
    } else if (mod && !e.shiftKey && e.key === "z") {
      e.preventDefault();
      actions.onUndo();
    } else if (mod && e.shiftKey && e.key === "z") {
      e.preventDefault();
      actions.onRedo();
    } else if (e.key === "Escape") {
      actions.onEscape();
    } else if (mod && e.key === "k") {
      e.preventDefault();
      actions.onOpenSearch();
    }
  };

  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}
