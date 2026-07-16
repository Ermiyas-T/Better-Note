import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarWrapper from "@/components/sidebar-wrapper";
import { NotebookProvider } from "@/components/notebook-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <NotebookProvider>
        <SidebarWrapper />
        {children}
      </NotebookProvider>
    </SidebarProvider>
  );
}
