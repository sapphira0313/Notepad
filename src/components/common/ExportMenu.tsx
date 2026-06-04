"use client";

import { useState } from "react";
import { usePageStore } from "@/stores/usePageStore";
import { pageToMarkdown, downloadFile, markdownToBlocks } from "@/lib/export/exportMarkdown";
import { pageToHTML } from "@/lib/export/exportHTML";
import { Download, FileText, FileCode, Printer, Upload, Package } from "lucide-react";
import { getStorage } from "@/lib/storage/StorageManager";

export function ExportMenu() {
  const [open, setOpen] = useState(false);
  const currentPageData = usePageStore((s) => s.currentPageData);
  const loadPage = usePageStore((s) => s.loadPage);
  const updateBlocks = usePageStore((s) => s.updateBlocks);

  if (!currentPageData) return null;

  const handleExportMarkdown = () => {
    const md = pageToMarkdown(currentPageData);
    downloadFile(`${currentPageData.meta.title}.md`, md, "text/markdown");
    setOpen(false);
  };

  const handleExportHTML = () => {
    const html = pageToHTML(currentPageData);
    downloadFile(`${currentPageData.meta.title}.html`, html, "text/html");
    setOpen(false);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(currentPageData, null, 2);
    downloadFile(`${currentPageData.meta.title}.json`, json, "application/json");
    setOpen(false);
  };

  const handleExportPDF = () => {
    window.print();
    setOpen(false);
  };

  const handleImportMarkdown = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md,.markdown";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const blocks = markdownToBlocks(text);
      await updateBlocks([...currentPageData.blocks, ...blocks]);
    };
    input.click();
    setOpen(false);
  };

  const handleImportJSON = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.blocks) {
          await updateBlocks(data.blocks);
        }
      } catch {
        alert("JSON 文件格式错误");
      }
    };
    input.click();
    setOpen(false);
  };

  // #12 批量导出整个工作区
  const handleBatchExportJSON = async () => {
    const { pages, rootPageIds } = usePageStore.getState();
    const storage = await getStorage();
    const allPages: unknown[] = [];
    
    const collectPage = async (id: string) => {
      const pageData = await storage.loadPage(id);
      if (pageData) {
        allPages.push(pageData);
        const meta = pages[id];
        if (meta) {
          for (const childId of meta.childIds) {
            await collectPage(childId);
          }
        }
      }
    };
    
    for (const rootId of rootPageIds) {
      await collectPage(rootId);
    }
    
    const bundle = {
      workspace: "My Workspace",
      exportedAt: new Date().toISOString(),
      pageCount: allPages.length,
      pages: allPages,
    };
    downloadFile("workspace-export.json", JSON.stringify(bundle, null, 2), "application/json");
    setOpen(false);
  };

  const handleBatchExportMarkdown = async () => {
    const { pages, rootPageIds } = usePageStore.getState();
    const storage = await getStorage();
    let combined = "";
    
    const collectMd = async (id: string, depth: number) => {
      const pageData = await storage.loadPage(id);
      if (pageData) {
        const md = pageToMarkdown(pageData);
        combined += md + "\n\n---\n\n";
        const meta = pages[id];
        if (meta) {
          for (const childId of meta.childIds) {
            await collectMd(childId, depth + 1);
          }
        }
      }
    };
    
    for (const rootId of rootPageIds) {
      await collectMd(rootId, 0);
    }
    
    downloadFile("workspace-export.md", combined, "text/markdown");
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="导入导出"
        aria-expanded={open}
        className="p-2.5 rounded-xl hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-all duration-200 hover:shadow-md hover:shadow-black/8"
      >
        <Download className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-popover border border-border rounded-lg shadow-lg py-1">
            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">导出</div>
            <button onClick={handleExportMarkdown} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors">
              <FileText className="w-4 h-4" /> Markdown (.md)
            </button>
            <button onClick={handleExportHTML} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors">
              <FileCode className="w-4 h-4" /> HTML (.html)
            </button>
            <button onClick={handleExportJSON} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors">
              <FileCode className="w-4 h-4" /> JSON (.json)
            </button>
            <button onClick={handleExportPDF} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors">
              <Printer className="w-4 h-4" /> PDF (打印)
            </button>
            <div className="h-px bg-border my-1" />
            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">导入</div>
            <button onClick={handleImportMarkdown} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors">
              <Upload className="w-4 h-4" /> Markdown 文件
            </button>
            <button onClick={handleImportJSON} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors">
              <Upload className="w-4 h-4" /> JSON 文件
            </button>
            <div className="h-px bg-border my-1" />
            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">批量导出</div>
            <button onClick={handleBatchExportJSON} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors">
              <Package className="w-4 h-4" /> 全部导出 (JSON)
            </button>
            <button onClick={handleBatchExportMarkdown} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors">
              <Package className="w-4 h-4" /> 全部导出 (Markdown)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
