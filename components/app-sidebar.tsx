"use client";
import {
  BookIcon,
  ChevronRight,
  FolderClosed,
} from "lucide-react";

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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchForm } from "./search-form";
import type { NotebookItem } from "./notebook-context";

interface SidebarNoteItem {
  title: string;
  url: string;
  isActive: boolean;
}

interface SidebarNotebookItem {
  title: string;
  id: string;
  url: string;
  isActive: boolean;
  items: SidebarNoteItem[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  notebooks: NotebookItem[];
}

export function AppSidebar({ notebooks, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  // search parameter to filter from url
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
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
  const filteredData = data.navMain.filter((notebook) => {
    const notebooks = notebook.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const notes = notebook.items.filter((note) => {
      const notes = note.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return notes;
    });
    return notebooks || notes.length > 0;
  });
  return (
    <Sidebar {...props}>
      <SidebarHeader className="w-full bg-accent ">
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {filteredData.map((notebook: SidebarNotebookItem) => (
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
                    {notebook.items.map((item: SidebarNoteItem) => (
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
