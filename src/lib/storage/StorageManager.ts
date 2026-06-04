import type { StorageProvider } from "./types";
import { IndexedDBStorage } from "./IndexedDBStorage";
import { FileSystemStorage } from "./FileSystemStorage";

let storageInstance: StorageProvider | null = null;

/**
 * 获取当前存储实例（默认 IndexedDB）
 */
export async function getStorage(): Promise<StorageProvider> {
  if (!storageInstance) {
    storageInstance = new IndexedDBStorage();
    await storageInstance.init();
  }
  return storageInstance;
}

/**
 * 切换到文件系统存储（需要用户选择目录）
 * 仅在 Chromium 浏览器中可用
 */
export async function connectFileSystemStorage(
  handle?: FileSystemDirectoryHandle
): Promise<StorageProvider | null> {
  if (!FileSystemStorage.isSupported() && !handle) return null;

  const fs = new FileSystemStorage();
  await fs.init();
  await fs.connectDirectory(handle);

  if (fs.isConnected()) {
    storageInstance = fs;
    return fs;
  }
  return null;
}

/**
 * 检查文件系统存储是否可用
 */
export function isFileSystemSupported(): boolean {
  return FileSystemStorage.isSupported();
}
