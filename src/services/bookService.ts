import { books as mock, getBook, type Book } from "../data/books";
import * as ol from "./openLibraryAdapter";
import * as gb from "./googleBooksAdapter";
import { ApiError } from "./apiClient";
export const isLive = import.meta.env.VITE_DATA_MODE === "live";
export interface SearchParams { q?: string; genre?: string; author?: string; century?: string; sort?: string; page?: number }
export const PAGE = isLive ? 20 : 8;
const RANGES: Record<string, [number, number]> = { pre1800: [0, 1799], "1800": [1800, 1899], "1900": [1900, 1999], "2000": [2000, 2099] };
const cache = new Map<string, { books: Book[]; total: number }>();

function mockSearch(p: SearchParams) {
  const t = (p.q ?? "").trim().toLowerCase(), r = p.century ? RANGES[p.century] : undefined;
  let l = mock.filter((b) => (!p.genre || b.genre === p.genre) && (!p.author || b.author === p.author) && (!t || `${b.title} ${b.author}`.toLowerCase().includes(t)) && (!r || (b.year !== undefined && b.year >= r[0] && b.year <= r[1])));
  l = [...l].sort((a, b) => p.sort === "new" ? (b.year ?? 0) - (a.year ?? 0) : p.sort === "old" ? (a.year ?? 0) - (b.year ?? 0) : p.sort === "title" ? a.title.localeCompare(b.title) : 0);
  const page = p.page ?? 1;
  return { books: l.slice((page - 1) * PAGE, page * PAGE), total: l.length };
}
const dedupe = (l: Book[]) => { const s = new Set<string>(); return l.filter((b) => { const k = `${b.title}|${b.author}`.toLowerCase(); return s.has(k) ? false : (s.add(k), true); }); };

export async function search(p: SearchParams, signal?: AbortSignal) {
  if (!isLive) return mockSearch(p);
  const key = JSON.stringify(p); const hit = cache.get(key); if (hit) return hit;
  const page = p.page ?? 1, q = (p.q ?? "").trim(), isbn = q.replace(/-/g, ""), r = p.century ? RANGES[p.century] : undefined;
  let query = p.author ? `author:"${p.author}"` : /^\d{9}[\dXx]$|^\d{13}$/.test(isbn) ? `isbn:${isbn}` : q;
  if (p.genre) query += ` subject:"${p.genre.toLowerCase()}"`;
  if (r) query += ` first_publish_year:[${r[0]} TO ${r[1]}]`;
  if (!query.trim()) query = 'subject:"classic literature"';
  const googleQuery = p.author ? `inauthor:"${p.author}"` : /^\d{9}[\dXx]$|^\d{13}$/.test(isbn) ? `isbn:${isbn}` : [q, p.genre && `subject:${p.genre}`].filter(Boolean).join(" ") || "subject:classics";
  const useGoogle = gb.isConfigured && !r;
  let res: { books: Book[]; total: number };
  try {
    if (useGoogle) {
      res = await gb.search(googleQuery, page, signal);
      if (!res.books.length) res = await ol.search(query, page, p.sort ?? "", signal);
    } else {
      res = await ol.search(query, page, p.sort ?? "", signal);
    }
  } catch (e) {
    if (signal?.aborted) throw e;
    try {
      res = await (useGoogle ? ol.search(query, page, p.sort ?? "", signal) : gb.search(googleQuery, page, signal));
    } catch {
      throw e;
    }
  }
  const out = { books: dedupe(res.books), total: res.total };
  cache.set(key, out); return out;
}
export async function get(id: string, signal?: AbortSignal): Promise<Book> {
  const local = getBook(id); if (local) return local;
  if (id.startsWith("ol:")) return ol.work(id.slice(3), signal);
  if (id.startsWith("gb:")) return gb.volume(id.slice(3), signal);
  throw new ApiError("This book could not be found.", 404);
}
