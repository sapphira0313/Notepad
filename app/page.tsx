"use client";

import React from "react";
import { Sidebar } from "../src/components/Sidebar";
import { Header } from "../src/components/Header";
import { EditorShell } from "../src/components/EditorShell";
import { TableView } from "../src/components/TableView";
import { useSidebarStore } from "../src/store/sidebarStore";

export default function HomePage() {
  const mainView = useSidebarStore((s) => s.mainView);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        {mainView === "table" ? <TableView /> : <EditorShell />}
      </div>
    </div>
  );
}
