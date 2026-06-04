/**
 * 基于 FlexSearch 的全文搜索索引服务
 * 替代线性扫描所有页面的搜索方式
 */
import { Document } from "flexsearch";
import { getStorage } from "@/lib/storage/StorageManager";
import type { PageMeta } from "@/types/page";

type IndexDoc = Record<string, string | number | boolean>;

export interface SearchIndexEntry {
  pageId: string;
  pageTitle: string;
  pageIcon?: string;
  blockId?: string;
  text: string;
  type: "page" | "block";
}

class SearchIndexService {
  private index: Document<IndexDoc> | null = null;
  private entries: Map<string, SearchIndexEntry> = new Map();
  private isBuilt = false;

  /**
   * 构建/重建搜索索引
   */
  async buildIndex(pages: Record<string, PageMeta>): Promise<void> {
    this.index = new Document<IndexDoc>({
      document: {
        id: "pageId",
        index: ["pageTitle", "text"],
        store: true,
      },
      tokenize: "forward",
      cache: 100,
    });

    this.entries.clear();
    const storage = await getStorage();

    for (const [id, page] of Object.entries(pages)) {
      // 索引页面标题
      const pageEntry: SearchIndexEntry = {
        pageId: id,
        pageTitle: page.title,
        pageIcon: page.icon,
        text: page.title,
        type: "page",
      };
      this.entries.set(`page-${id}`, pageEntry);
      this.index.add({ ...pageEntry, pageId: `page-${id}` } as IndexDoc);

      // 索引页面内容 blocks
      try {
        const pageData = await storage.loadPage(id);
        if (pageData?.blocks) {
          for (const block of pageData.blocks) {
            const text = (block.props.textContent as string) || "";
            if (!text.trim()) continue;

            const blockEntry: SearchIndexEntry = {
              pageId: id,
              pageTitle: page.title,
              pageIcon: page.icon,
              blockId: block.id,
              text,
              type: "block",
            };
            this.entries.set(`block-${block.id}`, blockEntry);
            this.index.add({ ...blockEntry, pageId: `block-${block.id}` } as IndexDoc);
          }
        }
      } catch {
        // 忽略单页加载错误
      }
    }

    this.isBuilt = true;
  }

  /**
   * 搜索
   */
  search(query: string, limit = 20): SearchIndexEntry[] {
    if (!this.index || !this.isBuilt || !query.trim()) return [];

    const results = this.index.search(query, { limit, enrich: true });
    const seen = new Set<string>();
    const output: SearchIndexEntry[] = [];

    for (const resultGroup of results) {
      for (const result of resultGroup.result) {
        const doc = result.doc as unknown as SearchIndexEntry;
        if (!doc) continue;

        // 去重：每个页面只显示一条
        const key = doc.type === "page" ? `page-${doc.pageId}` : doc.pageId;
        if (seen.has(key)) continue;
        seen.add(key);
        output.push(doc);
      }
    }

    // 页面标题匹配优先
    output.sort((a, b) => {
      if (a.type === "page" && b.type === "block") return -1;
      if (a.type === "block" && b.type === "page") return 1;
      return a.pageTitle.localeCompare(b.pageTitle);
    });

    return output;
  }

  /**
   * 增量更新单个页面索引
   */
  async updatePage(pageId: string, page: PageMeta): Promise<void> {
    if (!this.index || !this.isBuilt) return;

    // 移除旧条目
    this.removePageEntries(pageId);

    // 添加新条目
    const pageEntry: SearchIndexEntry = {
      pageId,
      pageTitle: page.title,
      pageIcon: page.icon,
      text: page.title,
      type: "page",
    };
    this.entries.set(`page-${pageId}`, pageEntry);
    this.index.add({ ...pageEntry, pageId: `page-${pageId}` } as IndexDoc);

    const storage = await getStorage();
    const pageData = await storage.loadPage(pageId);
    if (pageData?.blocks) {
      for (const block of pageData.blocks) {
        const text = (block.props.textContent as string) || "";
        if (!text.trim()) continue;
        const blockEntry: SearchIndexEntry = {
          pageId,
          pageTitle: page.title,
          pageIcon: page.icon,
          blockId: block.id,
          text,
          type: "block",
        };
        this.entries.set(`block-${block.id}`, blockEntry);
        this.index.add({ ...blockEntry, pageId: `block-${block.id}` } as IndexDoc);
      }
    }
  }

  /**
   * 移除页面所有索引条目
   */
  private removePageEntries(pageId: string): void {
    for (const [key, entry] of this.entries) {
      if (entry.pageId === pageId) {
        try {
          this.index?.remove(key);
        } catch {
          // 可能不存在
        }
        this.entries.delete(key);
      }
    }
  }

  get isReady(): boolean {
    return this.isBuilt;
  }
}

// 单例
export const searchIndex = new SearchIndexService();
