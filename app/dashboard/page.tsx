"use client";
import { AppSidebar } from "@/components/app-sidebar";
import NoteBooks from "@/components/notebooks";
import PageWrapper from "@/components/page-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <PageWrapper breadcrumbs={[{ href: "/dashboard", label: "Dashboard" }]}>
        <NoteBooks />
      </PageWrapper>
    </SidebarProvider>
  );
}
