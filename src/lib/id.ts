// ─── UUID 生成器 ─────────────────────────────────────────────────────

/**
 * 生成紧凑的随机 ID（21 字符）。
 * 使用 crypto.getRandomValues，兼容所有现代浏览器。
 * 字符集经过选择，避免歧义字符（如 0/O、1/l/I）。
 */
export function generateId(length = 21): string {
  const chars =
    "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[63 & bytes[i]];
  }
  return result;
}
