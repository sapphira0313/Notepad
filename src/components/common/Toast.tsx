"use client";

import { useUIStore } from "@/stores/useUIStore";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  const icons = {
    success: <CheckCircle className="w-4 h-4" />,
    error: <XCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg",
            "min-w-[280px] max-w-[400px] animate-slide-in-right",
            colors[toast.type]
          )}
        >
          <span className={cn("shrink-0", iconColors[toast.type])}>
            {icons[toast.type]}
          </span>
          <span className="text-sm font-medium flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className={cn(
              "p-1 rounded hover:bg-black/5 transition-colors",
              toast.type === "success" ? "hover:bg-green-100" : "",
              toast.type === "error" ? "hover:bg-red-100" : "",
              toast.type === "info" ? "hover:bg-blue-100" : ""
            )}
            aria-label="关闭提示"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}