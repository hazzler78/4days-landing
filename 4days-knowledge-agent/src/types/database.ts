export type DocumentStatus = "pending" | "processing" | "indexed" | "error";

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: DocumentStatus;
  error_message: string | null;
  chunk_count: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  sources: SourceReference[] | null;
  created_at: string;
}

export interface SourceReference {
  documentId: string;
  documentFilename: string;
  chunkIndex: number;
  content: string;
  similarity: number;
}

export interface AppSettings {
  id: number;
  chunk_size: number;
  chunk_overlap: number;
  updated_at: string;
}

export interface MatchedChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  similarity: number;
  document_filename: string;
}
