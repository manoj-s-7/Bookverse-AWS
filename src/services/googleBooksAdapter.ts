import type { Book } from "../data/books";
import { getJson } from "./apiClient";
const BASE = "https://www.googleapis.com/books/v1/volumes";
const KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY as string | undefined;
export const isConfigured = Boolean(KEY);
interface Vol { id: string; volumeInfo: { title: string; authors?: string[]; description?: string; publishedDate?: string; publisher?: string; pageCount?: number; categories?: string[]; averageRating?: number; ratingsCount?: number; imageLinks?: { thumbnail?: string }; industryIdentifiers?: { identifier: string }[] } }
const normalize = (v: Vol): Book => {
  const i = v.volumeInfo;
  return {
    id: `gb:${v.id}`, source: "googlebooks", title: i.title, author: i.authors?.[0] ?? "Unknown author", year: i.publishedDate ? parseInt(i.publishedDate, 10) || undefined : undefined,
    genre: i.categories?.[0] ?? "Book", blurb: (i.description ?? "").replace(/<[^>]+>/g, ""), coverUrl: i.imageLinks?.thumbnail?.replace("http://", "https://").replace("&edge=curl", ""),
    publisher: i.publisher, pages: i.pageCount, isbn: i.industryIdentifiers?.map((x) => x.identifier), subjects: i.categories, rating: i.averageRating, ratingsCount: i.ratingsCount
  };
};
const k = () => (KEY ? `&key=${KEY}` : "");
export async function search(q: string, page: number, signal?: AbortSignal) {
  const r = await getJson<{ totalItems: number; items?: Vol[] }>(`${BASE}?q=${encodeURIComponent(q)}&startIndex=${(page - 1) * 20}&maxResults=20${k()}`, signal);
  return { books: (r.items ?? []).map(normalize), total: r.totalItems };
}
export async function volume(id: string, signal?: AbortSignal) { return normalize(await getJson<Vol>(`${BASE}/${id}?${k().slice(1)}`, signal)); }
