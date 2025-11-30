"use client";
import {
  BookIcon,
  ChevronRight,
  FolderClosed,
  PenBox,
  PenTool,
} from "lucide-react";

// import { SearchForm } from "@/components/search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  // SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { getNotebooks } from "@/Server/notebook";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config";
// notebooks is array of object
// the sidebar should imply the notebook name and note under it

// what about notes under the notebooks
// get notebookId or create function that will be used in the page
// create function for onclick
interface Note {
  id: string;
  title: string;
}

interface Notebook {
  id: string;
  name: string;
  notes?: Note[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  initialNotebooks: Notebook[];
}

export function AppSidebar({ initialNotebooks, ...props }: AppSidebarProps) {
  const [notebooks, setNotebooks] = useState<Notebook[]>(initialNotebooks);
  const pathname = usePathname();
  const isNotebookActive = (notebookId: string) => {
    return pathname.startsWith(`/dashboard/notebooks/${notebookId}`);
  };
  const isNoteActive = (noteurl: string) => {
    return pathname === noteurl;
  };
  const router = useRouter();
  const data = {
    navMain:
      notebooks?.map((notebook) => {
        return {
          title: notebook.name,
          id: notebook.id,
          url: `/dashboard/notebooks/${notebook.id}`,
          isActive: isNotebookActive(notebook.id),
          items:
            notebook.notes?.map((note) => {
              return {
                title: note.title,
                url: `/dashboard/notebooks/${notebook.id}/${note.id}`,
                isActive: isNoteActive(
                  `/dashboard/notebooks/${notebook.id}/${note.id}`
                ),
              };
            }) || [],
        };
      }) || [],
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row items-center gap-2 w-full font-bold text-2xl bg-accent text-accent-foreground">
        <div> Better Note</div>
        <PenTool className="h-4 w-4" />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((notebook: any) => (
          <Collapsible
            key={notebook.url}
            title={notebook.title}
            defaultOpen
            className="group/collapsible  "
          >
            <SidebarGroup>
              <SidebarGroupLabel
                className={`group/label text-base py-5 flex items-center w-full ${
                  notebook.isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <div
                  className="flex items-center gap-1 flex-1 hover:cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/notebooks/${notebook.id}`)
                  }
                >
                  <FolderClosed className="h-4 w-4" />
                  {notebook.title}
                </div>
                <CollapsibleTrigger>
                  <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                {/** handle active sidebar button */}
                {/** have professional space to the right */}
                <SidebarGroupContent>
                  <SidebarMenu className="pl-2">
                    {notebook.items.map((item: any) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-accent ${
                            item.isActive
                              ? "bg-sidebar-accent/50 text-foreground font-medium border-l-2 border-primary"
                              : "text-muted-foreground"
                          }`}
                          onClick={() => router.push(item.url)}
                        >
                          <Link
                            href={item.url}
                            className="flex items-center gap-2 hover:cursor-pointer"
                          >
                            <BookIcon className="h-4 w-4 text-sidebar-ring " />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
