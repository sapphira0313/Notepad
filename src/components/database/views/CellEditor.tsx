"use client";

import type { PropertySchema, PropertyValue } from "@/types/database";

export function CellEditor({
  prop, value, onChange,
}: {
  prop: PropertySchema;
  value: PropertyValue;
  onChange: (val: PropertyValue) => void;
}) {
  switch (prop.type) {
    case "title":
    case "text":
      return (
        <input
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm py-0.5"
          placeholder={prop.type === "title" ? "无标题" : ""}
        />
      );
    case "number":
      return (
        <input
          type="number"
          value={(value as number) || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent outline-none text-sm py-0.5"
        />
      );
    case "checkbox":
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded"
        />
      );
    case "select":
      return (
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none text-sm py-0.5 cursor-pointer"
        >
          <option value="">未选择</option>
          {prop.options?.map((opt) => (
            <option key={opt.id} value={opt.name}>{opt.name}</option>
          ))}
        </select>
      );
    case "date":
      return (
        <input
          type="date"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none text-sm py-0.5"
        />
      );
    case "url":
      return (
        <input
          type="url"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm py-0.5 text-blue-500"
          placeholder="https://"
        />
      );
    default:
      return <span className="text-sm text-muted-foreground">{String(value ?? "")}</span>;
  }
}
