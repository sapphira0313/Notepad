"use client";

import { useState } from "react";
import { useDatabaseStore } from "@/stores/useDatabaseStore";
import { Table, Columns3, Calendar, LayoutGrid, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableView } from "./views/TableView";
import { KanbanView } from "./views/KanbanView";
import { CalendarView } from "./views/CalendarView";
import { GalleryView } from "./views/GalleryView";

interface DatabaseViewProps {
  databaseId: string;
}

export function DatabaseBlock({ databaseId }: DatabaseViewProps) {
  const db = useDatabaseStore((s) => s.databases[databaseId]);
  const [activeViewId, setActiveViewId] = useState<string | null>(
    db?.views[0]?.id || null
  );

  if (!db) {
    return (
      <div className="border border-border rounded-lg p-4 text-center text-muted-foreground">
        数据库不存在
      </div>
    );
  }

  const activeView = db.views.find((v) => v.id === activeViewId) || db.views[0];

  return (
    <div className="border border-border rounded-lg overflow-hidden my-4">
      {/* Header + View Tabs */}
      <DatabaseHeader db={db} activeViewId={activeView?.id} onViewChange={setActiveViewId} />

      {/* View Content */}
      <div className="p-0">
        {activeView?.type === "table" && <TableView db={db} view={activeView} />}
        {activeView?.type === "kanban" && <KanbanView db={db} view={activeView} />}
        {activeView?.type === "calendar" && <CalendarView db={db} view={activeView} />}
        {activeView?.type === "gallery" && <GalleryView db={db} view={activeView} />}
      </div>
    </div>
  );
}

// ── Database Header（内联，仅此处使用）──────────────────

import type { DatabaseSchema } from "@/types/database";

function DatabaseHeader({
  db, activeViewId, onViewChange,
}: {
  db: DatabaseSchema;
  activeViewId?: string;
  onViewChange: (id: string) => void;
}) {
  const addView = useDatabaseStore((s) => s.addView);
  const updateTitle = useDatabaseStore((s) => s.updateDatabaseTitle);

  const viewIcons: Record<string, React.ReactNode> = {
    table: <Table className="w-3.5 h-3.5" />,
    kanban: <Columns3 className="w-3.5 h-3.5" />,
    calendar: <Calendar className="w-3.5 h-3.5" />,
    gallery: <LayoutGrid className="w-3.5 h-3.5" />,
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
      <input
        value={db.title}
        onChange={(e) => updateTitle(db.id, e.target.value)}
        className="text-sm font-semibold bg-transparent outline-none flex-1 min-w-0"
      />
      <div className="flex items-center gap-1">
        {db.views.map((v) => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            aria-label={`${v.name} 视图`}
            aria-pressed={v.id === activeViewId}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-all duration-200",
              v.id === activeViewId
                ? "bg-primary/10 text-primary font-medium shadow-sm shadow-primary/10"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            {viewIcons[v.type]}
            {v.name}
          </button>
        ))}
        <button
          onClick={() => addView(db.id, "看板", "kanban")}
          aria-label="添加视图"
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="添加视图"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
