"use client";

import { useDatabaseStore } from "@/stores/useDatabaseStore";
import type { DatabaseSchema, DatabaseView as DBView } from "@/types/database";
import { Plus } from "lucide-react";

export function KanbanView({ db, view }: { db: DatabaseSchema; view: DBView }) {
  const updateCellValue = useDatabaseStore((s) => s.updateCellValue);
  const addRow = useDatabaseStore((s) => s.addRow);

  const groupByProp = db.properties.find(
    (p) => p.type === "select" && view.config.groupByPropertyId
      ? p.id === view.config.groupByPropertyId
      : p.type === "select"
  );

  if (!groupByProp || !groupByProp.options) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        看板视图需要一个"选择"类型的属性进行分组
      </div>
    );
  }

  const titleProp = db.properties.find((p) => p.type === "title");
  const groups: Record<string, typeof db.rows> = {};
  groupByProp.options.forEach((opt) => { groups[opt.name] = []; });
  groups["未分组"] = [];

  db.rows.forEach((row) => {
    const val = (row.properties[groupByProp.id] as string) || "";
    if (groups[val]) groups[val].push(row);
    else groups["未分组"].push(row);
  });

  return (
    <div className="flex gap-3 p-3 overflow-x-auto">
      {Object.entries(groups).map(([groupName, rows]) => {
        const option = groupByProp.options?.find((o) => o.name === groupName);
        return (
          <div key={groupName} className="min-w-[200px] flex-1 bg-muted/20 rounded-lg p-2">
            <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: option?.color || "#999" }}
              />
              <span className="text-xs font-medium">{groupName}</span>
              <span className="text-xs text-muted-foreground">{rows.length}</span>
            </div>
            <div className="space-y-1.5">
              {rows.map((row) => (
                <div key={row.id} className="bg-background border border-border rounded-md p-2 text-sm shadow-sm">
                  {titleProp ? (
                    <input
                      value={(row.properties[titleProp.id] as string) || ""}
                      onChange={(e) => updateCellValue(db.id, row.id, titleProp.id, e.target.value)}
                      className="w-full bg-transparent outline-none text-sm font-medium"
                    />
                  ) : (
                    <span className="text-muted-foreground">无标题</span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => addRow(db.id)}
              className="w-full mt-2 flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent/50 rounded transition-colors"
            >
              <Plus className="w-3 h-3" /> 添加
            </button>
          </div>
        );
      })}
    </div>
  );
}
