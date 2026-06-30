/**
 * useSaveIndicator.ts — 保存状态指示组件
 *
 * 提供轻量级的 "自动保存中..." / "已保存至本地" 交互提示。
 * 使用 React 19 的 useTransition 风格集成。
 */

import { useEffect, useState, useRef, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────

export type SaveIndicatorState = "saving" | "saved" | "error" | "idle";

interface SaveIndicatorConfig {
  /** 显示 "已保存" 的持续时长（ms），之后自动隐藏 */
  savedDisplayDuration?: number;
  /** 显示 "保存出错" 的持续时长（ms） */
  errorDisplayDuration?: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────

/**
 * 保存状态指示逻辑 Hook
 *
 * 接收上游的 saveStatus（来自 AutoSaveEngine 或 Zustand），
 * 提供可展示的文本、是否可见、用于过渡动画的状态。
 *
 * @param saveStatus - 来自 store 的保存状态
 * @param config - 可选的展示时长配置
 * @returns 用于 UI 渲染的指示数据
 */
export function useSaveIndicator(
  saveStatus: SaveIndicatorState,
  config: SaveIndicatorConfig = {}
): {
  /** 展示给用户的文本 */
  label: string;
  /** 可见性标志（用于 CSS transition） */
  visible: boolean;
  /** 语义类型，用于区分颜色/图标 */
  variant: "info" | "success" | "error" | "hidden";
} {
  const {
    savedDisplayDuration = 2000,
    errorDisplayDuration = 4000,
  } = config;

  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");
  const [variant, setVariant] = useState<
    "info" | "success" | "error" | "hidden"
  >("hidden");
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 清除之前的隐藏定时器
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    switch (saveStatus) {
      case "saving": {
        setLabel("自动保存中...");
        setVariant("info");
        setVisible(true);
        break;
      }
      case "saved": {
        setLabel("已保存至本地");
        setVariant("success");
        setVisible(true);
        hideTimerRef.current = setTimeout(() => {
          setVisible(false);
        }, savedDisplayDuration);
        break;
      }
      case "error": {
        setLabel("保存出错，将自动重试");
        setVariant("error");
        setVisible(true);
        hideTimerRef.current = setTimeout(() => {
          setVisible(false);
        }, errorDisplayDuration);
        break;
      }
      case "idle":
      default: {
        setVisible(false);
        break;
      }
    }

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [saveStatus, savedDisplayDuration, errorDisplayDuration]);

  return { label, visible, variant };
}

// ─── React Component ─────────────────────────────────────────────────

const indicatorStyles: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  info: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", icon: "○" },
  success: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    icon: "✓",
  },
  error: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400", icon: "✗" },
};

interface SaveIndicatorProps {
  saveStatus: SaveIndicatorState;
  className?: string;
}

/**
 * 保存状态指示 UI 组件
 *
 * 使用 Tailwind CSS 类名，适配 Mantine 的暗色模式。
 * 可选择 Mantine 的 Transition 组件包装以实现淡入淡出。
 *
 * 用法：
 * ```tsx
 * <SaveIndicator saveStatus={saveStatus} />
 * ```
 */
export function SaveIndicator({
  saveStatus,
  className = "",
}: SaveIndicatorProps): ReactNode {
  const { label, visible, variant } = useSaveIndicator(saveStatus);

  if (!visible || variant === "hidden") return null;

  const style =
    indicatorStyles[variant] ?? indicatorStyles.info;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm border border-border transition-opacity duration-300 ${style.bg} ${style.text} ${className}`}
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">{style.icon}</span>
      <span>{label}</span>
    </div>
  );
}
