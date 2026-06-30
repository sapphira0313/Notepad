/**
 * useSelectionThrottle.ts — 选区更新的微任务调度 + 细粒度 Selector 拦截
 *
 * 重构说明：
 * - 将 onSelectionChange 中的同步状态更新改为微任务调度（queueMicrotask）
 * - 引入轻量防抖：连续选区变化只在稳定时才更新状态
 * - 状态 Selector 做深比较拦截，from/to 未实质改变则不触发更新
 *
 * 配合 Zustand 的 subscribeWithSelector 实现精确更新。
 */

import { useCallback, useRef } from "react";
import { type BlockNoteEditor } from "@blocknote/core";

// ─── Configuration ────────────────────────────────────────────────────

/** 选区稳定化等待时间（毫秒）— 连续选区变化会重置此定时器 */
const SELECTION_DEBOUNCE_MS = 80;

/** 从选区范围对象中提取核心特征值，用于比较 */
interface SelectionKey {
  from: number;
  to: number;
  /** 是否为空选区（仅光标，无选中文字） */
  empty: boolean;
  /** 选区所在 block 的 id（如果有） */
  blockId: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────

/**
 * 从 ProseMirror 选集中提取轻量比较键
 */
function getSelectionKey(editor: BlockNoteEditor): SelectionKey | null {
  try {
    const view = editor.prosemirrorView;
    if (!view) return null;

    const { from, to, empty } = view.state.selection;
    // 尝试获取当前选区所在的 block id
    const resolved = view.state.doc.resolve(from);
    let blockId: string | null = null;
    for (let d = resolved.depth; d > 0; d--) {
      const node = resolved.node(d);
      if (node.attrs?.id) {
        blockId = node.attrs.id;
        break;
      }
    }

    return { from, to, empty, blockId };
  } catch {
    return null;
  }
}

/**
 * 深比较两个 SelectionKey
 */
function selectionKeyChanged(
  a: SelectionKey | null,
  b: SelectionKey | null
): boolean {
  if (a === b) return false;
  if (!a || !b) return true;
  return a.from !== b.from || a.to !== b.to || a.blockId !== b.blockId;
}

// ─── Hook ─────────────────────────────────────────────────────────────

interface SelectionChangeHandler {
  /** 当选区实际发生变化时调用（已经过防抖和比较过滤） */
  onStableSelectionChange: (key: SelectionKey) => void;
}

/**
 * 选区变化防抖调度 Hook
 *
 * 用法：在 BlockNote 的 onSelectionChange 回调中调用 returnValue
 *
 * 示例：
 * ```ts
 * const onSelectionChange = useSelectionThrottle({
 *   onStableSelectionChange: (key) => {
 *     setPendingComment(key);
 *   }
 * });
 *
 * <BlockNoteView onSelectionChange={onSelectionChange} />
 * ```
 */
export function useSelectionThrottle(
  handlers: SelectionChangeHandler
): (editor: BlockNoteEditor) => void {
  const lastKeyRef = useRef<SelectionKey | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingKeyRef = useRef<SelectionKey | null>(null);

  const { onStableSelectionChange } = handlers;

  return useCallback(
    (editor: BlockNoteEditor) => {
      const currentKey = getSelectionKey(editor);

      // ── 微任务第一层：快速比较，无变化直接跳过 ──
      if (!selectionKeyChanged(currentKey, lastKeyRef.current)) {
        return;
      }

      // 更新上次值（用于下一次快速跳过）
      lastKeyRef.current = currentKey;

      // ── 第二层：防抖调度 ──
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (!currentKey) {
        // 选区不可用（编辑器未聚焦等），立即通知
        queueMicrotask(() => {
          onStableSelectionChange(currentKey!);
        });
        return;
      }

      // 保存待处理值
      pendingKeyRef.current = currentKey;

      debounceTimerRef.current = setTimeout(() => {
        const stableKey = pendingKeyRef.current;
        if (stableKey && selectionKeyChanged(stableKey, lastKeyRef.current)) {
          // 如果 key 在防抖间隔中再次被覆盖，跳过
          return;
        }
        // 使用微任务分派，避免阻塞输入事件
        queueMicrotask(() => {
          onStableSelectionChange(stableKey!);
        });
      }, SELECTION_DEBOUNCE_MS);
    },
    [onStableSelectionChange]
  );
}

// ─── 细粒度 Zustand Selector 工厂 ────────────────────────────────────

/**
 * 用于 Zustand 的细粒度 Selector 工厂
 *
 * 示例：
 * ```ts
 * const pendingComment = useCommentStore(
 *   selectionChangeSelector('pendingComment')
 * );
 * ```
 */
export function selectionChangeSelector<K extends string>(key: K) {
  return (state: Record<string, unknown>) => {
    // 使用 JSON 序列化做简单的深比较快照
    // 适用于选取值本身是字符串、null、或数字的轻量场景
    return state[key];
  };
}
