import type { Book } from "../data/books";
import { ApiError, getJson } from "./apiClient";
const BASE = "https://openlibrary.org";
interface Doc { key: string; title: string; author_name?: string[]; first_publish_year?: number; cover_i?: number; isbn?: string[]; subject?: string[]; publisher?: string[]; number_of_pages_median?: number; ratings_average?: number; ratings_count?: number }
const FIELDS = "key,title,author_name,first_publish_year,cover_i,isbn,subject,publisher,number_of_pages_median,ratings_average,ratings_count";
const text = (v?: string | { value: string }) => (typeof v === "string" ? v : v?.value ?? "");
const normalize = (d: Doc): Book => ({
  id: `ol:${d.key.replace("/works/", "")}`, source: "openlibrary", title: d.title, author: d.author_name?.[0] ?? "Unknown author",
  year: d.first_publish_year, genre: d.subject?.[0] ?? "Book", blurb: "", coverUrl: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg` : undefined,
  isbn: d.isbn?.slice(0, 3), subjects: d.subject?.slice(0, 8), publisher: d.publisher?.[0], pages: d.number_of_pages_median,
  rating: d.ratings_average ? Math.round(d.ratings_average * 10) / 10 : undefined, ratingsCount: d.ratings_count
});
export async function search(q: string, page: number, sort: string, signal?: AbortSignal) {
  const p = new URLSearchParams({ q, page: String(page), limit: "20", fields: FIELDS });
  if (sort === "new" || sort === "old") p.set("sort", sort);
  const r = await getJson<{ numFound: number; docs: Doc[] }>(`${BASE}/search.json?${p}`, signal);
  return { books: r.docs.map(normalize), total: r.numFound };
}
export async function work(id: string, signal?: AbortSignal): Promise<Book> {
  const [s, w] = await Promise.all([search(`key:/works/${id}`, 1, "", signal), getJson<{ description?: string | { value: string } }>(`${BASE}/works/${id}.json`, signal)]);
  if (!s.books[0]) throw new ApiError("This book could not be found.", 404);
  return { ...s.books[0], blurb: text(w.description) };
}
export interface OLAuthor { id: string; name: string; born?: string; works?: number; topWork?: string }
export async function searchAuthors(q: string, signal?: AbortSignal): Promise<OLAuthor[]> {
  const r = await getJson<{ docs: { key: string; name: string; birth_date?: string; work_count?: number; top_work?: string }[] }>(`${BASE}/search/authors.json?q=${encodeURIComponent(q)}&limit=24`, signal);
  return r.docs.map((d) => ({ id: `ol:${d.key}`, name: d.name, born: d.birth_date, works: d.work_count, topWork: d.top_work }));
}
export async function author(id: string, signal?: AbortSignal) {
  const r = await getJson<{ name: string; bio?: string | { value: string }; birth_date?: string }>(`${BASE}/authors/${id}.json`, signal);
  return { id: `ol:${id}`, name: r.name, born: r.birth_date, note: text(r.bio) };
}
