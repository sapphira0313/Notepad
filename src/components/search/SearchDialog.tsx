"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { usePageStore } from "@/stores/usePageStore";
import { useUIStore } from "@/stores/useUIStore";
import { Search, FileText, X, Clock, ArrowRight } from "lucide-react";
import { searchIndex, type SearchIndexEntry } from "@/lib/searchIndex";

const RECENT_SEARCHES_KEY = "recent-searches";
const MAX_RECENT = 5;

interface SearchResult {
  id: string;
  title: string;
  icon?: string;
  snippet: string;
  type: "page" | "block";
}

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (!query.trim()) return;
  const recent = getRecentSearches().filter((s) => s !== query);
  recent.unshift(query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export function SearchDialog() {
  const open = useUIStore((s) => s.searchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const pages = usePageStore((s) => s.pages);
  const loadPage = usePageStore((s) => s.loadPage);

  // 打开时聚焦输入框 + 加载历史
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // 构建/更新搜索索引
  useEffect(() => {
    if (open && !searchIndex.isReady) {
      searchIndex.buildIndex(pages).catch(console.error);
    }
  }, [open, pages]);

  // 预计算分类结果（避免多次 filter）
  const pageResults = useMemo(() => results.filter((r) => r.type === "page"), [results]);
  const blockResults = useMemo(() => results.filter((r) => r.type === "block"), [results]);

  // 搜索逻辑：优先使用索引，降级到线性扫描
  const doSearch = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }

      if (searchIndex.isReady) {
        const indexed = searchIndex.search(q, 20);
        setResults(indexed.map((entry) => ({
          id: entry.pageId,
          title: entry.pageTitle,
          icon: entry.pageIcon,
          snippet: entry.type === "block" ? entry.text.slice(0, 80) : entry.pageTitle,
          type: entry.type,
        })));
        setSelectedIndex(0);
        return;
      }

      // 降级：线性扫描标题
      const lowerQuery = q.toLowerCase();
      const fallback: SearchResult[] = [];
      for (const [id, page] of Object.entries(pages)) {
        if (page.title.toLowerCase().includes(lowerQuery)) {
          fallback.push({ id, title: page.title, icon: page.icon, snippet: page.title, type: "page" });
        }
      }
      setResults(fallback);
      setSelectedIndex(0);
    },
    [pages]
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      doSearch(query);
    }, 100);
    return () => clearTimeout(debounce);
  }, [query, doSearch]);

  const handleSelect = async (pageId: string) => {
    saveRecentSearch(query);
    await loadPage(pageId);
    useUIStore.getState().setActiveView("page");
    closeSearch();
    setQuery("");
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex].id);
    }
  };

  if (!open) return null;

  const showRecent = !query.trim() && recentSearches.length > 0;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={closeSearch} aria-hidden="true" />
      <div
        className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 sm:px-0"
        role="dialog"
        aria-label="搜索文档"
        aria-modal="true"
      >
        <div className="bg-popover border border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索文档、表格等..."
              aria-label="搜索输入框"
              className="flex-1 bg-transparent outline-none text-base"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="清除搜索"
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <button
              onClick={closeSearch}
              aria-label="关闭搜索"
              className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
            >
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] border border-border/60">Esc</kbd>
            </button>
          </div>

          {/* Recent Searches */}
          {showRecent && (
            <div className="border-t border-border/60">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground">最近搜索</span>
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  aria-label="清除搜索历史"
                >
                  清除
                </button>
              </div>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleRecentClick(term)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/50 transition-colors"
                >
                  <Clock className="w-4 h-4 text-muted-foreground/40 shrink-0" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground truncate flex-1">{term}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          {query.trim() && (
            <div className="max-h-[350px] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-8 py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground/20 mb-3" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">未找到匹配的内容</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">尝试其他关键词</p>
                </div>
              ) : (
                <>
                  {/* Page matches */}
                  {pageResults.length > 0 && (
                    <>
                      <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
                        文档 ({pageResults.length})
                      </div>
                      {pageResults.map((result) => {
                        const globalIndex = results.indexOf(result);
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              globalIndex === selectedIndex ? "bg-primary/5" : "hover:bg-accent/50"
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-muted-foreground/70" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className={`text-sm font-medium truncate ${
                                globalIndex === selectedIndex ? "text-primary" : ""
                              }`}>
                                {result.title}
                              </div>
                            </div>
                            {globalIndex === selectedIndex && (
                              <span className="text-xs text-muted-foreground">Enter 打开</span>
                            )}
                          </button>
                        );
                      })}
                    </>
                  )}

                  {/* Content matches */}
                  {blockResults.length > 0 && (
                    <>
                      <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
                        内容 ({blockResults.length})
                      </div>
                      {blockResults.map((result) => {
                        const globalIndex = results.indexOf(result);
                        return (
                          <button
                            key={`${result.id}-content`}
                            onClick={() => handleSelect(result.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              globalIndex === selectedIndex ? "bg-primary/5" : "hover:bg-accent/50"
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className={`text-sm font-medium truncate ${
                                globalIndex === selectedIndex ? "text-primary" : ""
                              }`}>
                                {result.title}
                              </div>
                              {result.snippet && (
                                <div className="text-xs text-muted-foreground truncate mt-0.5">
                                  {result.snippet}
                                </div>
                              )}
                            </div>
                            {globalIndex === selectedIndex && (
                              <span className="text-xs text-muted-foreground">Enter 打开</span>
                            )}
                          </button>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑↓</kbd> 切换
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↵</kbd> 打开
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd> 关闭
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
