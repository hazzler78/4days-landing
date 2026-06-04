"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function SettingsPanel() {
  const [chunkSize, setChunkSize] = useState(1000);
  const [chunkOverlap, setChunkOverlap] = useState(200);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setChunkSize(data.settings.chunk_size);
          setChunkOverlap(data.settings.chunk_overlap);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chunk_size: chunkSize, chunk_overlap: chunkOverlap }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success("Inställningar sparade");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-muted-foreground">Laddar inställningar...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inställningar</h1>
        <p className="text-muted-foreground">
          Konfigurera hur dokument chunkas vid indexering
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chunk-inställningar</CardTitle>
          <CardDescription>
            Gäller för nya uppladdningar och re-indexering. Rekommenderat: 800–1200 tecken med 200 overlap.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chunkSize">Chunk-storlek (tecken)</Label>
              <Input
                id="chunkSize"
                type="number"
                min={200}
                max={4000}
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chunkOverlap">Overlap (tecken)</Label>
              <Input
                id="chunkOverlap"
                type="number"
                min={0}
                max={chunkSize - 1}
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(Number(e.target.value))}
              />
            </div>
            <Button type="submit" disabled={saving} className="bg-brand-primary hover:bg-brand-primary/90">
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Spara inställningar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
