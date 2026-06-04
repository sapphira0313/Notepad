/** 数据库定义 */
export interface DatabaseSchema {
  id: string;
  title: string;
  properties: PropertySchema[];
  views: DatabaseView[];
  rows: DatabaseRow[];
  createdAt: number;
  updatedAt: number;
}

/** 属性/列定义 */
export interface PropertySchema {
  id: string;
  name: string;
  type: PropertyType;
  options?: SelectOption[];
}

export type PropertyType =
  | "title"
  | "text"
  | "number"
  | "select"
  | "multiSelect"
  | "date"
  | "checkbox"
  | "url";

export interface SelectOption {
  id: string;
  name: string;
  color: string;
}

/** 数据库行 */
export interface DatabaseRow {
  id: string;
  properties: Record<string, PropertyValue>;
}

export type PropertyValue =
  | string
  | number
  | boolean
  | string[]
  | null;

/** 视图定义 */
export interface DatabaseView {
  id: string;
  name: string;
  type: "table" | "kanban" | "calendar" | "gallery";
  visiblePropertyIds: string[];
  config: ViewConfig;
}

export interface ViewConfig {
  groupByPropertyId?: string;
  datePropertyId?: string;
  columnWidths?: Record<string, number>;
  /** 排序规则 */
  sortRules?: SortRule[];
  /** 筛选规则 */
  filterRules?: FilterRule[];
}

export interface SortRule {
  propertyId: string;
  direction: "asc" | "desc";
}

export interface FilterRule {
  propertyId: string;
  operator: "contains" | "notContains" | "equals" | "notEquals" | "gt" | "lt" | "isEmpty" | "isNotEmpty";
  value?: string | number;
}
