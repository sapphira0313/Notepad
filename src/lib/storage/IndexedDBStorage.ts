import { openDB, type IDBPDatabase } from "idb";
import type { StorageProvider } from "./types";
import type { PageData, WorkspaceMeta } from "@/types/page";
import type { DatabaseSchema } from "@/types/database";

const DB_NAME = "notion-local-db";
const DB_VERSION = 2;

export class IndexedDBStorage implements StorageProvider {
  private db: IDBPDatabase | null = null;

  async init() {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion) {
          if (!db.objectStoreNames.contains("workspace")) {
            db.createObjectStore("workspace", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains("pages")) {
            db.createObjectStore("pages", { keyPath: "id" });
          }
          // v2: 新增数据库 object store
          if (oldVersion < 2 && !db.objectStoreNames.contains("databases")) {
            db.createObjectStore("databases", { keyPath: "id" });
          }
        },
      });
    } catch (error) {
      console.error("Failed to open database:", error);
      
      // 处理版本错误：删除旧数据库并重试
      if (error instanceof DOMException && error.name === "VersionError") {
        console.warn("Database version mismatch detected. Deleting old database...");
        await this.deleteOldDatabase();
        this.db = await openDB(DB_NAME, DB_VERSION, {
          upgrade(db) {
            if (!db.objectStoreNames.contains("workspace")) {
              db.createObjectStore("workspace", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("pages")) {
              db.createObjectStore("pages", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("databases")) {
              db.createObjectStore("databases", { keyPath: "id" });
            }
          },
        });
      } else {
        throw error;
      }
    }
  }

  private async deleteOldDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => {
        console.warn("Database deletion blocked, trying again...");
        setTimeout(() => this.deleteOldDatabase().then(resolve).catch(reject), 100);
      };
    });
  }

  private getDb(): IDBPDatabase {
    if (!this.db) throw new Error("Storage not initialized");
    return this.db;
  }

  // ── 工作区 ──────────────────────────────────────────

  async loadWorkspace(): Promise<WorkspaceMeta | null> {
    const db = this.getDb();
    const result = await db.get("workspace", "main");
    return result ? (result.data as WorkspaceMeta) : null;
  }

  async saveWorkspace(meta: WorkspaceMeta): Promise<void> {
    const db = this.getDb();
    await db.put("workspace", { id: "main", data: meta });
  }

  // ── 页面 ────────────────────────────────────────────

  async loadPage(pageId: string): Promise<PageData | null> {
    const db = this.getDb();
    const result = await db.get("pages", pageId);
    return result ? (result as PageData) : null;
  }

  async savePage(page: PageData): Promise<void> {
    const db = this.getDb();
    await db.put("pages", page);
  }

  async deletePage(pageId: string): Promise<void> {
    const db = this.getDb();
    await db.delete("pages", pageId);
  }

  async getAllPages(): Promise<PageData[]> {
    const db = this.getDb();
    return db.getAll("pages");
  }

  // ── 数据库 ──────────────────────────────────────────

  async loadDatabase(dbId: string): Promise<DatabaseSchema | null> {
    const db = this.getDb();
    const result = await db.get("databases", dbId);
    return result ? (result as DatabaseSchema) : null;
  }

  async saveDatabase(schema: DatabaseSchema): Promise<void> {
    const db = this.getDb();
    await db.put("databases", schema);
  }

  async deleteDatabase(dbId: string): Promise<void> {
    const db = this.getDb();
    await db.delete("databases", dbId);
  }

  async getAllDatabases(): Promise<DatabaseSchema[]> {
    const db = this.getDb();
    return db.getAll("databases");
  }
}
