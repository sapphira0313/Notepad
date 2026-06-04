import type { StorageProvider } from "./types";
import type { PageData, WorkspaceMeta } from "@/types/page";
import type { DatabaseSchema } from "@/types/database";

/**
 * File System Access API 存储实现
 * 仅在 Chromium 浏览器中可用
 */
export class FileSystemStorage implements StorageProvider {
  private dirHandle: FileSystemDirectoryHandle | null = null;
  private memoryPages: Map<string, PageData> = new Map();
  private memoryDatabases: Map<string, DatabaseSchema> = new Map();
  private memoryWorkspace: WorkspaceMeta | null = null;

  static isSupported(): boolean {
    return "showDirectoryPicker" in window;
  }

  async init() {
    // Will be connected when user selects a directory
  }

  async connectDirectory(handle?: FileSystemDirectoryHandle) {
    if (handle) {
      this.dirHandle = handle;
    } else if (FileSystemStorage.isSupported()) {
      this.dirHandle = await (window as any).showDirectoryPicker({
        mode: "readwrite",
      });
    }
    if (this.dirHandle) {
      await this.ensureDirectories();
      await this.loadFromDisk();
    }
  }

  private async ensureDirectories() {
    if (!this.dirHandle) return;
    try {
      await this.dirHandle.getDirectoryHandle("pages", { create: true });
      await this.dirHandle.getDirectoryHandle("databases", { create: true });
      await this.dirHandle.getDirectoryHandle("assets", { create: true });
    } catch (e) {
      console.warn("Failed to create directories:", e);
    }
  }

  private async loadFromDisk() {
    if (!this.dirHandle) return;

    try {
      const wsFile = await this.readFile("workspace.json");
      if (wsFile) {
        this.memoryWorkspace = JSON.parse(wsFile);
      }

      const pagesDir = await this.dirHandle.getDirectoryHandle("pages");
      for await (const entry of (pagesDir as any).values()) {
        if (entry.kind === "file" && entry.name.endsWith(".json")) {
          const file = await entry.getFile();
          const text = await file.text();
          const page = JSON.parse(text) as PageData;
          this.memoryPages.set(page.id, page);
        }
      }
    } catch (e) {
      console.warn("Failed to load from disk:", e);
    }
  }

  private async readFile(path: string): Promise<string | null> {
    if (!this.dirHandle) return null;
    try {
      const fileHandle = await this.dirHandle.getFileHandle(path);
      const file = await fileHandle.getFile();
      return await file.text();
    } catch {
      return null;
    }
  }

  private async writeFile(path: string, content: string) {
    if (!this.dirHandle) return;

    const parts = path.split("/");
    let dir = this.dirHandle;
    for (let i = 0; i < parts.length - 1; i++) {
      dir = await dir.getDirectoryHandle(parts[i], { create: true });
    }

    const fileHandle = await dir.getFileHandle(parts[parts.length - 1], { create: true });
    const writable = await (fileHandle as any).createWritable();
    await writable.write(content);
    await writable.close();
  }

  private async deleteFile(path: string) {
    if (!this.dirHandle) return;

    const parts = path.split("/");
    let dir = this.dirHandle;
    for (let i = 0; i < parts.length - 1; i++) {
      dir = await dir.getDirectoryHandle(parts[i]);
    }
    await dir.removeEntry(parts[parts.length - 1]);
  }

  async loadWorkspace(): Promise<WorkspaceMeta | null> {
    return this.memoryWorkspace;
  }

  async saveWorkspace(meta: WorkspaceMeta): Promise<void> {
    this.memoryWorkspace = meta;
    await this.writeFile("workspace.json", JSON.stringify(meta, null, 2));
  }

  async loadPage(pageId: string): Promise<PageData | null> {
    return this.memoryPages.get(pageId) || null;
  }

  async savePage(page: PageData): Promise<void> {
    this.memoryPages.set(page.id, page);
    await this.writeFile(`pages/${page.id}.json`, JSON.stringify(page, null, 2));
  }

  async deletePage(pageId: string): Promise<void> {
    this.memoryPages.delete(pageId);
    try {
      await this.deleteFile(`pages/${pageId}.json`);
    } catch {
      // File might not exist
    }
  }

  async getAllPages(): Promise<PageData[]> {
    return Array.from(this.memoryPages.values());
  }

  // ── 数据库 ──────────────────────────────────────────

  async loadDatabase(dbId: string): Promise<DatabaseSchema | null> {
    return this.memoryDatabases.get(dbId) || null;
  }

  async saveDatabase(db: DatabaseSchema): Promise<void> {
    this.memoryDatabases.set(db.id, db);
    await this.writeFile(`databases/${db.id}.json`, JSON.stringify(db, null, 2));
  }

  async deleteDatabase(dbId: string): Promise<void> {
    this.memoryDatabases.delete(dbId);
    try {
      await this.deleteFile(`databases/${dbId}.json`);
    } catch {
      // File might not exist
    }
  }

  async getAllDatabases(): Promise<DatabaseSchema[]> {
    return Array.from(this.memoryDatabases.values());
  }

  getDirectoryHandle() {
    return this.dirHandle;
  }

  isConnected(): boolean {
    return this.dirHandle !== null;
  }
}
