"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ContextMenuAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  actions: ContextMenuAction[];
  onClose: () => void;
}

export function ContextMenu({ x, y, actions, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (!menuRef.current) return;
    
    const menu = menuRef.current;
    const padding = 16;
    
    // Reset position first
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    
    // Force reflow to get accurate measurements
    requestAnimationFrame(() => {
      const rect = menu.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width - padding;
      const maxY = window.innerHeight - rect.height - padding;
      
      // Adjust horizontal position
      const finalX = Math.max(padding, Math.min(x, maxX));
      menu.style.left = `${finalX}px`;
      
      // Adjust vertical position
      const finalY = Math.max(padding, Math.min(y, maxY));
      menu.style.top = `${finalY}px`;
    });
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] bg-popover border border-border rounded-lg shadow-lg py-1 animate-in fade-in-0 zoom-in-95"
      style={{ left: x, top: y }}
    >
      {actions.map((action, i) =>
        action.divider ? (
          <div key={i} className="my-1 h-px bg-border" />
        ) : (
          <button
            key={i}
            onClick={() => { action.onClick(); onClose(); }}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors",
              action.danger
                ? "text-destructive hover:bg-destructive/10"
                : "text-foreground hover:bg-accent"
            )}
          >
            <span className="w-4 h-4 shrink-0">{action.icon}</span>
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
