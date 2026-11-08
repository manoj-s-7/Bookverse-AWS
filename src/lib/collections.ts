import type { Book } from "../data/books";
import { createStore } from "./store";
export interface Collection { id: string; name: string; books: Book[] }
const store = createStore<Collection[]>("bookverse.collections.v1", [{ id: "wishlist", name: "Wishlist", books: [] }]);
export function useCollections() {
  const all = store.use();
  const w = (fn: (c: Collection) => Collection) => store.write(all.map(fn));
  return {
    all,
    create: (name: string) => name.trim() && store.write([...all, { id: `c${Date.now()}`, name: name.trim(), books: [] }]),
    rename: (id: string, name: string) => name.trim() && w((c) => (c.id === id ? { ...c, name: name.trim() } : c)),
    del: (id: string) => id !== "wishlist" && store.write(all.filter((c) => c.id !== id)),
    add: (id: string, b: Book) => w((c) => (c.id === id && !c.books.some((x) => x.id === b.id) ? { ...c, books: [...c.books, b] } : c)),
    removeBook: (id: string, bid: string) => w((c) => (c.id === id ? { ...c, books: c.books.filter((x) => x.id !== bid) } : c))
  };
}
