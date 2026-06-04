import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { generateId } from "@/lib/id";
import type {
  DatabaseSchema,
  DatabaseRow,
  DatabaseView,
  PropertySchema,
  SelectOption,
  PropertyValue,
  ViewConfig,
} from "@/types/database";
import { getStorage } from "@/lib/storage/StorageManager";

interface DatabaseStore {
  databases: Record<string, DatabaseSchema>;
  isLoaded: boolean;

  loadDatabases: () => Promise<void>;
  createDatabase: (title?: string) => Promise<string>;
  deleteDatabase: (id: string) => Promise<void>;
  updateDatabaseTitle: (id: string, title: string) => Promise<void>;

  addProperty: (dbId: string, name: string, type: PropertySchema["type"]) => Promise<void>;
  removeProperty: (dbId: string, propId: string) => Promise<void>;
  updateProperty: (dbId: string, propId: string, updates: Partial<PropertySchema>) => Promise<void>;

  addRow: (dbId: string) => Promise<string>;
  removeRow: (dbId: string, rowId: string) => Promise<void>;
  updateCellValue: (dbId: string, rowId: string, propId: string, value: PropertyValue) => Promise<void>;

  addView: (dbId: string, name: string, type: DatabaseView["type"]) => Promise<void>;
  removeView: (dbId: string, viewId: string) => Promise<void>;

  getDatabase: (id: string) => DatabaseSchema | undefined;
  /** #15 拖拽重排行 */
  reorderRows: (dbId: string, fromIndex: number, toIndex: number) => Promise<void>;
  /** #7 更新视图配置（排序/筛选） */
  updateViewConfig: (dbId: string, viewId: string, config: Partial<ViewConfig>) => Promise<void>;
}

const COLORS = ["#e03e3e", "#d9730d", "#dfab01", "#0f7b6c", "#2f80ed", "#6940a5", "#ad1a72"];

function createDefaultDatabase(title: string): DatabaseSchema {
  const titlePropId = generateId();
  const statusPropId = generateId();
  const defaultViewId = generateId();

  const options: SelectOption[] = [
    { id: generateId(), name: "待办", color: "#e03e3e" },
    { id: generateId(), name: "进行中", color: "#2f80ed" },
    { id: generateId(), name: "已完成", color: "#0f7b6c" },
  ];

  return {
    id: generateId(),
    title,
    properties: [
      { id: titlePropId, name: "标题", type: "title" },
      { id: statusPropId, name: "状态", type: "select", options },
    ],
    views: [
      {
        id: defaultViewId,
        name: "表格",
        type: "table",
        visiblePropertyIds: [titlePropId, statusPropId],
        config: {},
      },
    ],
    rows: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/** 持久化单个数据库到 storage */
async function persistDatabase(db: DatabaseSchema) {
  const storage = await getStorage();
  await storage.saveDatabase(db);
}

export const useDatabaseStore = create<DatabaseStore>()(
  immer((set, get) => ({
    databases: {},
    isLoaded: false,

    loadDatabases: async () => {
      try {
        const storage = await getStorage();
        const allDbs = await storage.getAllDatabases();
        const databases: Record<string, DatabaseSchema> = {};
        for (const db of allDbs) {
          databases[db.id] = db;
        }
        set((state) => {
          state.databases = databases;
          state.isLoaded = true;
        });
      } catch (error) {
        console.error("Failed to load databases:", error);
        set((state) => {
          state.isLoaded = true;
        });
      }
    },

    createDatabase: async (title = "新数据库") => {
      try {
        const db = createDefaultDatabase(title);
        set((state) => { state.databases[db.id] = db; });
        await persistDatabase(db);
        return db.id;
      } catch (error) {
        console.error("Failed to create database:", error);
        throw error;
      }
    },

    deleteDatabase: async (id) => {
      try {
        set((state) => { delete state.databases[id]; });
        const storage = await getStorage();
        await storage.deleteDatabase(id);
      } catch (error) {
        console.error("Failed to delete database:", error);
        throw error;
      }
    },

    updateDatabaseTitle: async (id, title) => {
      try {
        set((state) => {
          if (state.databases[id]) {
            state.databases[id].title = title;
            state.databases[id].updatedAt = Date.now();
          }
        });
        const db = get().databases[id];
        if (db) await persistDatabase(db);
      } catch (error) {
        console.error("Failed to update database title:", error);
        throw error;
      }
    },

    addProperty: async (dbId, name, type) => {
      try {
        set((state) => {
          const db = state.databases[dbId];
          if (!db) return;
          const prop: PropertySchema = { id: generateId(), name, type };
          if (type === "select" || type === "multiSelect") {
            prop.options = [
              { id: generateId(), name: "选项 1", color: COLORS[0] },
              { id: generateId(), name: "选项 2", color: COLORS[1] },
            ];
          }
          db.properties.push(prop);
          db.views.forEach((v) => v.visiblePropertyIds.push(prop.id));
          db.updatedAt = Date.now();
        });
        const db = get().databases[dbId];
        if (db) await persistDatabase(db);
      } catch (error) {
        console.error("Failed to add property:", error);
        throw error;
      }
    },

    removeProperty: async (dbId, propId) => {
      try {
        set((state) => {
          const db = state.databases[dbId];
          if (!db) return;
          db.properties = db.properties.filter((p) => p.id !== propId);
          db.views.forEach((v) => {
            v.visiblePropertyIds = v.visiblePropertyIds.filter((id) => id !== propId);
          });
          db.updatedAt = Date.now();
        });
        const db = get().databases[dbId];
        if (db) await persistDatabase(db);
      } catch (error) {
        console.error("Failed to remove property:", error);
        throw error;
      }
    },

    updateProperty: async (dbId, propId, updates) => {
      try {
        set((state) => {
          const db = state.databases[dbId];
          if (!db) return;
          const prop = db.properties.find((p) => p.id === propId);
          if (prop) Object.assign(prop, updates);
          db.updatedAt = Date.now();
        });
        const db = get().databases[dbId];
        if (db) await persistDatabase(db);
      } catch (error) {
        console.error("Failed to update property:", error);
        throw error;
      }
    },

    addRow: async (dbId) => {
      try {
        const rowId = generateId();
        set((state) => {
          const db = state.databases[dbId];
          if (!db) return;
          const row: DatabaseRow = { id: rowId, properties: {} };
          db.properties.forEach((p) => {
            if (p.type === "checkbox") row.properties[p.id] = false;
            else if (p.type === "number") row.properties[p.id] = 0;
            else row.properties[p.id] = "";
          });
          db.rows.push(row);
          db.updatedAt = Date.now();
        });
        const db = get().databases[dbId];
        if (db) await persistDatabase(db);
        return rowId;
      } catch (error) {
        console.error("Failed to add row:", error);
        throw error;
      }
    },

    removeRow: async (dbId, rowId) => {
      try {
        set((state) => {
          const db = state.databases[dbId];
          if (!db) return;
          db.rows = db.rows.filter((r) => r.id !== rowId);
          db.updatedAt = Date.now();
        });
        const db = get().databases[dbId];
        if (db) await persistDatabase(db);
      } catch (error) {
        console.error("Failed to remove row:", error);
        throw error;
      }
    },

    updateCellValue: async (dbId, rowId, propId, value) => {
      try {
        set((state) => {
          const db = state.databases[dbId];
          if (!db) return;
          const row = db.rows.find((r) => r.id === rowId);
          if (row) {
            row.properties[propId] = value;
            db.updatedAt = Date.now();
          }
        });
        const db = get().databases[dbId];
        if (db) await persistDatabase(db);
      } catch (error) {
        console.error("Failed to update cell value:", error);
        throw error;
      }
    },

    addView: async (dbId, name, type) => {
      try {
        set((state) => {
          const db = state.databases[dbId];
          if (!db) return;
          const view: DatabaseView = {
            id: generateId(),
            name,
            type,
            visiblePropertyIds: db.properties.map((p) => p.id),
            config: {},
          };
          db.views.push(view);
          db.updatedAt = Date.now();
        });
        const db = get().databases[dbId];
        if (db) await persistDatabase(db);
      } catch (error) {
        console.error("Failed to add view:", error);
        throw error;
      }
    },

    removeView: async (dbId, viewId) => {
      try {
        set((state) => {
          const db = state.databases[dbId];
          if (!db) return;
          db.views = db.views.filter((v) => v.id !== viewId);
          db.updatedAt = Date.now();
        });
        const db = get().databases[dbId];
        if (db) await persistDatabase(db);
      } catch (error) {
        console.error("Failed to remove view:", error);
        throw error;
      }
    },

    getDatabase: (id) => get().databases[id],

    reorderRows: async (dbId, fromIndex, toIndex) => {
      try {
        if (fromIndex === toIndex) return;
        set((state) => {
          const db = state.databases[dbId];
          if (!db) return;
          const arr = [...db.rows];
          const [moved] = arr.splice(fromIndex, 1);
          arr.splice(toIndex, 0, moved);
          db.rows = arr;
          db.updatedAt = Date.now();
        });
        const db = get().databases[dbId];
        if (db) await persistDatabase(db);
      } catch (error) {
        console.error("Failed to reorder rows:", error);
        throw error;
      }
    },

    updateViewConfig: async (dbId, viewId, config) => {
      try {
        set((state) => {
          const db = state.databases[dbId];
          if (!db) return;
          const view = db.views.find((v) => v.id === viewId);
          if (view) {
            Object.assign(view.config, config);
            db.updatedAt = Date.now();
          }
        });
        const db = get().databases[dbId];
        if (db) await persistDatabase(db);
      } catch (error) {
        console.error("Failed to update view config:", error);
        throw error;
      }
    },
  }))
);
