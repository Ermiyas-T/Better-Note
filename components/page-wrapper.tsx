//page wrapper using breadcrumb
import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "@/components/modeToggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
export type PageWrapperProps = {
  children: React.ReactNode;
};
export default function PageWrapper({ children }: PageWrapperProps) {
  //add modetoggle for theme change
  return (
    <div className="w-full">
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2  px-4 border-2 justify-between ">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Better Note</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          <div>
            <ModeToggle />
          </div>
        </header>
        {children}
      </SidebarInset>
    </div>
  );
}
