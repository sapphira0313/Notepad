"use client";

import { useState, useMemo, useCallback } from "react";
import { useDatabaseStore } from "@/stores/useDatabaseStore";
import type { DatabaseSchema, DatabaseView as DBView, DatabaseRow, SortRule, FilterRule, PropertyValue } from "@/types/database";
import { Plus, Trash2, X, ArrowUpDown, Filter, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyTypeIcon } from "./PropertyTypeIcon";
import { CellEditor } from "./CellEditor";

function compareValues(a: PropertyValue, b: PropertyValue): number {
  if (a === b) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

export function TableView({ db, view }: { db: DatabaseSchema; view: DBView }) {
  const addRow = useDatabaseStore((s) => s.addRow);
  const removeRow = useDatabaseStore((s) => s.removeRow);
  const updateCellValue = useDatabaseStore((s) => s.updateCellValue);
  const addProperty = useDatabaseStore((s) => s.addProperty);
  const removeProperty = useDatabaseStore((s) => s.removeProperty);
  const reorderRows = useDatabaseStore((s) => s.reorderRows);
  const updateViewConfig = useDatabaseStore((s) => s.updateViewConfig);

  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterPropId, setFilterPropId] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [dragOverRowId, setDragOverRowId] = useState<string | null>(null);

  const visibleProps = db.properties.filter((p) => view.visiblePropertyIds.includes(p.id));
  const sortRules = view.config.sortRules ?? [];
  const filterRules = view.config.filterRules ?? [];

  // Apply sort & filter
  const processedRows = useMemo(() => {
    let rows = [...db.rows];

    // Filter
    if (filterRules.length > 0) {
      rows = rows.filter((row) =>
        filterRules.every((rule) => {
          const val = row.properties[rule.propertyId];
          const strVal = String(val ?? "").toLowerCase();
          const ruleVal = String(rule.value ?? "").toLowerCase();
          switch (rule.operator) {
            case "contains": return strVal.includes(ruleVal);
            case "notContains": return !strVal.includes(ruleVal);
            case "equals": return strVal === ruleVal;
            case "notEquals": return strVal !== ruleVal;
            case "gt": return Number(val) > Number(rule.value);
            case "lt": return Number(val) < Number(rule.value);
            case "isEmpty": return !val || String(val).trim() === "";
            case "isNotEmpty": return !!val && String(val).trim() !== "";
            default: return true;
          }
        })
      );
    }

    // Sort
    if (sortRules.length > 0) {
      rows.sort((a, b) => {
        for (const rule of sortRules) {
          const aVal = a.properties[rule.propertyId];
          const bVal = b.properties[rule.propertyId];
          const cmp = compareValues(aVal, bVal);
          if (cmp !== 0) return rule.direction === "asc" ? cmp : -cmp;
        }
        return 0;
      });
    }

    return rows;
  }, [db.rows, sortRules, filterRules]);

  const handleAddSort = useCallback((propId: string) => {
    const newRules: SortRule[] = [...sortRules.filter((r) => r.propertyId !== propId), { propertyId: propId, direction: "asc" }];
    updateViewConfig(db.id, view.id, { sortRules: newRules });
    setShowSortMenu(false);
  }, [sortRules, db.id, view.id, updateViewConfig]);

  const handleToggleSortDir = useCallback((propId: string) => {
    const newRules = sortRules.map((r) =>
      r.propertyId === propId ? { ...r, direction: r.direction === "asc" ? "desc" as const : "asc" as const } : r
    );
    updateViewConfig(db.id, view.id, { sortRules: newRules });
  }, [sortRules, db.id, view.id, updateViewConfig]);

  const handleRemoveSort = useCallback((propId: string) => {
    updateViewConfig(db.id, view.id, { sortRules: sortRules.filter((r) => r.propertyId !== propId) });
  }, [sortRules, db.id, view.id, updateViewConfig]);

  const handleAddFilter = useCallback(() => {
    if (!filterPropId) return;
    const newRule: FilterRule = { propertyId: filterPropId, operator: "contains", value: filterValue };
    updateViewConfig(db.id, view.id, { filterRules: [...filterRules, newRule] });
    setFilterPropId("");
    setFilterValue("");
  }, [filterPropId, filterValue, filterRules, db.id, view.id, updateViewConfig]);

  const handleRemoveFilter = useCallback((index: number) => {
    updateViewConfig(db.id, view.id, { filterRules: filterRules.filter((_, i) => i !== index) });
  }, [filterRules, db.id, view.id, updateViewConfig]);

  // Row drag handlers
  const handleRowDragStart = useCallback((e: React.DragEvent, rowId: string) => {
    e.dataTransfer.setData("text/plain", rowId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleRowDragOver = useCallback((e: React.DragEvent, rowId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverRowId(rowId);
  }, []);

  const handleRowDrop = useCallback(async (e: React.DragEvent, targetRowId: string) => {
    e.preventDefault();
    const draggedRowId = e.dataTransfer.getData("text/plain");
    if (!draggedRowId || draggedRowId === targetRowId) { setDragOverRowId(null); return; }
    const fromIndex = db.rows.findIndex((r) => r.id === draggedRowId);
    const toIndex = db.rows.findIndex((r) => r.id === targetRowId);
    if (fromIndex >= 0 && toIndex >= 0) {
      await reorderRows(db.id, fromIndex, toIndex);
    }
    setDragOverRowId(null);
  }, [db.rows, db.id, reorderRows]);

  const renderRow = (row: DatabaseRow) => (
    <tr
      key={row.id}
      draggable
      onDragStart={(e) => handleRowDragStart(e, row.id)}
      onDragOver={(e) => handleRowDragOver(e, row.id)}
      onDrop={(e) => handleRowDrop(e, row.id)}
      className={cn(
        "border-b border-border/50 hover:bg-muted/10 group transition-colors",
        dragOverRowId === row.id && "ring-2 ring-primary/30 bg-primary/5"
      )}
    >
      <td className="px-1 py-1.5 w-8">
        <div className="flex items-center gap-0.5">
          <GripVertical className="w-3 h-3 text-muted-foreground/30 cursor-grab group-hover:text-muted-foreground/60" />
          <button
            onClick={() => removeRow(db.id, row.id)}
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
      {visibleProps.map((prop) => (
        <td key={prop.id} className="px-3 py-1.5">
          <CellEditor
            prop={prop}
            value={row.properties[prop.id]}
            onChange={(val) => updateCellValue(db.id, row.id, prop.id, val)}
          />
        </td>
      ))}
      <td></td>
    </tr>
  );

  return (
    <div className="overflow-x-auto">
      {/* Sort/Filter Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/40 bg-muted/10">
        {/* Sort button */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors",
              sortRules.length > 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent/60"
            )}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            排序 {sortRules.length > 0 && `(${sortRules.length})`}
          </button>
          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowSortMenu(false)} />
              <div className="absolute left-0 top-full mt-1 z-40 w-64 bg-popover border border-border rounded-xl shadow-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-2">排序规则</p>
                {sortRules.map((rule) => {
                  const prop = db.properties.find((p) => p.id === rule.propertyId);
                  return (
                    <div key={rule.propertyId} className="flex items-center gap-2 mb-2">
                      <span className="text-xs flex-1 truncate">{prop?.name}</span>
                      <button
                        onClick={() => handleToggleSortDir(rule.propertyId)}
                        className="p-1 rounded hover:bg-accent text-xs flex items-center gap-1"
                      >
                        {rule.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {rule.direction === "asc" ? "升序" : "降序"}
                      </button>
                      <button onClick={() => handleRemoveSort(rule.propertyId)} className="p-1 rounded hover:bg-destructive/10 text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                <div className="border-t border-border/40 pt-2 mt-2">
                  <p className="text-xs text-muted-foreground mb-1">添加排序</p>
                  {visibleProps.filter((p) => !sortRules.some((r) => r.propertyId === p.id)).map((prop) => (
                    <button
                      key={prop.id}
                      onClick={() => handleAddSort(prop.id)}
                      className="w-full text-left px-2 py-1 text-xs rounded hover:bg-accent/60 transition-colors"
                    >
                      {prop.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filter button */}
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors",
              filterRules.length > 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent/60"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            筛选 {filterRules.length > 0 && `(${filterRules.length})`}
          </button>
          {showFilterMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowFilterMenu(false)} />
              <div className="absolute left-0 top-full mt-1 z-40 w-72 bg-popover border border-border rounded-xl shadow-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-2">筛选规则</p>
                {filterRules.map((rule, i) => {
                  const prop = db.properties.find((p) => p.id === rule.propertyId);
                  return (
                    <div key={i} className="flex items-center gap-2 mb-2 text-xs">
                      <span className="truncate flex-1">{prop?.name}</span>
                      <span className="text-muted-foreground">{rule.operator}</span>
                      <span className="font-medium">{String(rule.value ?? "")}</span>
                      <button onClick={() => handleRemoveFilter(i)} className="p-1 rounded hover:bg-destructive/10 text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                <div className="border-t border-border/40 pt-2 mt-2">
                  <p className="text-xs text-muted-foreground mb-1">添加筛选</p>
                  <div className="flex gap-2">
                    <select
                      value={filterPropId}
                      onChange={(e) => setFilterPropId(e.target.value)}
                      className="flex-1 text-xs bg-background border border-border/60 rounded-lg px-2 py-1.5 outline-none"
                    >
                      <option value="">选择属性</option>
                      {visibleProps.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      placeholder="值"
                      className="flex-1 text-xs bg-background border border-border/60 rounded-lg px-2 py-1.5 outline-none"
                    />
                    <button
                      onClick={handleAddFilter}
                      disabled={!filterPropId}
                      className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
                    >
                      添加
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {(sortRules.length > 0 || filterRules.length > 0) && (
          <button
            onClick={() => updateViewConfig(db.id, view.id, { sortRules: [], filterRules: [] })}
            className="text-xs text-muted-foreground/60 hover:text-foreground ml-auto transition-colors"
          >
            清除全部
          </button>
        )}
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/20">
            <th className="w-8 px-1 py-2"></th>
            {visibleProps.map((prop) => {
              const sortRule = sortRules.find((r) => r.propertyId === prop.id);
              return (
                <th key={prop.id} className="px-3 py-2 text-left font-medium text-muted-foreground text-xs whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <PropertyTypeIcon type={prop.type} />
                    <button
                      onClick={() => sortRule ? handleToggleSortDir(prop.id) : handleAddSort(prop.id)}
                      className="hover:text-foreground transition-colors"
                    >
                      {prop.name}
                    </button>
                    {sortRule && (
                      <span className="text-primary">
                        {sortRule.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      </span>
                    )}
                    {prop.type !== "title" && (
                      <button
                        onClick={() => removeProperty(db.id, prop.id)}
                        className="ml-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              );
            })}
            <th className="px-2 py-2">
              <button
                onClick={() => addProperty(db.id, "新属性", "text")}
                className="p-1 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title="添加属性"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {processedRows.map(renderRow)}
        </tbody>
      </table>

      {processedRows.length === 0 && db.rows.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-6">没有匹配的行</p>
      )}

      <button
        onClick={() => addRow(db.id)}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-muted/30 transition-colors"
      >
        <Plus className="w-4 h-4" />
        新建行
      </button>
    </div>
  );
}
