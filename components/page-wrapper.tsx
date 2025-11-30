//page wrapper using breadcrumb
"use client";
import React from "react";
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
  breadcrumbs: {
    label: string;
    href: string;
  }[]; // Changed from breadcrum to breadcrumb for consistency
};

export default function PageWrapper({
  children,
  breadcrumbs,
}: PageWrapperProps) {
  //add modetoggle for theme change
  // get note name from url and the breadcrum should be dynamic accordingly

  return (
    <div className="w-full">
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2  px-4 border-2 justify-between ">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div>
              {/**I want dynamic breadcrum with current page name  that show note opened from the dashboard
              dashboard/(notename) handle it professionally according to common practise**/}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={breadcrumb.label}>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbItem>
                          <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                        </BreadcrumbItem>
                      ) : (
                        <BreadcrumbItem>
                          <BreadcrumbLink
                            href={breadcrumb.href}
                            className="hover:underline"
                          >
                            {breadcrumb.label}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      )}
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </React.Fragment>
                  ))}
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
