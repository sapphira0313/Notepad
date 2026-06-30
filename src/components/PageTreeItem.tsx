/**
 * PageTreeItem.tsx — 单个页面树节点组件
 *
 * 支持展开/折叠子页面、右键菜单、点击导航。
 * 对应原 16n_7288zoqtd.js 中的 nx 组件。
 */

"use client";

import React, { useState } from "react";
import { useEditorStore } from "../store/editorStore";
import { EmojiPicker } from "./EmojiPicker";
import {
  FileTextIcon,
  FolderOpenIcon,
  PlusIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  StarIcon,
  StarFilledIcon,
} from "./ColorfulIcons";

interface PageTreeItemProps {
  pageId: string;
  depth: number;
}

export function PageTreeItem({ pageId, depth }: PageTreeItemProps) {
  const page = useEditorStore((s) => s.pages[pageId]);
  const currentPageId = useEditorStore((s) => s.currentPageId);
  const loadPage = useEditorStore((s) => s.loadPage);
  const createPage = useEditorStore((s) => s.createPage);
  const deletePage = useEditorStore((s) => s.deletePage);
  const updatePageMeta = useEditorStore(
    (s) => s.updatePageMeta
  );
  const toggleStar = useEditorStore((s) => s.toggleStar);

  const [expanded, setExpanded] = useState(depth < 1);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [emojiPicker, setEmojiPicker] = useState<{
    x: number;
    y: number;
  } | null>(null);

  if (!page) return null;

  const isActive = currentPageId === pageId;
  const hasChildren = page.childIds.length > 0;
  const hasCustomIcon = page.icon && page.icon !== "📄";

  const handleSelect = () => {
    loadPage(pageId);
  };

  const handleNewChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    createPage(pageId);
  };

  const handleContextMenu = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleRename = () => {
    const newTitle = prompt("输入新标题：", page.title);
    if (newTitle) {
      updatePageMeta(pageId, { title: newTitle });
    }
    setContextMenu(null);
  };

  const handleDelete = () => {
    if (
      confirm("确定要删除这个页面吗？子页面也会一并删除。")
    ) {
      deletePage(pageId);
    }
    setContextMenu(null);
  };

  return (
    <div>
      {/* ── 页面行 ── */}
      <div
        onClick={handleSelect}
        onContextMenu={handleContextMenu}
        className={`group flex items-center gap-1.5 py-1 px-2 mx-1.5 rounded-lg cursor-pointer transition-colors select-none ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
        }`}
        style={{ paddingLeft: `${10 * depth + 8}px` }}
      >
        {/* 展开/折叠按钮 */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="p-0.5 rounded hover:bg-sidebar-accent shrink-0"
          >
            {expanded ? (
              <ChevronDownIcon size={16} />
            ) : (
              <ChevronRightIcon size={16} />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* 图标 */}
        <div
          className="w-7 h-7 flex items-center justify-center shrink-0"
        >
          {hasChildren ? (
            <FolderOpenIcon size={16} />
          ) : hasCustomIcon ? (
            <span className="text-sm">{page.icon}</span>
          ) : (
            <FileTextIcon size={16} />
          )}
        </div>

        {/* 标题 */}
        <span className="text-sm truncate flex-1">
          {page.title}
        </span>

        {/* 新建子页面按钮 */}
        <button
          onClick={handleNewChild}
          className="hidden group-hover:flex p-1 rounded hover:bg-sidebar-accent shrink-0"
          title="新建子页面"
        >
          <PlusIcon size={16} />
        </button>
      </div>

      {/* ── 子页面列表 ── */}
      {expanded && hasChildren && (
        <div>
          {page.childIds.map((childId) => (
            <PageTreeItem
              key={childId}
              pageId={childId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* ── 右键菜单 ── */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          items={[
            {
              label: "新建子页面",
              icon: <PlusIcon size={16} />,
              onClick: () => {
                createPage(pageId);
                setContextMenu(null);
              },
            },
            {
              label: "重命名",
              icon: <FileTextIcon size={16} />,
              onClick: handleRename,
            },
            {
              label: "修改图标",
              icon: <span className="w-4 h-4 flex items-center justify-center text-lg">{page.icon || "📄"}</span>,
              onClick: () => {
                setEmojiPicker({ x: contextMenu!.x, y: contextMenu!.y });
                setContextMenu(null);
              },
            },
            {
              label: page.isStarred ? "取消收藏" : "添加收藏",
              icon: page.isStarred ? <StarFilledIcon size={16} /> : <StarIcon size={16} />,
              onClick: () => {
                toggleStar(pageId);
                setContextMenu(null);
              },
            },
            { label: "", icon: null, onClick: () => {}, divider: true },
            {
              label: "删除",
              icon: <TrashIcon />,
              onClick: handleDelete,
              danger: true,
            },
          ]}
        />
      )}

      {emojiPicker && (
        <EmojiPicker
          onSelect={(emoji) => {
            updatePageMeta(pageId, { icon: emoji });
          }}
          onClose={() => setEmojiPicker(null)}
          position={emojiPicker}
          currentEmoji={page.icon || ""}
        />
      )}
    </div>
  );
}

// ─── 右键菜单 ─────────────────────────────────────────────────────

interface ContextMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  divider?: boolean;
  danger?: boolean;
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  // 自适应：避免溢出视口
  React.useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        menuRef.current.style.left = `${x - rect.width}px`;
      }
      if (rect.bottom > window.innerHeight) {
        menuRef.current.style.top = `${y - rect.height}px`;
      }
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] bg-popover border border-border rounded-lg shadow-lg py-1 animate-in fade-in-0 zoom-in-95"
      style={{ left: x, top: y }}
    >
      {items.map((item, idx) =>
        item.divider ? (
          <div
            key={idx}
            className="my-1 h-px bg-border"
          />
        ) : (
          <button
            key={idx}
            onClick={item.onClick}
            className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
              item.danger
                ? "text-destructive hover:bg-destructive/10"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <span className="w-4 h-4 shrink-0">
              {item.icon}
            </span>
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
