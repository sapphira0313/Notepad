"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toast } from "@/components/common/Toast";
import { useUIStore } from "@/stores/useUIStore";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:shadow-lg"
      >
        跳到主内容
      </a>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          style={{ willChange: "scroll-position", transform: "translateZ(0)" }}
          role="main"
          aria-label="主内容区域"
        >
          {children}
        </main>
      </div>

      <Toast />
    </div>
  );
}
