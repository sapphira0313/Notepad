/**
 * editorHistory.ts — ProseMirror Undo/Redo via BlockNote History API
 *
 * 重构说明：
 * - 废弃 document.execCommand("undo"/"redo")，改用 ProseMirror 内置的 undo/redo 命令
 * - PM 的 undo/redo 通过 History Plugin 的 Transaction 堆栈工作，与编辑器 state.doc 保持一致
 * - 不依赖浏览器 contenteditable 的 UndoManager，彻底消除状态分歧
 */

import { type BlockNoteEditor } from "@blocknote/core";
import { undo as pmUndo, redo as pmRedo } from "prosemirror-history";

/**
 * 执行 ProseMirror 标准 Undo
 *
 * 利用 PM 的 history 插件提供的 redo 命令。
 * 需要确保 editor.prosemirrorView 已经挂载并且 history 插件已注册。
 *
 * @param editor - BlockNote Editor 实例
 * @returns boolean 表示是否成功执行了 undo
 */
export function undo(editor: BlockNoteEditor): boolean {
  const view = editor.prosemirrorView;
  if (!view) return false;

  const { state, dispatch } = view;

  if (pmUndo(state)) {
    pmUndo(state, dispatch);
    return true;
  }
  return false;
}

/**
 * 执行 ProseMirror 标准 Redo
 *
 * @param editor - BlockNote Editor 实例
 * @returns boolean 表示是否成功执行了 redo
 */
export function redo(editor: BlockNoteEditor): boolean {
  const view = editor.prosemirrorView;
  if (!view) return false;

  const { state, dispatch } = view;

  if (pmRedo(state)) {
    pmRedo(state, dispatch);
    return true;
  }
  return false;
}

/**
 * 安全执行 Undo——仅在焦点位于编辑器内时触发
 *
 * @param editor - BlockNote Editor 实例
 * @returns boolean
 */
export function safeUndo(editor: BlockNoteEditor): boolean {
  if (!editor.isFocused()) return false;
  return undo(editor);
}

/**
 * 安全执行 Redo
 *
 * @param editor - BlockNote Editor 实例
 * @returns boolean
 */
export function safeRedo(editor: BlockNoteEditor): boolean {
  if (!editor.isFocused()) return false;
  return redo(editor);
}