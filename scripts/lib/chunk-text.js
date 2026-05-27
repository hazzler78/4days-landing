const DEFAULT_SEPARATORS = ['\n\n', '\n', '. ', '! ', '? ', '; ', ', ', ' '];

function chunkText(text, chunkSize = 1000, chunkOverlap = 200) {
  if (!text.trim()) return [];

  const chunks = [];

  function splitRecursive(input, sepIndex) {
    if (input.length <= chunkSize) {
      return input.trim() ? [input.trim()] : [];
    }

    const separator = DEFAULT_SEPARATORS[sepIndex] ?? '';
    const parts = separator ? input.split(separator).filter((p) => p.trim()) : input.split('');

    if (sepIndex >= DEFAULT_SEPARATORS.length - 1) {
      const result = [];
      for (let i = 0; i < input.length; i += chunkSize - chunkOverlap) {
        result.push(input.slice(i, i + chunkSize).trim());
      }
      return result.filter(Boolean);
    }

    const merged = [];
    let current = '';

    for (const part of parts) {
      const candidate = current ? current + separator + part : part;
      if (candidate.length <= chunkSize) {
        current = candidate;
      } else {
        if (current.trim()) merged.push(current.trim());
        if (part.length > chunkSize) {
          merged.push(...splitRecursive(part, sepIndex + 1));
          current = '';
        } else {
          current = part;
        }
      }
    }

    if (current.trim()) merged.push(current.trim());
    return merged;
  }

  const rawChunks = splitRecursive(text, 0);

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

module.exports = { chunkText };
