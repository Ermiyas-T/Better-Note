"use client";

import { AppSidebar } from "./app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotebooks } from "./notebook-context";

export default function SidebarWrapper() {
  const { notebooks, isLoading } = useNotebooks();

  if (isLoading) {
    return (
      <div className="h-48 w-[310px] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="space-y-2 p-4">
          {[...Array(15)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return <AppSidebar notebooks={notebooks} />;
}
