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
      <SidebarHeader className="w-full border-b border-sidebar-border">
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            {notebooks.length === 0 ? (
              <>
                <FolderClosed className="mb-2 h-8 w-8 text-sidebar-ring/40" />
                <p className="text-xs text-sidebar-ring/60">No notebooks yet</p>
              </>
            ) : (
              <p className="text-xs text-sidebar-ring/60">No matching notebooks</p>
            )}
          </div>
        ) : (
          filteredData.map((notebook: SidebarNotebookItem) => (
            <Collapsible
              key={notebook.url}
              title={notebook.title}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  className={`group/label flex w-full items-center gap-2 py-3 text-sm font-medium ${
                    notebook.isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <div
                    className={`flex min-w-0 flex-1 items-center gap-2 hover:cursor-pointer ${
                      notebook.isActive ? "font-medium" : ""
                    }`}
                    onClick={() =>
                      router.push(`/dashboard/notebooks/${notebook.id}`)
                    }
                  >
                    <FolderClosed className="size-4 shrink-0" />
                    <span className="truncate">{notebook.title}</span>
                  </div>
                  <CollapsibleTrigger className="shrink-0">
                    <ChevronRight className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="pl-2">
                      {notebook.items.length === 0 ? (
                        <SidebarMenuItem>
                          <span className="px-6 py-1.5 text-xs text-sidebar-ring/50">
                            No notes
                          </span>
                        </SidebarMenuItem>
                      ) : (
                        notebook.items.map((item: SidebarNoteItem) => (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton
                              asChild
                              className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                                item.isActive
                                  ? "bg-sidebar-accent/50 text-foreground font-medium border-l-2 border-primary"
                                  : "text-muted-foreground border-l-2 border-transparent"
                              }`}
                              onClick={() => router.push(item.url)}
                            >
                              <Link
                                href={item.url}
                                className="flex items-center gap-2 hover:cursor-pointer"
                              >
                                <BookIcon className="size-4 shrink-0 text-sidebar-ring" />
                                <span className="truncate">{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
