"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, isAllowedFile } from "@/lib/utils";
import { toast } from "sonner";

interface DocumentUploadProps {
  onUploadComplete: () => void;
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter(isAllowedFile);

      if (fileArray.length === 0) {
        toast.error("Inga giltiga filer. Stödda format: PDF, DOCX, TXT, MD");
        return;
      }

      setUploading(true);
      const formData = new FormData();
      fileArray.forEach((f) => formData.append("files", f));

      try {
        const res = await fetch("/api/documents", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error ?? "Uppladdning misslyckades");

        const succeeded = data.results.filter((r: { success: boolean }) => r.success).length;
        const failed = data.results.filter((r: { success: boolean }) => !r.success).length;

        if (succeeded > 0) {
          toast.success(`${succeeded} dokument indexerade`);
        }
        if (failed > 0) {
          toast.error(`${failed} dokument misslyckades`);
        }

        onUploadComplete();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Uppladdning misslyckades");
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className="p-3 border-b border-border">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md"
        className="hidden"
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-lg border-2 border-dashed p-4 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-brand-accent bg-brand-accent/5"
            : "border-border hover:border-brand-accent/50"
        )}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="h-6 w-6 animate-spin text-brand-accent" />
            <p className="text-sm text-muted-foreground">Indexerar dokument...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <Upload className="h-6 w-6 text-brand-accent" />
            <p className="text-sm font-medium">Ladda upp dokument</p>
            <p className="text-xs text-muted-foreground">
              Dra & släpp eller klicka · PDF, DOCX, TXT, MD
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function DocumentUploadButton({ onUploadComplete }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));
    try {
      await fetch("/api/documents", { method: "POST", body: formData });
      onUploadComplete();
      toast.success("Dokument uppladdade");
    } catch {
      toast.error("Uppladdning misslyckades");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        size="sm"
        className="w-full bg-brand-accent text-brand-primary hover:bg-brand-accent/90"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Ladda upp
          </>
        )}
      </Button>
    </>
  );
}
