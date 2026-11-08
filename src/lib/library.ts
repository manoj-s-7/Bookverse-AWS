import type { Book } from "../data/books";
import { createStore } from "./store";
export const STATUSES = ["Want to Read", "Currently Reading", "Completed", "Paused"] as const;
export type Status = (typeof STATUSES)[number];
type Shelf = Record<string, { status: Status; book: Book }>;
const store = createStore<Shelf>("bookverse.library.v2", {});
export function useLibrary() {
  const shelf = store.use();
  return {
    shelf,
    set: (book: Book, status: Status) => store.write({ ...shelf, [book.id]: { status, book } }),
    remove: (id: string) => { const n = { ...shelf }; delete n[id]; store.write(n); }
  };
}
