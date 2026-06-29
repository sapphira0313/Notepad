"use client";

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// Apple 风格彩色图标 - 渐变色设计

export function SunIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB347" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="4" fill="url(#sunGrad)" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        stroke="url(#sunGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="url(#moonGrad)"
      />
    </svg>
  );
}

export function FileTextIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="fileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        fill="url(#fileGrad)"
        fillOpacity="0.2"
        stroke="url(#fileGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="14 2 14 8 20 8"
        stroke="url(#fileGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="16"
        y1="13"
        x2="8"
        y2="13"
        stroke="url(#fileGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="17"
        x2="8"
        y2="17"
        stroke="url(#fileGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ClockIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="clockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="url(#clockGrad)"
        fillOpacity="0.2"
        stroke="url(#clockGrad)"
        strokeWidth="2"
      />
      <polyline
        points="12 6 12 12 16 14"
        stroke="url(#clockGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
  );
}

export function StarFilledIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="starFilledGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill="url(#starFilledGrad)"
        stroke="url(#starFilledGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="plusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        stroke="url(#plusGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke="url(#plusGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      <circle
        cx="11"
        cy="11"
        r="7"
        fill="none"
        stroke="url(#searchGrad)"
        strokeWidth="2"
      />
      <path
        d="m21 21-4.35-4.35"
        stroke="url(#searchGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MenuIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <line
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PanelLeftIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M10 19l-7-7 7-7M20 12H3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PanelLeftCloseIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M14 5l7 7-7 7M4 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShareIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="shareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="5" r="3" fill="url(#shareGrad)" />
      <circle cx="6" cy="12" r="3" fill="url(#shareGrad)" />
      <circle cx="18" cy="19" r="3" fill="url(#shareGrad)" />
      <line
        x1="8.59"
        y1="13.51"
        x2="15.42"
        y2="17.49"
        stroke="url(#shareGrad)"
        strokeWidth="2"
      />
      <line
        x1="15.41"
        y1="6.51"
        x2="8.59"
        y2="10.49"
        stroke="url(#shareGrad)"
        strokeWidth="2"
      />
    </svg>
  );
}

export function DownloadIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="downloadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
        stroke="url(#downloadGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="7 10 12 15 17 10"
        stroke="url(#downloadGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="15"
        x2="12"
        y2="3"
        stroke="url(#downloadGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UploadIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
        stroke="url(#uploadGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="17 8 12 3 7 8"
        stroke="url(#uploadGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="3"
        x2="12"
        y2="15"
        stroke="url(#uploadGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TableIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="tableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        ry="2"
        fill="url(#tableGrad)"
        fillOpacity="0.2"
        stroke="url(#tableGrad)"
        strokeWidth="2"
      />
      <line
        x1="3"
        y1="9"
        x2="21"
        y2="9"
        stroke="url(#tableGrad)"
        strokeWidth="2"
      />
      <line
        x1="3"
        y1="15"
        x2="21"
        y2="15"
        stroke="url(#tableGrad)"
        strokeWidth="2"
      />
      <line
        x1="9"
        y1="3"
        x2="9"
        y2="21"
        stroke="url(#tableGrad)"
        strokeWidth="2"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <polyline
        points="9 18 15 12 9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <polyline
        points="6 9 12 15 18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MoreVerticalIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function FolderOpenIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="folderOpenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <path
        d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
        fill="url(#folderOpenGrad)"
        stroke="url(#folderOpenGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CodeIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="codeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      <polyline
        points="16 18 22 12 16 6"
        stroke="url(#codeGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="8 6 2 12 8 18"
        stroke="url(#codeGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 默认导出所有图标
export const Icons = {
  Sun: SunIcon,
  Moon: MoonIcon,
  FileText: FileTextIcon,
  Clock: ClockIcon,
  Star: StarIcon,
  Plus: PlusIcon,
  Search: SearchIcon,
  Menu: MenuIcon,
  PanelLeft: PanelLeftIcon,
  PanelLeftClose: PanelLeftCloseIcon,
  Share: ShareIcon,
  Download: DownloadIcon,
  Table: TableIcon,
  ChevronRight: ChevronRightIcon,
  ChevronDown: ChevronDownIcon,
  MoreVertical: MoreVerticalIcon,
  FolderOpen: FolderOpenIcon,
  Code: CodeIcon,
};
