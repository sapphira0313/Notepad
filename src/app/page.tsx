"use client";

import { useEffect, lazy, Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { usePageStore } from "@/stores/usePageStore";
import { useUIStore } from "@/stores/useUIStore";
import { useDatabaseStore } from "@/stores/useDatabaseStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

// 懒加载组件
const BlockEditor = lazy(() => import("@/components/editor/BlockEditor").then((m) => ({ default: m.BlockEditor })));
const DatabaseManager = lazy(() => import("@/components/database/DatabaseManager").then((m) => ({ default: m.DatabaseManager })));
const SearchDialog = lazy(() => import("@/components/search/SearchDialog").then((m) => ({ default: m.SearchDialog })));
const MovePageDialog = lazy(() => import("@/components/common/MovePageDialog").then((m) => ({ default: m.MovePageDialog })));
const ShortcutsHelpDialog = lazy(() => import("@/components/common/ShortcutsHelpDialog").then((m) => ({ default: m.ShortcutsHelpDialog })));

export default function Home() {
  const loadWorkspace = usePageStore((s) => s.loadWorkspace);
  const isLoaded = usePageStore((s) => s.isLoaded);
  const loadPage = usePageStore((s) => s.loadPage);
  const activeView = useUIStore((s) => s.activeView);
  const loadDatabases = useDatabaseStore((s) => s.loadDatabases);

  useKeyboardShortcuts();

  useEffect(() => {
    Promise.all([loadWorkspace(), loadDatabases()]).then(() => {
      const { rootPageIds } = usePageStore.getState();
      if (rootPageIds.length > 0) {
        loadPage(rootPageIds[0]);
      }
    });
  }, [loadWorkspace, loadDatabases, loadPage]);

  if (!isLoaded) {
    return <SkeletonLoader />;
  }

  return (
    <MainLayout>
      <ErrorBoundary>
        <Suspense fallback={<SkeletonLoader />}>
          {activeView === "database" ? <DatabaseManager /> : <BlockEditor />}
        </Suspense>
      </ErrorBoundary>
      <Suspense fallback={null}>
        <SearchDialog />
        <MovePageDialog />
        <ShortcutsHelpDialog />
      </Suspense>
    </MainLayout>
  );
}