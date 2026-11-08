export interface Book {
  id: string; source: "mock" | "openlibrary" | "googlebooks"; title: string; author: string; year?: number; genre: string;
  blurb: string; bg?: string; fg?: string; coverUrl?: string; publisher?: string; pages?: number;
  isbn?: string[]; subjects?: string[]; rating?: number; ratingsCount?: number;
}
// Mock data: public-domain classics. Covers are generated typographically (no external images).
const raw: Omit<Book, "source">[] = [
  { id: "pride-and-prejudice", title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Classics", bg: "#783F46", fg: "#F8F6F1", blurb: "Elizabeth Bennet and Mr Darcy misjudge each other across the drawing rooms of Regency England, in a comedy of manners about money, marriage and first impressions." },
  { id: "frankenstein", title: "Frankenstein", author: "Mary Shelley", year: 1818, genre: "Gothic", bg: "#24231F", fg: "#DDD5C8", blurb: "A young scientist gives life to a creature he then abandons. A novel about ambition, responsibility and loneliness." },
  { id: "moby-dick", title: "Moby-Dick", author: "Herman Melville", year: 1851, genre: "Adventure", bg: "#DDD5C8", fg: "#24231F", blurb: "Captain Ahab pursues the white whale across the oceans while Ishmael narrates, digresses and watches the hunt turn to obsession." },
  { id: "jane-eyre", title: "Jane Eyre", author: "Charlotte Brontë", year: 1847, genre: "Classics", bg: "#CFC5B7", fg: "#783F46", blurb: "An orphan becomes a governess at Thornfield Hall and has to decide what independence is worth." },
  { id: "dracula", title: "Dracula", author: "Bram Stoker", year: 1897, genre: "Gothic", bg: "#5A2C33", fg: "#EAE5DC", blurb: "Told through letters and diary entries, a group of friends races to stop a count who has moved from Transylvania to London." },
  { id: "dorian-gray", title: "The Picture of Dorian Gray", author: "Oscar Wilde", year: 1890, genre: "Gothic", bg: "#EAE5DC", fg: "#24231F", blurb: "A beautiful young man stays unchanged while his portrait takes on the marks of his choices." },
  { id: "great-expectations", title: "Great Expectations", author: "Charles Dickens", year: 1861, genre: "Classics", bg: "#77766F", fg: "#F8F6F1", blurb: "Pip, a blacksmith's apprentice, receives a mysterious fortune and learns what it costs." },
  { id: "wuthering-heights", title: "Wuthering Heights", author: "Emily Brontë", year: 1847, genre: "Gothic", bg: "#3A3732", fg: "#CFC5B7", blurb: "Two households on the Yorkshire moors are bound together by Heathcliff and Catherine's fierce, destructive attachment." },
  { id: "the-odyssey", title: "The Odyssey", author: "Homer", genre: "Mythology", bg: "#783F46", fg: "#DDD5C8", blurb: "Odysseus spends ten years trying to reach Ithaca after the fall of Troy, while his family waits." },
  { id: "meditations", title: "Meditations", author: "Marcus Aurelius", year: 180, genre: "Philosophy", bg: "#F8F6F1", fg: "#783F46", blurb: "Private notes written by a Roman emperor on duty, impermanence and how to meet each day." },
  { id: "walden", title: "Walden", author: "Henry David Thoreau", year: 1854, genre: "Nature", bg: "#AAA49A", fg: "#24231F", blurb: "Two years in a cabin by a Massachusetts pond, and a case for living deliberately." },
  { id: "alice", title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", year: 1865, genre: "Fantasy", bg: "#EAE5DC", fg: "#783F46", blurb: "Alice follows a white rabbit down a hole into a world where logic and language keep slipping." }
];
export const books: Book[] = raw.map((b) => ({ ...b, source: "mock" as const }));
export const genres = ["Classics", "Gothic", "Adventure", "Philosophy", "Nature", "Fantasy", "Mythology"];
export const authors = [
  { name: "Jane Austen", note: "Wrote six novels of social observation, from Sense and Sensibility to Persuasion." },
  { name: "Mary Shelley", note: "Published Frankenstein at nineteen and helped define modern science fiction." },
  { name: "Charlotte Brontë", note: "Author of Jane Eyre, and one of three novelist sisters from Haworth." },
  { name: "Oscar Wilde", note: "Playwright, essayist and the author of one novel, Dorian Gray." }
];
export const getBook = (id?: string) => books.find((b) => b.id === id);
export const slug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const byAuthor = (name: string) => books.filter((b) => b.author === name);
