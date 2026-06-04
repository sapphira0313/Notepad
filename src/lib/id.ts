import { nanoid } from "nanoid";

/**
 * 统一的 ID 生成函数
 * 使用 nanoid 生成短唯一 ID（21 字符，URL 安全）
 */
export function generateId(): string {
  return nanoid();
}
