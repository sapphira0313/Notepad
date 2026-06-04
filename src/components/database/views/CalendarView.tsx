"use client";

import { useState } from "react";
import type { DatabaseSchema, DatabaseView as DBView } from "@/types/database";

export function CalendarView({ db }: { db: DatabaseSchema; view: DBView }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateProp = db.properties.find((p) => p.type === "date");
  const titleProp = db.properties.find((p) => p.type === "title");

  if (!dateProp) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        日历视图需要一个"日期"类型的属性
      </div>
    );
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getRowsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return db.rows.filter((r) => r.properties[dateProp.id] === dateStr);
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1))}
          className="px-2 py-1 text-sm rounded hover:bg-accent"
        >←</button>
        <span className="text-sm font-medium">{year}年 {month + 1}月</span>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1))}
          className="px-2 py-1 text-sm rounded hover:bg-accent"
        >→</button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
          <div key={d} className="bg-muted/30 px-2 py-1 text-xs font-medium text-center text-muted-foreground">{d}</div>
        ))}
        {days.map((day, i) => (
          <div key={i} className="bg-background min-h-[80px] p-1">
            {day && (
              <>
                <div className="text-xs text-muted-foreground mb-1">{day}</div>
                {getRowsForDay(day).map((row) => (
                  <div key={row.id} className="text-xs bg-accent/30 rounded px-1 py-0.5 mb-0.5 truncate">
                    {titleProp ? (row.properties[titleProp.id] as string) || "无标题" : "无标题"}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
