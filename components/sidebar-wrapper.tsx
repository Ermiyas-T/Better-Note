"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { getNotebooks } from "@/Server/notebook";
import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarWrapper() {
  const [notebooks, setNotebooks] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotebooks = async () => {
      try {
        const result = await getNotebooks();
        const data = result.notebooks;
        setNotebooks(data);
      } catch (err) {
        console.error("Failed to load notebooks:", err);
        setError("Failed to load notebooks");
        setNotebooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotebooks();
  }, []);

  if (isLoading) {
    return (
      <div className="h-48 w-[310px] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="space-y-2 p-4">
          {[...Array(15)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>;
  }

  return <AppSidebar initialNotebooks={notebooks} />;
}
