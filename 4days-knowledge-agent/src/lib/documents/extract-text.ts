import mammoth from "mammoth";

/** Extraherar ren text från uppladdade filer baserat på filtyp. */
export async function extractText(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "pdf" || mimeType === "application/pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text.trim();
  }

  if (
    ext === "docx" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  if (ext === "txt" || ext === "md" || mimeType.startsWith("text/")) {
    return buffer.toString("utf-8").trim();
  }

  throw new Error(`Filtyp stöds inte: ${ext ?? mimeType}`);
}
