import NoteBooks from "@/components/notebooks";
import PageWrapper from "@/components/page-wrapper";

// This is now a Server Component by default (no 'use client')
export default function DashboardPage() {
  return (
    <PageWrapper breadcrumbs={[{ href: "/dashboard", label: "Dashboard" }]}>
      <NoteBooks />
    </PageWrapper>
  );
}
