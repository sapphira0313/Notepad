import type { BlockType } from "@/types/page";

/**
 * 应用 BlockType → BlockNote BlockType 映射
 */
export const APP_TO_BN: Record<BlockType, string> = {
  paragraph: "paragraph",
  heading: "heading",
  quote: "quote",
  callout: "callout",
  bulletList: "bulletListItem",
  numberedList: "numberedListItem",
  checkListItem: "checkListItem",
  toggleList: "paragraph",
  codeBlock: "codeBlock",
  image: "image",
  video: "video",
  file: "file",
  divider: "divider",
  table: "table",
  tableRow: "tableRow",
  tableCell: "tableCell",
  databaseView: "paragraph",
  pageLink: "paragraph",
  bookmark: "paragraph",
  math: "paragraph",
};

/**
 * BlockNote BlockType → 应用 BlockType 映射
 */
export const BN_TO_APP: Record<string, BlockType> = {
  paragraph: "paragraph",
  heading: "heading",
  quote: "quote",
  callout: "callout",
  bulletListItem: "bulletList",
  numberedListItem: "numberedList",
  checkListItem: "checkListItem",
  codeBlock: "codeBlock",
  image: "image",
  video: "video",
  file: "file",
  divider: "divider",
  table: "table",
  tableRow: "tableRow",
  tableCell: "tableCell",
  audio: "paragraph",
};

/**
 * 将应用 BlockType 转换为 BlockNote 类型
 */
export function toBlockNoteType(appType: BlockType): string {
  return APP_TO_BN[appType] ?? "paragraph";
}

/**
 * 将 BlockNote 类型转换为应用 BlockType
 */
export function toAppType(bnType: string): BlockType {
  return BN_TO_APP[bnType] ?? "paragraph";
}
