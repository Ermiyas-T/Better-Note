"use client";

import { AppSidebar } from "./app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotebooks } from "./notebook-context";

export default function SidebarWrapper() {
  const { notebooks, isLoading } = useNotebooks();

  if (isLoading) {
    return (
      <div className="flex h-screen w-[--sidebar-width] flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
          <div className="relative w-full">
            <Skeleton className="h-9 w-full rounded-md bg-sidebar-accent/50" />
            <Skeleton className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-sm bg-sidebar-accent/50" />
          </div>
        </div>
        <div className="flex-1 space-y-1 p-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-10 w-full rounded-md bg-sidebar-accent/30" />
              <div className="space-y-1 pl-6">
                <Skeleton className="h-7 w-3/4 rounded-md bg-sidebar-accent/20" />
                <Skeleton className="h-7 w-2/3 rounded-md bg-sidebar-accent/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <AppSidebar notebooks={notebooks} />;
}
