"use client";

import { useEffect, useState } from "react";
import { RefreshCw, FileText, Database, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatFileSize } from "@/lib/utils";
import { toast } from "sonner";

interface AdminStats {
  totalDocuments: number;
  indexedDocuments: number;
  errorDocuments: number;
  totalChunks: number;
}

interface AdminDocument {
  id: string;
  filename: string;
  status: string;
  chunk_count: number;
  file_size: number;
  created_at: string;
  error_message?: string;
}

export function AdminPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [reindexing, setReindexing] = useState(false);

  async function fetchAdmin() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setDocuments(data.documents);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmin();
  }, []);

  async function handleReindexAll() {
    if (!confirm("Re-indexera alla dokument? Detta kan ta tid.")) return;
    setReindexing(true);
    try {
      const res = await fetch("/api/documents/reindex-all", { method: "POST" });
      const data = await res.json();
      const ok = data.results.filter((r: { success: boolean }) => r.success).length;
      toast.success(`${ok} dokument re-indexerade`);
      fetchAdmin();
    } catch {
      toast.error("Re-indexering misslyckades");
    } finally {
      setReindexing(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-muted-foreground">Laddar admin-data...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="text-muted-foreground">Översikt av kunskapsbasen</p>
        </div>
        <Button
          onClick={handleReindexAll}
          disabled={reindexing}
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${reindexing ? "animate-spin" : ""}`} />
          Re-indexera alla
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Dokument", value: stats?.totalDocuments ?? 0, icon: FileText },
          { label: "Indexerade", value: stats?.indexedDocuments ?? 0, icon: CheckCircle2 },
          { label: "Fel", value: stats?.errorDocuments ?? 0, icon: AlertCircle },
          { label: "Totalt chunks", value: stats?.totalChunks ?? 0, icon: Database },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-brand-primary">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chunks per dokument</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {documents.length === 0 ? (
              <p className="text-muted-foreground text-sm">Inga dokument</p>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{doc.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(doc.file_size)} · {formatDate(doc.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={doc.status === "indexed" ? "default" : "secondary"}
                      className={doc.status === "indexed" ? "bg-brand-green/10 text-brand-green" : ""}
                    >
                      {doc.chunk_count} chunks
                    </Badge>
                    <Badge variant="outline">{doc.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
