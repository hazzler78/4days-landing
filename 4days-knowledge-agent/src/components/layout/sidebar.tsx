"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DocumentUpload } from "@/components/documents/document-upload";
import { DocumentList } from "@/components/documents/document-list";
import type { Document } from "@/types/database";

interface SidebarProps {
  className?: string;
}

export function SidebarContent({ onRefresh }: { onRefresh?: () => void }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  function handleRefresh() {
    fetchDocuments();
    onRefresh?.();
  }

  return (
    <div className="flex flex-col h-full bg-sidebar">
      <DocumentUpload onUploadComplete={handleRefresh} />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Laddar...
        </div>
      ) : (
        <DocumentList documents={documents} onRefresh={handleRefresh} />
      )}
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={`hidden lg:flex w-80 flex-col border-r border-border ${className ?? ""}`}>
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SidebarContent onRefresh={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
