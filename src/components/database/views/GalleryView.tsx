"use client";

import { useDatabaseStore } from "@/stores/useDatabaseStore";
import type { DatabaseSchema, DatabaseView as DBView } from "@/types/database";
import { Plus, FileText } from "lucide-react";

export function GalleryView({ db }: { db: DatabaseSchema; view: DBView }) {
  const titleProp = db.properties.find((p) => p.type === "title");
  const updateCellValue = useDatabaseStore((s) => s.updateCellValue);
  const addRow = useDatabaseStore((s) => s.addRow);

  return (
    <div className="p-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {db.rows.map((row) => (
          <div key={row.id} className="border border-border rounded-lg overflow-hidden bg-background hover:shadow-md transition-shadow">
            <div className="h-24 bg-muted/30 flex items-center justify-center">
              <FileText className="w-6 h-6 text-muted-foreground/30" aria-hidden="true" />
            </div>
            <div className="p-2">
              {titleProp ? (
                <input
                  value={(row.properties[titleProp.id] as string) || ""}
                  onChange={(e) => updateCellValue(db.id, row.id, titleProp.id, e.target.value)}
                  className="w-full bg-transparent outline-none text-sm font-medium"
                />
              ) : (
                <span className="text-sm text-muted-foreground">无标题</span>
              )}
            </div>
          </div>
        ))}
        <button
          onClick={() => addRow(db.id)}
          className="border border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-muted/20 transition-colors min-h-[140px]"
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs">新建</span>
        </button>
      </div>
    </div>
  );
}
