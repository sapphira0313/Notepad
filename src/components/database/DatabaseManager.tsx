"use client";

import { useDatabaseStore } from "@/stores/useDatabaseStore";
import { DatabaseBlock } from "./DatabaseBlock";
import { Plus, Table, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function DatabaseManager() {
  const databases = useDatabaseStore((s) => s.databases);
  const createDatabase = useDatabaseStore((s) => s.createDatabase);
  const deleteDatabase = useDatabaseStore((s) => s.deleteDatabase);
  const [activeDbId, setActiveDbId] = useState<string | null>(null);

  const dbIds = Object.keys(databases);

  const handleCreate = async () => {
    const id = await createDatabase();
    setActiveDbId(id);
  };

  return (
    <div className="min-h-full bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-background sticky top-12 z-10">
        <div className="max-w-5xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Table className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-xl font-semibold font-[var(--font-heading)]">表格</h1>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建表格
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-6">
        {/* Database List */}
        {dbIds.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/5 flex items-center justify-center">
              <Table className="w-10 h-10 text-primary/30" aria-hidden="true" />
            </div>
            <p className="text-lg font-medium font-[var(--font-heading)]">暂无表格</p>
            <p className="text-sm mt-1 text-muted-foreground/70">创建一个表格来管理你的数据</p>
            <button
              onClick={handleCreate}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              创建表格
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab selector */}
            <div className="flex gap-2 flex-wrap">
              {dbIds.map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveDbId(id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors",
                    activeDbId === id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  <Table className="w-4 h-4" />
                  {databases[id].title}
                </button>
              ))}
            </div>

            {/* Active Database */}
            {activeDbId && databases[activeDbId] && (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h2 className="font-medium font-[var(--font-heading)]">{databases[activeDbId].title}</h2>
                  <button
                    onClick={() => {
                    if (confirm("确定要删除这个表格吗？")) {
                      deleteDatabase(activeDbId).then(() => setActiveDbId(null));
                    }
                  }}
                    className="flex items-center gap-1 text-sm text-destructive hover:bg-destructive/10 px-2 py-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    删除
                  </button>
                </div>
                <DatabaseBlock databaseId={activeDbId} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
