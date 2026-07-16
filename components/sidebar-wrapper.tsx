"use client";

import { AppSidebar } from "./app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotebooks } from "./notebook-context";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Search } from "lucide-react";

export default function SidebarWrapper() {
  const { notebooks, isLoading } = useNotebooks();

  if (isLoading) {
    return (
      <Sidebar>
        <SidebarHeader className="w-full bg-accent">
          <div className="relative w-full px-4 py-2">
            <Skeleton className="h-9 w-full rounded-md" />
            <Search className="pointer-events-none absolute left-6 top-1/2 size-4 -translate-y-1/2 opacity-30 select-none" />
          </div>
        </SidebarHeader>
        <SidebarContent className="gap-0">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {[...Array(6)].map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  return <AppSidebar notebooks={notebooks} />;
}
