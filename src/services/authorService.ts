import { authors as notes, books, slug } from "../data/books";
import * as ol from "./openLibraryAdapter";
import { isLive } from "./bookService";
import { ApiError } from "./apiClient";
export interface Author { id: string; name: string; note?: string; born?: string; works?: number; topWork?: string }
const mockAuthors: Author[] = [...new Set(books.map((b) => b.author))].map((name) => ({ id: slug(name), name, note: notes.find((n) => n.name === name)?.note, works: books.filter((b) => b.author === name).length }));
export async function search(q: string, signal?: AbortSignal): Promise<Author[]> {
  const t = q.trim().toLowerCase();
  if (isLive && t) return ol.searchAuthors(q, signal);
  return mockAuthors.filter((a) => a.name.toLowerCase().includes(t));
}
export async function get(id: string, signal?: AbortSignal): Promise<Author> {
  const m = mockAuthors.find((a) => a.id === id); if (m) return m;
  if (id.startsWith("ol:")) return ol.author(id.slice(3), signal);
  throw new ApiError("This author could not be found.", 404);
}
