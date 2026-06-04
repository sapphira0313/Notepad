/** 页面元数据 */
export interface PageMeta {
  id: string;
  title: string;
  icon?: string;
  coverUrl?: string;
  parentId: string | null;
  childIds: string[];
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
  isFavorite?: boolean;
  /** 软删除时间戳，有值表示在回收站中 */
  deletedAt?: number;
}

/** 完整页面数据（包含 Blocks） */
export interface PageData {
  id: string;
  meta: PageMeta;
  blocks: Block[];
}

/** Block 基础结构 */
export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
  content: string[];
  parentId: string | null;
}

/** 支持的 Block 类型 */
export type BlockType =
  | "paragraph"
  | "heading"
  | "quote"
  | "callout"
  | "bulletList"
  | "numberedList"
  | "checkListItem"
  | "toggleList"
  | "codeBlock"
  | "image"
  | "video"
  | "file"
  | "divider"
  | "table"
  | "tableRow"
  | "tableCell"
  | "databaseView"
  | "pageLink"
  | "bookmark"
  | "math";

/** 工作区元数据 */
export interface WorkspaceMeta {
  version: number;
  name: string;
  rootPageIds: string[];
  pageTree: Record<string, PageTreeEntry>;
  databaseIds: string[];
  lastModified: number;
  /** 回收站页面树（保留结构以便恢复） */
  trashTree?: Record<string, TrashEntry>;
}

export interface PageTreeEntry {
  title: string;
  icon?: string;
  childIds: string[];
}

/** 回收站中的页面条目（含删除时间） */
export interface TrashEntry {
  title: string;
  icon?: string;
  childIds: string[];
  deletedAt: number;
}
