/**
 * autoSave.ts — 防抖静默自动保存引擎
 *
 * 重构说明：
 * - 废弃手动 Ctrl+S 唯一保存途径，改为输入停滞后 1.5s 自动持久化
 * - 提供 isSaving / savedAt / saveError 状态指示
 * - 支持立即保存（forceFlush）用于页面关闭前的同步
 * - 基于 Zustand subscribe + debounce 实现，不侵入编辑器逻辑
 */

import { useEffect, useState, useRef } from "react";

// ─── Type Definitions ─────────────────────────────────────────────────

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface AutoSaveState {
  /** 当前保存状态 */
  saveStatus: SaveStatus;
  /** 上次成功保存的时间戳 */
  lastSavedAt: number | null;
  /** 上次保存错误的错误信息 */
  lastSaveError: string | null;
  /** 是否有未保存的变更 */
  isDirty: boolean;
}

// ─── Auto-Save Engine ──────────────────────────────────────────────────

/**
 * 防抖自动保存引擎
 *
 * 职责链：
 * 用户输入 → Zustand state 变更 → subscribe 感知 → 启动/重置防抖定时器
 * → 1.5s 无新变更 → 执行持久化 → 更新状态指示
 */
export class AutoSaveEngine<T> {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private statusListeners: Set<(state: AutoSaveState) => void> = new Set();
  private _state: AutoSaveState = {
    saveStatus: "idle",
    lastSavedAt: null,
    lastSaveError: null,
    isDirty: false,
  };

  /** 防抖延迟（ms） */
  private readonly debounceMs: number;
  /** 实际持久化函数 */
  private readonly persistFn: (data: T) => Promise<void>;
  /** 获取当前待保存数据的函数 */
  private readonly getDataFn: () => T;

  constructor(options: {
    debounceMs?: number;
    persistFn: (data: T) => Promise<void>;
    getDataFn: () => T;
  }) {
    this.debounceMs = options.debounceMs ?? 1500;
    this.persistFn = options.persistFn;
    this.getDataFn = options.getDataFn;

    // 页面关闭前执行 flush
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", this.handleBeforeUnload);
      // 在页面可见性变化时也检查——iOS Safari tab 切换
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }

  /**
   * 通知引擎有数据变更，启动/重置防抖定时器
   */
  notifyDirty(): void {
    this.updateState({ isDirty: true });

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.flush();
    }, this.debounceMs);
  }

  /**
   * 立即执行持久化（无视防抖定时器）
   */
  async flush(): Promise<void> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (!this._state.isDirty) return;

    this.updateState({ saveStatus: "saving" });

    try {
      const data = this.getDataFn();
      await this.persistFn(data);
      this.updateState({
        saveStatus: "saved",
        lastSavedAt: Date.now(),
        lastSaveError: null,
        isDirty: false,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown save error";
      this.updateState({
        saveStatus: "error",
        lastSaveError: message,
      });
      // 保留 isDirty = true，等待下一次重试
    }
  }

  /**
   * 订阅状态变更
   * @returns 取消订阅函数
   */
  subscribe(listener: (state: AutoSaveState) => void): () => void {
    this.statusListeners.add(listener);
    // 立即推一次当前状态
    listener({ ...this._state });
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  /**
   * 获取当前保存状态（同步）
   */
  get state(): Readonly<AutoSaveState> {
    return this._state;
  }

  /**
   * 销毁引擎，清理所有定时器和监听器
   */
  destroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (typeof window !== "undefined") {
      window.removeEventListener("beforeunload", this.handleBeforeUnload);
      document.removeEventListener(
        "visibilitychange",
        this.handleVisibilityChange
      );
    }
    this.statusListeners.clear();
  }

  // ── Private ──

  private updateState(partial: Partial<AutoSaveState>): void {
    this._state = { ...this._state, ...partial };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    const snapshot = { ...this._state };
    this.statusListeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch {
        // 防止单个 listener 异常破坏整体
      }
    });
  }

  private handleBeforeUnload = (): void => {
    if (this._state.isDirty) {
      // 注意：现代浏览器中同步 XHR 可能被阻塞
      // 这里我们触发 flush 但并不保证完成
      this.flush();
    }
  };

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === "hidden" && this._state.isDirty) {
      this.flush();
    }
  };
}

// ─── React Hook ──────────────────────────────────────────────────────

/**
 * React Hook：接入 AutoSaveEngine 的状态指示
 *
 * @param engine - AutoSaveEngine 实例
 * @returns AutoSaveState — 可在 UI 中直接展示
 */
export function useAutoSaveStatus<T>(engine: AutoSaveEngine<T> | null): AutoSaveState {
  const [status, setStatus] = useState<AutoSaveState>({
    saveStatus: "idle",
    lastSavedAt: null,
    lastSaveError: null,
    isDirty: false,
  });
  const engineRef = useRef(engine);
  engineRef.current = engine;

  useEffect(() => {
    const current = engineRef.current;
    if (!current) return;

    const unsub = current.subscribe((newState) => {
      setStatus(newState);
    });

    return unsub;
  }, [engine]);

  return status;
}
