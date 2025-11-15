"use client";
import { AppSidebar } from "@/components/app-sidebar";
import NoteBooks from "@/components/notebooks";
import PageWrapper from "@/components/page-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";

export default async function Page() {
  const params = useParams();
  const noteName = params.noteName;
  //combine noteName and breadcrumb
  // const breadcrumb = noteName ? ` / Dashboard/${noteName}` : "Dashboard";
  return (
    <SidebarProvider>
      <AppSidebar />
      <PageWrapper breadcrumbs={[{ href: "/dashboard", label: "Dashboard" }]}>
        <NoteBooks />
      </PageWrapper>
    </SidebarProvider>
  );
}
