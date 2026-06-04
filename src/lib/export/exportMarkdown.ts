import type { Block, PageData } from "@/types/page";
import { generateId } from "@/lib/id";

/**
 * 将 Block 数据转换为 Markdown 字符串
 */
export function blocksToMarkdown(blocks: Block[]): string {
  return blocks.map(blockToMarkdown).join("\n\n");
}

function blockToMarkdown(block: Block): string {
  const text = (block.props.textContent as string) || "";

  switch (block.type) {
    case "heading": {
      const level = (block.props.level as number) || 1;
      return "#".repeat(level) + " " + text;
    }
    case "paragraph":
      return text;
    case "quote":
      return "> " + text;
    case "bulletList":
      return "- " + text;
    case "numberedList":
      return "1. " + text;
    case "checkListItem":
      const checked = block.props.checked ? "x" : " ";
      return `- [${checked}] ${text}`;
    case "codeBlock": {
      const lang = (block.props.language as string) || "";
      return "```" + lang + "\n" + text + "\n```";
    }
    case "divider":
      return "---";
    case "image": {
      const url = (block.props.url as string) || "";
      const caption = (block.props.caption as string) || "";
      return `![${caption}](${url})`;
    }
    case "bookmark": {
      const url = (block.props.url as string) || "";
      return `[${text || url}](${url})`;
    }
    case "math": {
      const formula = (block.props.formula as string) || "";
      return `$$\n${formula}\n$$`;
    }
    case "callout": {
      const icon = (block.props.icon as string) || "💡";
      return `> ${icon} ${text}`;
    }
    default:
      return text;
  }
}

/**
 * 将完整页面导出为 Markdown
 */
export function pageToMarkdown(page: PageData): string {
  const title = `# ${page.meta.title}\n\n`;
  return title + blocksToMarkdown(page.blocks);
}

/**
 * 简单的 Markdown 解析为 Block 列表
 */
export function markdownToBlocks(markdown: string): Block[] {
  const lines = markdown.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      blocks.push({
        id: generateId(),
        type: "heading",
        props: { level: headingMatch[1].length, textContent: headingMatch[2] },
        content: [],
        parentId: null,
      });
      i++;
      continue;
    }

    // Divider
    if (/^---+$/.test(line)) {
      blocks.push({ id: crypto.randomUUID(), type: "divider", props: {}, content: [], parentId: null });
      i++;
      continue;
    }

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        id: generateId(),
        type: "codeBlock",
        props: { language: lang || "javascript", textContent: codeLines.join("\n") },
        content: [],
        parentId: null,
      });
      continue;
    }

    // Quote
    if (line.startsWith("> ")) {
      blocks.push({
        id: generateId(),
        type: "quote",
        props: { textContent: line.slice(2) },
        content: [],
        parentId: null,
      });
      i++;
      continue;
    }

    // Checkbox
    const checkMatch = line.match(/^- \[([ x])\]\s+(.+)/);
    if (checkMatch) {
      blocks.push({
        id: generateId(),
        type: "checkListItem",
        props: { checked: checkMatch[1] === "x", textContent: checkMatch[2] },
        content: [],
        parentId: null,
      });
      i++;
      continue;
    }

    // Bullet list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      blocks.push({
        id: generateId(),
        type: "bulletList",
        props: { textContent: line.slice(2) },
        content: [],
        parentId: null,
      });
      i++;
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^\d+\.\s+(.+)/);
    if (numMatch) {
      blocks.push({
        id: generateId(),
        type: "numberedList",
        props: { textContent: numMatch[1] },
        content: [],
        parentId: null,
      });
      i++;
      continue;
    }

    // Paragraph (default)
    blocks.push({
      id: generateId(),
      type: "paragraph",
      props: { textContent: line },
      content: [],
      parentId: null,
    });
    i++;
  }

  return blocks;
}

/**
 * 触发文件下载
 * @deprecated 请从 "@/lib/download" 导入 downloadFile
 */
export { downloadFile } from "@/lib/download";
