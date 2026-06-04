import type { BlockType } from "./page";

// ── Block Props 类型定义 ─────────────────────────────

export interface ParagraphProps {
  textContent: string;
}

export interface HeadingProps {
  textContent: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface QuoteProps {
  textContent: string;
}

export interface CalloutProps {
  textContent: string;
  icon?: string;
  color?: string;
}

export interface BulletListProps {
  textContent: string;
}

export interface NumberedListProps {
  textContent: string;
  start?: number;
}

export interface CheckListItemProps {
  textContent: string;
  checked: boolean;
}

export interface ToggleListProps {
  textContent: string;
}

export interface CodeBlockProps {
  textContent: string;
  language?: string;
}

export interface ImageProps {
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface VideoProps {
  url: string;
  caption?: string;
}

export interface FileProps {
  url: string;
  name?: string;
  size?: number;
}

export interface DividerProps {}

export interface BookmarkProps {
  url: string;
  title?: string;
  description?: string;
}

export interface MathProps {
  formula: string;
}

export interface DatabaseViewProps {
  databaseId: string;
  viewId?: string;
}

export interface PageLinkProps {
  pageId: string;
  title?: string;
}

export interface TableProps {}
export interface TableRowProps {}
export interface TableCellProps {
  textContent?: string;
}

// ── BlockType → Props 映射 ───────────────────────────

export interface BlockPropsMap {
  paragraph: ParagraphProps;
  heading: HeadingProps;
  quote: QuoteProps;
  callout: CalloutProps;
  bulletList: BulletListProps;
  numberedList: NumberedListProps;
  checkListItem: CheckListItemProps;
  toggleList: ToggleListProps;
  codeBlock: CodeBlockProps;
  image: ImageProps;
  video: VideoProps;
  file: FileProps;
  divider: DividerProps;
  table: TableProps;
  tableRow: TableRowProps;
  tableCell: TableCellProps;
  databaseView: DatabaseViewProps;
  pageLink: PageLinkProps;
  bookmark: BookmarkProps;
  math: MathProps;
}

// ── Typed Block（discriminated union）────────────────

export type TypedBlock<T extends BlockType = BlockType> = {
  id: string;
  type: T;
  props: BlockPropsMap[T];
  content: string[];
  parentId: string | null;
};

/**
 * 从 Block.props 中安全获取属性（带类型）
 */
export function getBlockProp<T extends BlockType>(
  props: Record<string, unknown>,
  key: keyof BlockPropsMap[T]
): BlockPropsMap[T][typeof key] | undefined {
  return props[key as string] as BlockPropsMap[T][typeof key] | undefined;
}
