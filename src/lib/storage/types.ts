import type { PageData, WorkspaceMeta } from "@/types/page";
import type { DatabaseSchema } from "@/types/database";

export interface StorageProvider {
  init(): Promise<void>;

  // 工作区
  loadWorkspace(): Promise<WorkspaceMeta | null>;
  saveWorkspace(meta: WorkspaceMeta): Promise<void>;

  // 页面
  loadPage(pageId: string): Promise<PageData | null>;
  savePage(page: PageData): Promise<void>;
  deletePage(pageId: string): Promise<void>;
  getAllPages(): Promise<PageData[]>;

  // 数据库
  loadDatabase(dbId: string): Promise<DatabaseSchema | null>;
  saveDatabase(db: DatabaseSchema): Promise<void>;
  deleteDatabase(dbId: string): Promise<void>;
  getAllDatabases(): Promise<DatabaseSchema[]>;
}
