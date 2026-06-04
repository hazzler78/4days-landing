"use client";

import { useState } from "react";
import {
  FileText,
  Trash2,
  RefreshCw,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { Document } from "@/types/database";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DocumentListProps {
  documents: Document[];
  onRefresh: () => void;
}

const statusConfig = {
  pending: { label: "Väntar", variant: "secondary" as const, icon: Loader2 },
  processing: { label: "Bearbetar", variant: "secondary" as const, icon: Loader2 },
  indexed: { label: "Indexerad", variant: "default" as const, icon: CheckCircle2 },
  error: { label: "Fel", variant: "destructive" as const, icon: AlertCircle },
};

export function DocumentList({ documents, onRefresh }: DocumentListProps) {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = documents.filter((d) =>
    d.filename.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm("Ta bort detta dokument och alla dess chunks?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Kunde inte ta bort");
      toast.success("Dokument borttaget");
      onRefresh();
    } catch {
      toast.error("Kunde inte ta bort dokument");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleReindex(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/documents/${id}/reindex`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Re-indexerad (${data.chunkCount} chunks)`);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Re-indexering misslyckades");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Dokument</h2>
          <Badge variant="outline" className="text-xs">
            {documents.length}
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Sök dokument..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 pb-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
              {search ? "Inga matchande dokument" : "Inga dokument ännu"}
            </div>
          ) : (
            filtered.map((doc) => {
              const status = statusConfig[doc.status];
              const StatusIcon = status.icon;
              const isLoading = loadingId === doc.id;

              return (
                <div
                  key={doc.id}
                  className="rounded-lg border border-border p-3 space-y-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 shrink-0 text-brand-accent" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate" title={doc.filename}>
                        {doc.filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(doc.file_size)} · {formatDate(doc.created_at)}
                      </p>
                      {doc.chunk_count > 0 && (
                        <p className="text-xs text-brand-green">
                          {doc.chunk_count} chunks
                        </p>
                      )}
                      {doc.error_message && (
                        <p className="text-xs text-destructive mt-1">{doc.error_message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={status.variant}
                      className={cn(
                        "text-xs gap-1",
                        doc.status === "indexed" && "bg-brand-green/10 text-brand-green border-brand-green/20"
                      )}
                    >
                      <StatusIcon
                        className={cn(
                          "h-3 w-3",
                          (doc.status === "processing" || doc.status === "pending") && "animate-spin"
                        )}
                      />
                      {status.label}
                    </Badge>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleReindex(doc.id)}
                        disabled={isLoading}
                        title="Re-indexera"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(doc.id)}
                        disabled={isLoading}
                        title="Ta bort"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
