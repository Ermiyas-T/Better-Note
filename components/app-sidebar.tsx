"use client";
import { ChevronRight } from "lucide-react";

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
  // SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { getNotebooks } from "@/Server/notebook";
import Link from "next/link";
import { useState } from "react";
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
  const data = {
    navMain:
      notebooks?.map((notebook) => {
        return {
          title: notebook.name,
          url: `/dashboard/${notebook.id}`,
          items:
            notebook.notes?.map((note) => {
              return {
                title: note.title,
                url: `/dashboard/notes/${note.id}`,
              };
            }) || [],
        };
      }) || [],
  };
  return (
    <Sidebar {...props}>
      {/* <SidebarHeader>
        <SearchForm />
      </SidebarHeader> */}
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((notebook: any) => (
          <Collapsible
            key={notebook.title}
            title={notebook.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {notebook.title}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {notebook.items.map((item: any) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url}>{item.title}</Link>
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
