const DEFAULT_SEPARATORS = ["\n\n", "\n", ". ", "! ", "? ", "; ", ", ", " "];

/**
 * Rekursiv text-splitter – delar text i chunks med overlap.
 * Inspirerad av LangChain RecursiveCharacterTextSplitter.
 */
export function chunkText(
  text: string,
  chunkSize = 1000,
  chunkOverlap = 200
): string[] {
  if (!text.trim()) return [];

  const chunks: string[] = [];
  const separators = DEFAULT_SEPARATORS;

  function splitRecursive(input: string, sepIndex: number): string[] {
    if (input.length <= chunkSize) {
      return input.trim() ? [input.trim()] : [];
    }

    const separator = separators[sepIndex] ?? "";
    const parts = separator
      ? input.split(separator).filter((p) => p.trim())
      : input.split("");

    if (sepIndex >= separators.length - 1) {
      // Sista utväg: hårdklipp per tecken
      const result: string[] = [];
      for (let i = 0; i < input.length; i += chunkSize - chunkOverlap) {
        result.push(input.slice(i, i + chunkSize).trim());
      }
      return result.filter(Boolean);
    }

    const merged: string[] = [];
    let current = "";

    for (const part of parts) {
      const candidate = current
        ? current + separator + part
        : part;

      if (candidate.length <= chunkSize) {
        current = candidate;
      } else {
        if (current.trim()) merged.push(current.trim());
        if (part.length > chunkSize) {
          merged.push(...splitRecursive(part, sepIndex + 1));
          current = "";
        } else {
          current = part;
        }
      }
    }

    if (current.trim()) merged.push(current.trim());
    return merged;
  }

  const rawChunks = splitRecursive(text, 0);

  // Lägg till overlap mellan intilliggande chunks
  for (let i = 0; i < rawChunks.length; i++) {
    let chunk = rawChunks[i];
    if (i > 0 && chunkOverlap > 0) {
      const prev = rawChunks[i - 1];
      const overlapText = prev.slice(-chunkOverlap);
      if (overlapText && !chunk.startsWith(overlapText)) {
        chunk = overlapText + chunk;
      }
    }
    if (chunk.length > chunkSize + chunkOverlap) {
      chunk = chunk.slice(0, chunkSize + chunkOverlap);
    }
    chunks.push(chunk.trim());
  }

  return chunks.filter((c) => c.length > 20);
}
