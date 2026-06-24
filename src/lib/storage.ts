/**
 * storage.ts — IndexedDB 存储层
 *
 * 基于原 16n_7288zoqtd.js 中 eA 类的完整逆向实现。
 * 使用 idb 库封装 IndexedDB 操作，提供 Promise 风格 API。
 *
 * DB Schema (v1):
 *   workspace — keyPath: "id", ObjectStore
 *   pages     — keyPath: "id", ObjectStore
 */

import { openDB, type IDBPDatabase } from "idb";

// ─── 数据库常量 ───────────────────────────────────────────────────────

const DB_NAME = "notion-local-db";
const DB_VERSION = 2;

// ─── 类型定义 ─────────────────────────────────────────────────────────

export interface WorkspaceData {
  version: number;
  name: string;
  rootPageIds: string[];
  pageTree: Record<
    string,
    { title: string; icon: string; childIds: string[] }
  >;
  databaseIds: string[];
  lastModified: number;
}

export interface PageMeta {
  id: string;
  title: string;
  icon: string;
  parentId: string | null;
  childIds: string[];
  createdAt: number;
  updatedAt: number;
  isStarred: boolean;
  lastOpenedAt: number;
}

export interface StoredBlock {
  id: string;
  type: string;
  props: Record<string, unknown>;
  content: unknown[];
  children?: StoredBlock[];
  parentId?: string | null;
}

export interface PageDocument {
  id: string;
  meta: PageMeta;
  blocks: StoredBlock[];
}

// ─── Storage 类 ───────────────────────────────────────────────────────

class StorageEngine {
  private db: IDBPDatabase | null = null;

  /**
   * 初始化数据库连接。
   * 幂等操作：重复调用不会创建新连接。
   */
  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("workspace")) {
          db.createObjectStore("workspace", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("pages")) {
          db.createObjectStore("pages", { keyPath: "id" });
        }
      },
    });
  }

  /** 获取数据库实例，未初始化时抛出错误 */
  private getDb(): IDBPDatabase {
    if (!this.db) {
      throw new Error(
        "[Storage] 数据库未初始化，请先调用 storage.init()"
      );
    }
    return this.db;
  }

  // ── Workspace 操作 ──────────────────────────────────────────

  /** 加载工作空间数据 */
  async loadWorkspace(): Promise<WorkspaceData | null> {
    const db = this.getDb();
    const record = await db.get("workspace", "main");
    return record ? (record.data as WorkspaceData) : null;
  }

  /** 保存工作空间数据 */
  async saveWorkspace(data: WorkspaceData): Promise<void> {
    const db = this.getDb();
    await db.put("workspace", { id: "main", data });
  }

  // ── Page 操作 ───────────────────────────────────────────────

  /** 加载单个页面 */
  async loadPage(id: string): Promise<PageDocument | null> {
    const db = this.getDb();
    return (await db.get("pages", id)) ?? null;
  }

  /** 保存页面（upsert） */
  async savePage(page: PageDocument): Promise<void> {
    const db = this.getDb();
    await db.put("pages", page);
  }

  /** 删除页面 */
  async deletePage(id: string): Promise<void> {
    const db = this.getDb();
    await db.delete("pages", id);
  }

  /** 获取所有页面 */
  async getAllPages(): Promise<PageDocument[]> {
    const db = this.getDb();
    return db.getAll("pages");
  }
}

// ─── 模块级单例 ──────────────────────────────────────────────────────

let storageInstance: StorageEngine | null = null;
let storageInitPromise: Promise<StorageEngine> | null = null;

/**
 * 获取存储层单例。
 * 首次调用时自动初始化。
 *
 * 使用 Promise 锁确保并发调用不会绕过 init()——
 * 只有第一个调用者执行 init()，所有后续调用者
 * 等待同一个 Promise resolve。
 */
export async function getStorage(): Promise<StorageEngine> {
  if (storageInstance) {
    return storageInstance;
  }

  if (!storageInitPromise) {
    storageInitPromise = (async () => {
      const instance = new StorageEngine();
      await instance.init();
      storageInstance = instance;
      storageInitPromise = null; // 释放 Promise 引用，避免内存泄漏
      return instance;
    })();
  }

  return storageInitPromise;
}

/**
 * 在测试或特殊场景下重置存储单例。
 */
export function resetStorage(): void {
  storageInstance = null;
  storageInitPromise = null;
}
