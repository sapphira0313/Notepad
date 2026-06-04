import type { Block, PageData } from "@/types/page";

export function pageToHTML(page: PageData): string {
  const body = page.blocks.map(blockToHTML).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(page.meta.title)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #1a1a1a; }
    h1 { font-size: 2.2em; margin-bottom: 0.5em; }
    h2 { font-size: 1.6em; }
    h3 { font-size: 1.3em; }
    blockquote { border-left: 3px solid #e0e0e0; margin: 1em 0; padding: 0.5em 1em; color: #555; }
    pre { background: #f5f5f5; padding: 1em; border-radius: 6px; overflow-x: auto; }
    code { font-family: 'Fira Code', monospace; font-size: 0.9em; }
    ul, ol { padding-left: 1.5em; }
    li { margin: 0.3em 0; }
    hr { border: none; border-top: 1px solid #e0e0e0; margin: 2em 0; }
    img { max-width: 100%; border-radius: 6px; }
    .callout { background: #f0f7ff; border-radius: 6px; padding: 1em; margin: 1em 0; }
    .checkbox { list-style: none; padding-left: 0; }
    .checkbox input { margin-right: 0.5em; }
  </style>
</head>
<body>
  <h1>${escapeHtml(page.meta.title)}</h1>
  ${body}
</body>
</html>`;
}

function blockToHTML(block: Block): string {
  const text = escapeHtml((block.props.textContent as string) || "");

  switch (block.type) {
    case "heading": {
      const level = (block.props.level as number) || 1;
      return `<h${level}>${text}</h${level}>`;
    }
    case "paragraph":
      return `<p>${text}</p>`;
    case "quote":
      return `<blockquote><p>${text}</p></blockquote>`;
    case "bulletList":
      return `<ul><li>${text}</li></ul>`;
    case "numberedList":
      return `<ol><li>${text}</li></ol>`;
    case "checkListItem": {
      const checked = block.props.checked ? "checked" : "";
      return `<ul class="checkbox"><li><input type="checkbox" ${checked} disabled>${text}</li></ul>`;
    }
    case "codeBlock": {
      const lang = escapeHtml((block.props.language as string) || "");
      return `<pre><code class="language-${lang}">${text}</code></pre>`;
    }
    case "divider":
      return "<hr>";
    case "image": {
      const url = escapeHtml((block.props.url as string) || "");
      const caption = escapeHtml((block.props.caption as string) || "");
      return `<figure><img src="${url}" alt="${caption}">${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
    }
    case "callout": {
      const icon = escapeHtml((block.props.icon as string) || "💡");
      return `<div class="callout"><span>${icon}</span> ${text}</div>`;
    }
    case "math": {
      const formula = escapeHtml((block.props.formula as string) || "");
      return `<pre class="math">${formula}</pre>`;
    }
    default:
      return `<p>${text}</p>`;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
