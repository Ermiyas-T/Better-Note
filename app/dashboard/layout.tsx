import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarWrapper from "@/components/sidebar-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarWrapper />
      {children}
    </SidebarProvider>
  );
}
