
import React from "react";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ sidebar, topbar, children }) => (
  <div className="min-h-screen bg-background flex flex-col">
    {topbar && (
      <header className="w-full border-b border-border bg-white px-8 py-4 flex items-center z-10">
        {topbar}
      </header>
    )}
    <div className="flex flex-1 w-full">
      {sidebar && (
        <nav className="hidden md:block min-w-[230px] max-w-[270px] border-r border-border bg-muted/75 px-6 py-8">
          {sidebar}
        </nav>
      )}
      <main
        className={cn(
          "flex-1 px-4 sm:px-8 py-10 flex flex-col gap-8 items-stretch",
          sidebar ? "" : "max-w-3xl mx-auto"
        )}
      >
        {children}
      </main>
    </div>
  </div>
);

export default AppLayout;
