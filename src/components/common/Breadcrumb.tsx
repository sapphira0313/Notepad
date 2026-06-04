"use client";

import { usePageStore } from "@/stores/usePageStore";
import { ChevronRight, FileText } from "lucide-react";

export function Breadcrumb() {
  const currentPageId = usePageStore((s) => s.currentPageId);
  const pages = usePageStore((s) => s.pages);
  const loadPage = usePageStore((s) => s.loadPage);

  if (!currentPageId) return null;

  // Build breadcrumb trail
  const trail: Array<{ id: string; title: string; icon?: string }> = [];
  let current: string | null = currentPageId;
  while (current) {
    const page: { id: string; title: string; icon?: string; parentId: string | null } | undefined = pages[current];
    if (!page) break;
    trail.unshift({ id: page.id, title: page.title, icon: page.icon });
    current = page.parentId;
  }

  return (
    <nav aria-label="面包屑导航" className="flex items-center gap-1 text-sm text-muted-foreground flex-1 min-w-0 overflow-hidden">
      {trail.map((item, i) => (
        <span key={item.id} className="flex items-center gap-1 shrink-0">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" aria-hidden="true" />}
          <button
            onClick={() => loadPage(item.id)}
            aria-label={`导航到 ${item.title}`}
            className="flex items-center gap-1 hover:text-foreground transition-colors truncate max-w-[150px]"
          >
            {item.icon ? (
              <span className="shrink-0">{item.icon}</span>
            ) : (
              <FileText className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
            )}
            <span className={i === trail.length - 1 ? "font-medium text-foreground truncate" : "truncate"}>
              {item.title}
            </span>
          </button>
        </span>
      ))}
    </nav>
  );
}
