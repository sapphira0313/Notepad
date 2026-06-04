"use client";

import { Type, Hash, ListFilter, CalendarDays, CheckSquare, Link2, FileText } from "lucide-react";

export function PropertyTypeIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    title: <Type className="w-3 h-3" />,
    text: <FileText className="w-3 h-3" />,
    number: <Hash className="w-3 h-3" />,
    select: <ListFilter className="w-3 h-3" />,
    multiSelect: <ListFilter className="w-3 h-3" />,
    date: <CalendarDays className="w-3 h-3" />,
    checkbox: <CheckSquare className="w-3 h-3" />,
    url: <Link2 className="w-3 h-3" />,
  };
  return <span className="text-muted-foreground/70">{icons[type] || <FileText className="w-3 h-3" />}</span>;
}
