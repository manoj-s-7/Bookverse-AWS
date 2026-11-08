// Optional provider (public-domain texts). Not wired into bookService yet; kept as the extension point.
import { getJson } from "./apiClient";
export const searchGutendex = (q: string, signal?: AbortSignal) => getJson<{ count: number; results: { id: number; title: string; authors: { name: string }[] }[] }>(`https://gutendex.com/books/?search=${encodeURIComponent(q)}`, signal);
