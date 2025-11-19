import { AppSidebar } from "@/components/app-sidebar";
import NoteBooks from "@/components/notebooks";
import PageWrapper from "@/components/page-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";

// This is now a Server Component by default (no 'use client')
export default function DashboardPage() {
  return (
    <PageWrapper breadcrumbs={[{ href: "/dashboard", label: "Dashboard" }]}>
      <NoteBooks />
    </PageWrapper>
  );
}
