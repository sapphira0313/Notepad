"use client";

interface BlockIconProps {
  size?: number;
  color?: string;
}

const STROKE_WIDTH = 2.4;

export function TIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export function ParagraphIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h7a5 5 0 0 1 0 10H8v6" />
      <path d="M8 9v11" />
    </svg>
  );
}

export function Heading1Icon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5v14" />
      <path d="M12 5v14" />
      <path d="M4 12h8" />
      <path d="M18 5v10" />
      <path d="M16 17l2 2 2-2" />
    </svg>
  );
}

export function Heading2Icon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5v14" />
      <path d="M12 5v14" />
      <path d="M4 12h8" />
      <path d="M16 5h4v3a2 2 0 0 1-2 2h-2" />
      <path d="M20 17h-6l2-2.5a2 2 0 0 1 2-1.5" />
    </svg>
  );
}

export function Heading3Icon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5v14" />
      <path d="M12 5v14" />
      <path d="M4 12h8" />
      <path d="M16 5h3a2 2 0 0 1 0 4h-2" />
      <path d="M17 9h2a2 2 0 0 1 0 4h-3" />
    </svg>
  );
}

export function BulletListIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="7" r="2" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="6" cy="17" r="2" fill="currentColor" stroke="none" />
      <path d="M11 7h8" />
      <path d="M11 12h8" />
      <path d="M11 17h8" />
    </svg>
  );
}

export function NumberedListIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4v5" strokeWidth={2.2} />
      <path d="M3 9h4" strokeWidth={2.2} />
      <path d="M3 13h4l-3 3h3" strokeWidth={2.2} />
      <path d="M3 19h4" strokeWidth={2.2} />
      <path d="M7 17v2a2 2 0 0 1-2 2" strokeWidth={2.2} />
      <path d="M11 7h9" />
      <path d="M11 12h9" />
      <path d="M11 17h9" />
    </svg>
  );
}

export function QuoteIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 6H4v5a3 3 0 0 0 3 3" />
      <path d="M7 11v1" />
      <path d="M17 6h-3v5a3 3 0 0 0 3 3" />
      <path d="M17 11v1" />
    </svg>
  );
}

export function CodeBlockIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 7l-5 5 5 5" />
      <path d="M15 7l5 5-5 5" />
      <path d="M13 5l-2 14" />
    </svg>
  );
}

export function DividerIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h18" strokeDasharray="3 3" />
      <path d="M3 12h18" strokeDasharray="3 3" />
      <path d="M3 17h18" strokeDasharray="3 3" />
    </svg>
  );
}

export function LinkIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-1 1" />
      <path d="M14 10a3.5 3.5 0 0 0-5 0l-4 4a3.5 3.5 0 0 0 5 5l1-1" />
    </svg>
  );
}

export function ImageIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5L5 22" />
    </svg>
  );
}

export function TableIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M3 10h18" />
      <path d="M3 14h18" />
      <path d="M9 4v16" />
      <path d="M15 4v16" />
    </svg>
  );
}

export function CalloutIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l10 9-10 9L2 12 12 3z" />
      <path d="M12 9v4" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function MathIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
      <path d="M8 6l4 12" />
      <path d="M12 6l-4 12" />
    </svg>
  );
}

export function FileIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3v6h6" />
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" />
    </svg>
  );
}

export function ChecklistIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="5" height="5" rx="1" />
      <rect x="4" y="12" width="5" height="5" rx="1" />
      <rect x="4" y="19" width="5" height="5" rx="1" />
      <path d="M5 7.5l1 1 2-2" />
      <path d="M12 7.5h9" />
      <path d="M12 14.5h9" />
      <path d="M12 21.5h9" />
    </svg>
  );
}

export function BookmarkIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v18l-6-4-6 4V3z" />
    </svg>
  );
}

export function VideoIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="M17 10l4-2v8l-4-2" />
    </svg>
  );
}

export function AudioIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V7l8-2v11" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="15" cy="16" r="2" />
    </svg>
  );
}

export function EmojiIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <circle cx="9" cy="10" r="0.5" fill="currentColor" />
      <circle cx="15" cy="10" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function EquationIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5l3 3-3 3" />
      <path d="M16 5l3 3-3 3" />
      <path d="M8 14h8" />
      <path d="M8 18h8" />
    </svg>
  );
}

export function BlockquoteIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12" />
      <path d="M6 12h12" />
      <path d="M6 16h8" />
      <path d="M3 6v12" />
    </svg>
  );
}

export function TaskIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M7 12l3 3 7-7" />
    </svg>
  );
}

export function HighlightIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l-5 5v3h3l5-5" />
      <path d="M13 5l5 5-7 7-5-5 7-7z" />
    </svg>
  );
}

export function SyncIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11v-1a9 9 0 0 1 15.5-5.5L21 6" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v1a9 9 0 0 1-15.5 5.5L3 18" />
    </svg>
  );
}

export function TemplateIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

export function SubDocIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3v6h6" />
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" />
      <path d="M8 13h3" />
      <path d="M8 17h3" />
      <path d="M14 13h3" />
      <path d="M14 17h3" />
    </svg>
  );
}

export function SpreadsheetIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 8h18" />
      <path d="M8 3v18" />
      <path d="M16 3v18" />
    </svg>
  );
}

export function KanbanIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="5" height="18" rx="1" />
      <rect x="10" y="3" width="5" height="12" rx="1" />
      <rect x="16" y="3" width="5" height="15" rx="1" />
    </svg>
  );
}

export function GanttIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16" />
      <path d="M4 19h16" />
      <path d="M4 5v14" />
      <path d="M20 5v14" />
      <path d="M6 8h6" />
      <path d="M6 12h4" />
      <path d="M10 16h8" />
    </svg>
  );
}

export function GalleryIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
  );
}

export function LinkTableIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="12" height="14" rx="1" />
      <path d="M3 10h12" />
      <path d="M3 14h12" />
      <path d="M7 5v14" />
      <path d="M16 12h.01" />
      <path d="M18 12h.01" />
      <path d="M20 12h.01" />
    </svg>
  );
}

export function CanvasIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8" cy="10" r="2" />
      <path d="M14 8l4 4-2 2-4-4 2-2z" />
      <path d="M7 17c2 0 3-1.5 5-1.5s3 1.5 5 1.5" />
    </svg>
  );
}

export function MindmapIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M7 7l3 3" />
      <path d="M17 7l-3 3" />
      <path d="M7 17l3-3" />
      <path d="M17 17l-3-3" />
    </svg>
  );
}

export function FlowchartIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="3" width="8" height="5" rx="1" />
      <rect x="3" y="15" width="7" height="6" rx="1" />
      <rect x="14" y="15" width="7" height="6" rx="1" />
      <path d="M12 8v7" />
      <path d="M12 15l-5 0" />
      <path d="M12 15l5 0" />
    </svg>
  );
}

export function UMLIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 8h18" />
      <path d="M3 13h18" />
      <circle cx="7" cy="5.5" r="0.5" fill="currentColor" />
      <path d="M10 5.5h8" />
      <path d="M6 10.5h6" />
      <path d="M6 15.5h6" />
      <circle cx="17" cy="15.5" r="1.5" />
    </svg>
  );
}

export function PersonIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}

export function GroupIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3 20v-1.5a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5V20" />
      <path d="M17 14.5a4 4 0 0 1 4 4V21" />
    </svg>
  );
}

export function CloudDocIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4v5h5" />
      <path d="M14 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-5-5z" />
      <path d="M7 17h10" />
      <path d="M7 14h6" />
    </svg>
  );
}

export function VoteIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M7 9h10" />
      <path d="M7 13h7" />
      <path d="M7 17h5" />
      <path d="M10 3v2" />
      <path d="M14 3v2" />
    </svg>
  );
}

export function DateReminderIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 10h16" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M12 15l3 3-3 3" />
    </svg>
  );
}

export function InfoCollectIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="14" height="16" rx="2" />
      <path d="M7 9h8" />
      <path d="M7 13h8" />
      <path d="M7 17h5" />
      <path d="M18 8l3 2-3 2" />
      <path d="M21 10v4" />
    </svg>
  );
}

export function ScheduleIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 10h16" />
      <path d="M8 4v6" />
      <path d="M16 4v6" />
      <rect x="6" y="13" width="5" height="3" rx="0.5" />
      <rect x="13" y="13" width="5" height="3" rx="0.5" />
    </svg>
  );
}

export function MeetingIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="3.5" />
      <path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" />
      <path d="M3 10h2" />
      <path d="M19 10h2" />
    </svg>
  );
}

export function WebCardIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
      <circle cx="6.5" cy="7" r="0.8" fill="currentColor" />
      <circle cx="9" cy="7" r="0.8" fill="currentColor" />
      <path d="M13 7h6" />
    </svg>
  );
}

export function CountdownIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5" />
      <path d="M9 3h6" />
    </svg>
  );
}

export function WidgetIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
      <path d="M7 7v0" />
      <path d="M17 7v0" />
      <path d="M7 17v0" />
      <path d="M17 17v0" />
    </svg>
  );
}

export function TOCIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
      <path d="M18 14l3 3-3 3" />
    </svg>
  );
}

export function TimelineIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <circle cx="12" cy="7" r="2" />
      <circle cx="12" cy="17" r="2" />
      <rect x="15" y="5" width="6" height="4" rx="1" />
      <rect x="3" y="15" width="6" height="4" rx="1" />
    </svg>
  );
}

export function TextDrawIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V5h8" />
      <path d="M4 12v-2h6" />
      <path d="M4 17v-2h10" />
      <path d="M17 19l3-3-5-5-4 4 3 3" />
      <path d="M14 16l3 3" />
    </svg>
  );
}

export function ExternalLinkIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

export function CopyDocIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      <path d="M13 13h4" />
      <path d="M13 17h4" />
    </svg>
  );
}

export function FollowIcon({ size = 20, color = "currentColor" }: BlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-5" />
    </svg>
  );
}

export const BlockIcons = {
  paragraph: ParagraphIcon,
  heading1: Heading1Icon,
  heading2: Heading2Icon,
  heading3: Heading3Icon,
  bulletList: BulletListIcon,
  numberedList: NumberedListIcon,
  quote: QuoteIcon,
  codeBlock: CodeBlockIcon,
  divider: DividerIcon,
  link: LinkIcon,
  image: ImageIcon,
  table: TableIcon,
  callout: CalloutIcon,
  math: MathIcon,
  file: FileIcon,
  checklist: ChecklistIcon,
  bookmark: BookmarkIcon,
  video: VideoIcon,
  audio: AudioIcon,
  emoji: EmojiIcon,
  equation: EquationIcon,
  blockquote: BlockquoteIcon,
  task: TaskIcon,
  highlight: HighlightIcon,
  sync: SyncIcon,
  template: TemplateIcon,
  subDoc: SubDocIcon,
  spreadsheet: SpreadsheetIcon,
  kanban: KanbanIcon,
  gantt: GanttIcon,
  gallery: GalleryIcon,
  linkTable: LinkTableIcon,
  canvas: CanvasIcon,
  mindmap: MindmapIcon,
  flowchart: FlowchartIcon,
  uml: UMLIcon,
  person: PersonIcon,
  group: GroupIcon,
  cloudDoc: CloudDocIcon,
  vote: VoteIcon,
  dateReminder: DateReminderIcon,
  infoCollect: InfoCollectIcon,
  schedule: ScheduleIcon,
  meeting: MeetingIcon,
  webCard: WebCardIcon,
  countdown: CountdownIcon,
  widget: WidgetIcon,
  toc: TOCIcon,
  timeline: TimelineIcon,
  textDraw: TextDrawIcon,
  externalLink: ExternalLinkIcon,
  copyDoc: CopyDocIcon,
  follow: FollowIcon,
};
