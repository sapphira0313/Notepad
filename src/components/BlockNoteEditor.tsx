"use client";

import { useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { SuggestionMenuController } from "@blocknote/react";
import { type BlockNoteEditor as BlockNoteEditorType } from "@blocknote/core";
import { zh } from "@blocknote/core/locales";
import "@blocknote/mantine/style.css";
import { type StoredBlock } from "../lib/storage";
import { TIcon } from "./BlockIcons";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Minus,
  Link,
  SquareCheck,
  Image,
  Video,
  Table,
  Info,
  Highlighter,
  RefreshCw,
  Calculator,
  LayoutTemplate,
  FileText,
  ExternalLink,
  Copy,
  Bell,
  Sheet,
  LayoutGrid,
  Kanban,
  BarChart3,
  ImagePlus,
  Link2,
  Palette,
  Brain,
  GitBranch,
  Box,
  User,
  Users,
  Cloud,
  CheckSquare,
  Vote,
  CalendarClock,
  ClipboardList,
  CalendarDays,
  CalendarRange,
  Globe,
  Timer,
  Puzzle,
  ListTree,
  History,
  PenTool,
} from "lucide-react";

const DEFAULT_BLOCK: StoredBlock = {
  id: "default-paragraph-block",
  type: "paragraph",
  props: {},
  content: [],
  children: [],
};

function getInitialContent(blocks: StoredBlock[] | undefined): StoredBlock[] {
  if (Array.isArray(blocks) && blocks.length > 0) {
    return blocks;
  }
  return [DEFAULT_BLOCK];
}

interface CustomSlashItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  keywords?: string[];
  action?: (editor: BlockNoteEditorType) => void;
  blockType?: string;
  blockProps?: Record<string, any>;
}

const CATEGORY_COLORS: Record<string, string> = {
  基础: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  常用: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  按钮: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  数据: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  多维表格: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  绘图: "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  协作: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  小组件: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
};

const iconSize = 18;

const SLASH_MENU_ITEMS: CustomSlashItem[] = [
  // 基础
  { id: "paragraph", title: "文本", category: "基础", icon: <TIcon size={iconSize} />, keywords: ["文本", "段落"], blockType: "paragraph" },
  { id: "heading1", title: "一级标题", category: "基础", icon: <Heading1 size={iconSize} />, keywords: ["标题", "一级"], blockType: "heading", blockProps: { level: 1 } },
  { id: "heading2", title: "二级标题", category: "基础", icon: <Heading2 size={iconSize} />, keywords: ["标题", "二级"], blockType: "heading", blockProps: { level: 2 } },
  { id: "heading3", title: "三级标题", category: "基础", icon: <Heading3 size={iconSize} />, keywords: ["标题", "三级"], blockType: "heading", blockProps: { level: 3 } },
  { id: "numberedList", title: "有序列表", category: "基础", icon: <ListOrdered size={iconSize} />, keywords: ["列表", "有序"], blockType: "numberedListItem" },
  { id: "bulletList", title: "无序列表", category: "基础", icon: <List size={iconSize} />, keywords: ["列表", "无序"], blockType: "bulletListItem" },
  { id: "codeBlock", title: "代码块", category: "基础", icon: <Code size={iconSize} />, keywords: ["代码", "编程"], blockType: "codeBlock" },
  { id: "quote", title: "引用", category: "基础", icon: <Quote size={iconSize} />, keywords: ["引用", "引佣"], blockType: "quote" },
  { id: "divider", title: "分隔线", category: "基础", icon: <Minus size={iconSize} />, keywords: ["分隔", "分割"] },
  { id: "link", title: "链接", category: "基础", icon: <Link size={iconSize} />, keywords: ["链接", "超链接"], blockType: "paragraph" },

  // 常用
  { id: "task", title: "任务", category: "常用", icon: <SquareCheck size={iconSize} />, keywords: ["任务", "待办"], blockType: "checkListItem", blockProps: { checked: false } },
  { id: "image", title: "图片", category: "常用", icon: <Image size={iconSize} />, keywords: ["图片", "照片"], blockType: "image" },
  { id: "video", title: "视频或文件", category: "常用", icon: <Video size={iconSize} />, keywords: ["视频", "文件"], blockType: "video" },
  { id: "table", title: "表格", category: "常用", icon: <Table size={iconSize} />, keywords: ["表格", "数据"], blockType: "table", blockProps: { columns: 3, rows: 3 } },
  { id: "callout", title: "分档", category: "常用", icon: <Info size={iconSize} />, keywords: ["分档", "提示"], blockType: "quote" },
  { id: "highlight", title: "高亮块", category: "常用", icon: <Highlighter size={iconSize} />, keywords: ["高亮", "标记"] },
  { id: "sync", title: "同步块", category: "常用", icon: <RefreshCw size={iconSize} />, keywords: ["同步", "共享"] },
  { id: "math", title: "公式", category: "常用", icon: <Calculator size={iconSize} />, keywords: ["公式", "数学"] },
  { id: "template", title: "模板", category: "常用", icon: <LayoutTemplate size={iconSize} />, keywords: ["模板", "格式"] },
  { id: "subDoc", title: "子文档", category: "常用", icon: <FileText size={iconSize} />, keywords: ["子文档", "嵌套"] },

  // 按钮
  { id: "externalLink", title: "打开超链接", category: "按钮", icon: <ExternalLink size={iconSize} />, keywords: ["超链接", "打开"] },
  { id: "copyDoc", title: "创建副本", category: "按钮", icon: <Copy size={iconSize} />, keywords: ["副本", "复制"] },
  { id: "follow", title: "关注文档更新", category: "按钮", icon: <Bell size={iconSize} />, keywords: ["关注", "订阅"] },

  // 数据
  { id: "spreadsheet", title: "电子表格", category: "数据", icon: <Sheet size={iconSize} />, keywords: ["电子表格", "Excel"] },

  // 多维表格
  { id: "multiTable", title: "多维表格", category: "多维表格", icon: <LayoutGrid size={iconSize} />, keywords: ["多维", "表格"] },
  { id: "kanban", title: "看板", category: "多维表格", icon: <Kanban size={iconSize} />, keywords: ["看板", "任务板"] },
  { id: "gantt", title: "甘特图", category: "多维表格", icon: <BarChart3 size={iconSize} />, keywords: ["甘特图", "时间线"] },
  { id: "gallery", title: "画册", category: "多维表格", icon: <ImagePlus size={iconSize} />, keywords: ["画册", "相册"] },
  { id: "linkTable", title: "关联已有多维表格", category: "多维表格", icon: <Link2 size={iconSize} />, keywords: ["关联", "链接"] },

  // 绘图
  { id: "canvas", title: "画板", category: "绘图", icon: <Palette size={iconSize} />, keywords: ["画板", "绘图"] },
  { id: "mindmap", title: "思维导图", category: "绘图", icon: <Brain size={iconSize} />, keywords: ["思维导图", "脑图"] },
  { id: "flowchart", title: "流程图", category: "绘图", icon: <GitBranch size={iconSize} />, keywords: ["流程图", "流程"] },
  { id: "uml", title: "UML图", category: "绘图", icon: <Box size={iconSize} />, keywords: ["UML", "建模"] },

  // 协作
  { id: "person", title: "人员", category: "协作", icon: <User size={iconSize} />, keywords: ["人员", "成员"] },
  { id: "group", title: "群名片", category: "协作", icon: <Users size={iconSize} />, keywords: ["群", "名片"] },
  { id: "cloudDoc", title: "云文档", category: "协作", icon: <Cloud size={iconSize} />, keywords: ["云文档", "云端"] },
  { id: "checklist", title: "任务清单", category: "协作", icon: <CheckSquare size={iconSize} />, keywords: ["清单", "任务"] },
  { id: "vote", title: "投票", category: "协作", icon: <Vote size={iconSize} />, keywords: ["投票", "表决"] },
  { id: "dateReminder", title: "日期提醒", category: "协作", icon: <CalendarClock size={iconSize} />, keywords: ["提醒", "日期"] },
  { id: "infoCollect", title: "信息收集", category: "协作", icon: <ClipboardList size={iconSize} />, keywords: ["收集", "表单"] },
  { id: "schedule", title: "日程", category: "协作", icon: <CalendarDays size={iconSize} />, keywords: ["日程", "安排"] },
  { id: "meeting", title: "会议议程", category: "协作", icon: <CalendarRange size={iconSize} />, keywords: ["会议", "议程"] },

  // 小组件
  { id: "webCard", title: "网页卡片", category: "小组件", icon: <Globe size={iconSize} />, keywords: ["网页", "卡片"] },
  { id: "countdown", title: "倒计时", category: "小组件", icon: <Timer size={iconSize} />, keywords: ["倒计时", "计时"] },
  { id: "widget", title: "小组件", category: "小组件", icon: <Puzzle size={iconSize} />, keywords: ["小组件", "插件"] },
  { id: "toc", title: "目录导航", category: "小组件", icon: <ListTree size={iconSize} />, keywords: ["目录", "导航"] },
  { id: "timeline", title: "时间轴", category: "小组件", icon: <History size={iconSize} />, keywords: ["时间轴", "时间线"] },
  { id: "textDraw", title: "文本绘图", category: "小组件", icon: <PenTool size={iconSize} />, keywords: ["绘图", "文本"] },
];

const CATEGORIES = [
  { id: "基础", label: "基础", icon: "📝" },
  { id: "常用", label: "常用", icon: "⭐" },
  { id: "按钮", label: "按钮", icon: "🔘" },
  { id: "数据", label: "数据", icon: "📊" },
  { id: "多维表格", label: "多维表格", icon: "📈" },
  { id: "绘图", label: "绘图", icon: "🎨" },
  { id: "协作", label: "协作", icon: "👥" },
  { id: "小组件", label: "小组件", icon: "🧩" },
];

function CustomSlashMenu({ items, selectedIndex, onItemClick }: {
  items: CustomSlashItem[];
  selectedIndex: number;
  onItemClick: (item: CustomSlashItem) => void;
}) {
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CustomSlashItem[]>);

  return (
    <div className="bg-popover border border-border rounded-xl shadow-2xl min-w-[360px] max-w-[420px] max-h-[720px] overflow-y-auto overflow-x-hidden scrollbar-thin">
      {CATEGORIES.map((category) => {
        const categoryItems = groupedItems[category.id];
        if (!categoryItems || categoryItems.length === 0) return null;
        return (
          <div key={category.id}>
            <div className="px-3.5 py-2 text-xs font-semibold text-muted-foreground/80 flex items-center gap-1.5 tracking-wide">
              <span className="text-sm">{category.icon}</span>
              <span>{category.label}</span>
            </div>
            <div className="px-2 pb-2">
              {categoryItems.map((item) => {
                const globalIndex = items.indexOf(item);
                const isSelected = globalIndex === selectedIndex;
                const iconBgColor = CATEGORY_COLORS[item.category] || "bg-gray-50 text-gray-600";
                return (
                  <button
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-150 text-left group ${
                      isSelected
                        ? "bg-primary/10 text-foreground shadow-sm ring-1 ring-primary/20"
                        : "hover:bg-muted/60 text-foreground"
                    }`}
                  >
                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${iconBgColor}`}>
                      {item.icon}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-tight">{item.title}</div>
                    </div>

                    {isSelected && (
                      <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                        Enter
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BlockNoteEditor({
  pageData,
  onEditorReady,
  onContentChange,
}: {
  pageData: {
    blocks: StoredBlock[];
  } | null;
  onEditorReady: (editor: BlockNoteEditorType) => void;
  onContentChange: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const initialContent = getInitialContent(pageData?.blocks);

  const editor = useCreateBlockNote({
    initialContent: initialContent as any,
    dictionary: zh,
  });

  useEditorChange(onContentChange, editor);

  useEffect(() => {
    if (editor) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  const colorScheme = resolvedTheme === "dark" ? "dark" : "light";

  const handleItemClick = useCallback((item: CustomSlashItem) => {
    try {
      const cursorPos = editor.getTextCursorPosition();
      if (!cursorPos || !cursorPos.block) {
        alert("请先点击编辑区再使用此功能");
        return;
      }
      const currentBlock = cursorPos.block as any;
      
      if (item.action) {
        item.action(editor);
        return;
      }

      const getIsEmptyBlock = (block: any) => {
        const content = block.content as any[] | undefined;
        return !content || content.length === 0 ||
          (content.length === 1 && content[0].type === "text" && !content[0].text);
      };

      // 安全地替换当前块或在其后插入
      const insertOrReplace = (blocks: any[]) => {
        const isEmptyBlock = getIsEmptyBlock(currentBlock);
        if (isEmptyBlock && currentBlock.id) {
          // 先插入新块，再删除空块，避免 replaceBlocks 的 isInGroup 问题
          (editor as any).insertBlocks(blocks, currentBlock, "after");
          // 延迟删除原空块
          setTimeout(() => {
            try {
              (editor as any).removeBlocks([currentBlock]);
            } catch (e) {
              console.warn("removeBlocks failed:", e);
            }
          }, 0);
        } else {
          (editor as any).insertBlocks(blocks, currentBlock, "after");
        }
      };

      // 安全地更新当前块类型
      const updateBlockType = (type: string, props?: any) => {
        const isEmptyBlock = getIsEmptyBlock(currentBlock);
        if (isEmptyBlock) {
          // 使用 insertBlocks + removeBlocks 代替 updateBlock，避免 isInGroup 问题
          (editor as any).insertBlocks(
            [{ type, props, content: currentBlock.content || [] }],
            currentBlock,
            "after"
          );
          setTimeout(() => {
            try {
              (editor as any).removeBlocks([currentBlock]);
            } catch (e) {
              console.warn("removeBlocks failed:", e);
            }
          }, 0);
        } else {
          (editor as any).insertBlocks(
            [{ type, props }],
            currentBlock,
            "after"
          );
        }
      };

      switch (item.id) {
        case "link": {
          const url = prompt("请输入链接地址：", "https://");
          if (url) {
            const selectedText = editor.getSelectedText();
            if (selectedText) {
              (editor as any).createInlineContentLink(url);
            } else {
              (editor as any).insertInlineContent([
                { type: "link", href: url, content: [{ type: "text", text: url, styles: {} }] },
              ]);
            }
          }
          return;
        }

        case "highlight": {
          updateBlockType("quote");
          return;
        }

        case "toc": {
          const blocks = (editor as any).document;
          const headings = blocks.filter((b: any) => b.type === "heading");
          
          const tocBlocks: any[] = [
            {
              type: "paragraph",
              content: [{ type: "text", text: "📑 目录", styles: { bold: true } }],
            },
          ];

          if (headings.length === 0) {
            tocBlocks.push({
              type: "paragraph",
              content: [{ type: "text", text: "暂无标题，添加标题后自动生成目录", styles: { textColor: "grey" } }],
            });
          } else {
            headings.forEach((heading: any, idx: number) => {
              const level = heading.props?.level || 1;
              const text = (heading.content || [])
                .map((c: any) => c.text || "")
                .join("") || `标题 ${idx + 1}`;
              const indent = "　".repeat(level - 1);
              tocBlocks.push({
                type: "paragraph",
                content: [{ type: "text", text: `${indent}${idx + 1}. ${text}`, styles: {} }],
              });
            });
          }

          (editor as any).insertBlocks(tocBlocks, currentBlock, "after");
          return;
        }

        case "checklist": {
          const checklistBlocks = [
            { type: "checkListItem", props: { checked: false }, content: [{ type: "text", text: "任务 1", styles: {} }] },
            { type: "checkListItem", props: { checked: false }, content: [{ type: "text", text: "任务 2", styles: {} }] },
            { type: "checkListItem", props: { checked: false }, content: [{ type: "text", text: "任务 3", styles: {} }] },
          ];
          insertOrReplace(checklistBlocks);
          return;
        }

        case "template": {
          const templateBlocks = [
            {
              type: "heading",
              props: { level: 1 },
              content: [{ type: "text", text: "📋 项目计划", styles: {} }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "项目概述", styles: { bold: true, textColor: "blue" } }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "在这里简要描述项目的背景和目标...", styles: {} }],
            },
            {
              type: "heading",
              props: { level: 2 },
              content: [{ type: "text", text: "任务清单", styles: {} }],
            },
            { type: "checkListItem", props: { checked: false }, content: [{ type: "text", text: "需求分析", styles: {} }] },
            { type: "checkListItem", props: { checked: false }, content: [{ type: "text", text: "方案设计", styles: {} }] },
            { type: "checkListItem", props: { checked: false }, content: [{ type: "text", text: "开发实现", styles: {} }] },
            { type: "checkListItem", props: { checked: false }, content: [{ type: "text", text: "测试验收", styles: {} }] },
            {
              type: "heading",
              props: { level: 2 },
              content: [{ type: "text", text: "时间线", styles: {} }],
            },
            {
              type: "numberedListItem",
              content: [{ type: "text", text: "第一阶段：第 1-2 周", styles: {} }],
            },
            {
              type: "numberedListItem",
              content: [{ type: "text", text: "第二阶段：第 3-4 周", styles: {} }],
            },
            {
              type: "numberedListItem",
              content: [{ type: "text", text: "第三阶段：第 5-6 周", styles: {} }],
            },
          ];
          insertOrReplace(templateBlocks);
          return;
        }

        case "divider": {
          const dividerBlock = {
            type: "paragraph",
            content: [{ type: "text", text: "――――――――――――――――", styles: { textColor: "gray" } }],
          };
          updateBlockType("paragraph", undefined);
          return;
        }

        case "timeline": {
          const timelineBlocks = [
            {
              type: "paragraph",
              content: [{ type: "text", text: "⏱️ 时间轴", styles: { bold: true } }],
            },
            {
              type: "bulletListItem",
              content: [{ type: "text", text: "第 1 阶段 - 项目启动", styles: { bold: true, textColor: "blue" } }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "　　完成需求分析和方案设计", styles: { textColor: "grey" } }],
            },
            {
              type: "bulletListItem",
              content: [{ type: "text", text: "第 2 阶段 - 开发实现", styles: { bold: true, textColor: "green" } }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "　　完成核心功能开发和测试", styles: { textColor: "grey" } }],
            },
            {
              type: "bulletListItem",
              content: [{ type: "text", text: "第 3 阶段 - 上线交付", styles: { bold: true, textColor: "purple" } }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "　　完成部署上线和验收交付", styles: { textColor: "grey" } }],
            },
          ];
          insertOrReplace(timelineBlocks);
          return;
        }

        case "vote": {
          const voteBlocks = [
            {
              type: "paragraph",
              content: [{ type: "text", text: "📊 投票", styles: { bold: true } }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "投票主题：请选择您喜欢的方案", styles: {} }],
            },
            {
              type: "bulletListItem",
              content: [{ type: "text", text: "🅰️ 方案 A - 方案描述", styles: {} }],
            },
            {
              type: "bulletListItem",
              content: [{ type: "text", text: "🅱️ 方案 B - 方案描述", styles: {} }],
            },
            {
              type: "bulletListItem",
              content: [{ type: "text", text: "🅾️ 方案 C - 方案描述", styles: {} }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "截止日期：2024-12-31", styles: { textColor: "grey", italic: true } }],
            },
          ];
          insertOrReplace(voteBlocks);
          return;
        }

        case "schedule":
        case "meeting": {
          const isMeeting = item.id === "meeting";
          const scheduleBlocks = [
            {
              type: "heading",
              props: { level: 1 },
              content: [{ type: "text", text: isMeeting ? "📅 会议议程" : "📆 日程安排", styles: {} }],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: "时间：", styles: { bold: true } },
                { type: "text", text: isMeeting ? "2024-01-15 14:00 - 16:00" : "请填写时间", styles: {} },
              ],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: "地点：", styles: { bold: true } },
                { type: "text", text: isMeeting ? "会议室 A / 线上会议" : "请填写地点", styles: {} },
              ],
            },
            isMeeting ? {
              type: "paragraph",
              content: [
                { type: "text", text: "参会人：", styles: { bold: true } },
                { type: "text", text: "张三、李四、王五", styles: {} },
              ],
            } : null,
            {
              type: "heading",
              props: { level: 2 },
              content: [{ type: "text", text: isMeeting ? "议程安排" : "日程列表", styles: {} }],
            },
            {
              type: "numberedListItem",
              content: [{ type: "text", text: isMeeting ? "开场介绍（10分钟）" : "上午：工作内容 1", styles: {} }],
            },
            {
              type: "numberedListItem",
              content: [{ type: "text", text: isMeeting ? "主题讨论（30分钟）" : "下午：工作内容 2", styles: {} }],
            },
            {
              type: "numberedListItem",
              content: [{ type: "text", text: isMeeting ? "总结与行动项（20分钟）" : "晚上：工作内容 3", styles: {} }],
            },
            isMeeting ? {
              type: "heading",
              props: { level: 2 },
              content: [{ type: "text", text: "行动项", styles: {} }],
            } : null,
            isMeeting ? { type: "checkListItem", props: { checked: false }, content: [{ type: "text", text: "张三 - 完成会议纪要", styles: {} }] } : null,
            isMeeting ? { type: "checkListItem", props: { checked: false }, content: [{ type: "text", text: "李四 - 跟进需求落地", styles: {} }] } : null,
          ].filter(Boolean);
          insertOrReplace(scheduleBlocks);
          return;
        }

        case "countdown": {
          const countdownBlocks = [
            {
              type: "quote",
              content: [
                { type: "text", text: "⏰ 倒计时", styles: { bold: true } },
              ],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: "距离目标日期还有 ", styles: {} },
                { type: "text", text: "30 天", styles: { bold: true, textColor: "red" } },
                { type: "text", text: "（2024-12-31）", styles: { textColor: "grey" } },
              ],
            },
            {
              type: "numberedListItem",
              content: [{ type: "text", text: "阶段一：完成准备工作（第 1-10 天）", styles: {} }],
            },
            {
              type: "numberedListItem",
              content: [{ type: "text", text: "阶段二：核心任务执行（第 11-20 天）", styles: {} }],
            },
            {
              type: "numberedListItem",
              content: [{ type: "text", text: "阶段三：收尾与验收（第 21-30 天）", styles: {} }],
            },
          ];
          insertOrReplace(countdownBlocks);
          return;
        }

        case "webCard": {
          const url = prompt("请输入网页链接：", "https://");
          if (url) {
            const webCardBlocks = [
              {
                type: "quote",
                content: [
                  { type: "text", text: "🔗 网页卡片", styles: { bold: true } },
                ],
              },
              {
                type: "paragraph",
                content: [
                  { type: "link", href: url, content: [{ type: "text", text: url, styles: { underline: true } }] },
                ],
              },
            ];
            insertOrReplace(webCardBlocks);
          }
          return;
        }

        case "person":
        case "group": {
          const isGroup = item.id === "group";
          const personBlocks = [
            {
              type: "quote",
              content: [
                { type: "text", text: isGroup ? "👥 群名片" : "👤 人员", styles: { bold: true } },
              ],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: isGroup ? "群名称：" : "姓名：", styles: { bold: true } },
                { type: "text", text: isGroup ? "产品研发群" : "张三", styles: {} },
              ],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: isGroup ? "群成员：" : "职位：", styles: { bold: true } },
                { type: "text", text: isGroup ? "25人" : "产品经理", styles: {} },
              ],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: isGroup ? "群主：" : "部门：", styles: { bold: true } },
                { type: "text", text: isGroup ? "李四" : "产品部", styles: {} },
              ],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: "简介：", styles: { bold: true } },
                { type: "text", text: isGroup ? "负责产品研发相关讨论" : "负责产品规划和需求分析", styles: {} },
              ],
            },
          ];
          insertOrReplace(personBlocks);
          return;
        }

        case "dateReminder": {
          const dateStr = prompt("请输入提醒日期（YYYY-MM-DD）：", "2024-12-31");
          if (dateStr) {
            const reminderBlocks = [
              {
                type: "quote",
                content: [
                  { type: "text", text: "🔔 日期提醒", styles: { bold: true } },
                ],
              },
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "提醒日期：", styles: { bold: true } },
                  { type: "text", text: dateStr, styles: { textColor: "red", bold: true } },
                ],
              },
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "提醒事项：", styles: { bold: true } },
                  { type: "text", text: "请在此填写需要提醒的事项", styles: { textColor: "grey" } },
                ],
              },
              {
                type: "checkListItem",
                props: { checked: false },
                content: [{ type: "text", text: "准备相关材料", styles: {} }],
              },
              {
                type: "checkListItem",
                props: { checked: false },
                content: [{ type: "text", text: "确认参会人员", styles: {} }],
              },
              {
                type: "checkListItem",
                props: { checked: false },
                content: [{ type: "text", text: "提前一天复查", styles: {} }],
              },
            ];
            insertOrReplace(reminderBlocks);
          }
          return;
        }

        case "infoCollect": {
          const collectBlocks = [
            {
              type: "heading",
              props: { level: 2 },
              content: [{ type: "text", text: "📋 信息收集表", styles: {} }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "请填写以下信息：", styles: { italic: true, textColor: "grey" } }],
            },
            {
              type: "bulletListItem",
              content: [{ type: "text", text: "姓名：__________", styles: {} }],
            },
            {
              type: "bulletListItem",
              content: [{ type: "text", text: "联系方式：__________", styles: {} }],
            },
            {
              type: "bulletListItem",
              content: [{ type: "text", text: "部门/单位：__________", styles: {} }],
            },
            {
              type: "bulletListItem",
              content: [{ type: "text", text: "需求/建议：__________", styles: {} }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: "提交截止日期：2024-12-31", styles: { textColor: "grey", italic: true } }],
            },
          ];
          insertOrReplace(collectBlocks);
          return;
        }

        default: {
          if (item.blockType) {
            updateBlockType(item.blockType, item.blockProps);
          } else {
            alert(`${item.title} 功能开发中...`);
          }
        }
      }
    } catch (e) {
      console.error(e);
      alert(`${item.title} 功能开发中...`);
    }
  }, [editor]);

  const getItems = useCallback(async (query: string) => {
    const items = SLASH_MENU_ITEMS.map((item) => ({
      ...item,
      onItemClick: () => handleItemClick(item),
    }));
    if (!query.trim()) {
      return items;
    }
    const lowerQuery = query.toLowerCase();
    return items.filter((item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)) ||
      item.category.toLowerCase().includes(lowerQuery)
    );
  }, [handleItemClick]);

  const suggestionMenuComponent = useCallback((props: any) => {
    const { items, selectedIndex, onItemClick } = props;
    return <CustomSlashMenu items={items} selectedIndex={selectedIndex ?? 0} onItemClick={onItemClick} />;
  }, []);

  return (
    <BlockNoteView editor={editor} theme={colorScheme} slashMenu={false}>
      <SuggestionMenuController
        triggerCharacter="/"
        getItems={getItems}
        suggestionMenuComponent={suggestionMenuComponent}
        onItemClick={(item: any) => item.onItemClick()}
      />
    </BlockNoteView>
  );
}
