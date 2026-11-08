import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LayoutGrid, List, Search } from "lucide-react";
import { genres, type Book } from "../data/books";
import { PAGE, isLive, search } from "../services/bookService";
import { useDebounced } from "../lib/hooks";
import BookLink from "../components/BookLink";
import Cover from "../components/Cover";
import { Empty, ErrorState, GridSkeleton } from "../components/States";

export default function Explore() {
  document.title = "Explore books | BOOKVERSE";
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") ?? "", genre = sp.get("genre") ?? "", century = sp.get("century") ?? "", sort = sp.get("sort") ?? "";
  const dq = useDebounced(q);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [items, setItems] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const upd = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }); };
  useEffect(() => { setPage(1); }, [dq, genre, century, sort]);
  useEffect(() => {
    const c = new AbortController();
    setLoading(true); setError("");
    search({ q: dq, genre, century, sort, page }, c.signal).then(
      (r) => { setItems((prev) => { if (page === 1) return r.books; const seen = new Set(prev.map((b) => b.id)); return prev.concat(r.books.filter((b) => !seen.has(b.id))); }); setTotal(r.total); setLoading(false); },
      (e) => { if (!c.signal.aborted) { setError(e instanceof Error ? e.message : "Search failed."); setLoading(false); } }
    );
    return () => c.abort();
  }, [dq, genre, century, sort, page, tick]);
  const chip = (on: boolean) => `min-h-[40px] border px-4 text-sm transition-colors ${on ? "border-burgundy bg-burgundy text-ivory" : "border-taupe hover:border-burgundy"}`;
  const sel = "min-h-[40px] border border-taupe bg-ivory px-2";
  const shown = sort === "title" && isLive ? [...items].sort((a, b) => a.title.localeCompare(b.title)) : items;
  return (
    <div className="wrap py-12">
      <h1 className="font-display text-4xl md:text-5xl">Explore books</h1>
      <div role="search" className="mt-8 flex border-b-2 border-ink focus-within:border-burgundy">
        <Search size={20} className="my-auto mr-3 shrink-0 text-muted" aria-hidden="true" />
        <label htmlFor="q" className="sr-only">Search by title, author or ISBN</label>
        <input id="q" value={q} onChange={(e) => upd("q", e.target.value)} placeholder="Search by title, author or ISBN" className="min-h-[52px] w-full bg-transparent outline-none placeholder:text-subtle" />
      </div>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Genre">
        <button className={chip(!genre)} onClick={() => upd("genre", "")} aria-pressed={!genre}>All</button>
        {genres.map((g) => <button key={g} className={chip(genre === g)} onClick={() => upd("genre", g)} aria-pressed={genre === g}>{g}</button>)}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
        <span className="text-muted" aria-live="polite">{loading && page === 1 ? "Searching" : `${total.toLocaleString()} ${total === 1 ? "book" : "books"}`}</span>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">Published<select value={century} onChange={(e) => upd("century", e.target.value)} className={sel}><option value="">Any year</option><option value="pre1800">Before 1800</option><option value="1800">1800s</option><option value="1900">1900s</option><option value="2000">2000 onward</option></select></label>
          <label className="flex items-center gap-2">Sort<select value={sort} onChange={(e) => upd("sort", e.target.value)} className={sel}><option value="">Relevance</option><option value="title">Title</option><option value="new">Newest</option><option value="old">Oldest</option></select></label>
          <button onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"} className={`flex h-10 w-10 items-center justify-center ${view === "grid" ? "text-burgundy" : ""}`}><LayoutGrid size={20} /></button>
          <button onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"} className={`flex h-10 w-10 items-center justify-center ${view === "list" ? "text-burgundy" : ""}`}><List size={20} /></button>
        </div>
      </div>
      {error ? <ErrorState message={error} retry={() => setTick((n) => n + 1)} />
        : loading && page === 1 ? <GridSkeleton />
        : shown.length === 0 ? (
          <Empty title="No books match that search">Check the spelling, or clear the filters to search the whole catalogue.<div><button className="btn-ghost mt-6" onClick={() => setSp({}, { replace: true })}>Clear search and filters</button></div></Empty>
        ) : view === "grid" ? (
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{shown.map((b) => <li key={b.id}><BookLink book={b} /></li>)}</ul>
        ) : (
          <ul className="mt-6 divide-y divide-taupe border-y border-taupe">
            {shown.map((b) => (
              <li key={b.id}><Link to={`/book/${b.id}`} className="group flex gap-5 py-4">
                <Cover book={b} className="w-16 shrink-0" />
                <div><div className="font-display text-xl group-hover:text-burgundy">{b.title}</div><div className="text-sm text-muted">{b.author}{b.year ? `, ${b.year}` : ""} · {b.genre}</div>{b.blurb && <p className="mt-2 hidden max-w-xl text-sm text-muted sm:block">{b.blurb.slice(0, 180)}</p>}</div>
              </Link></li>
            ))}
          </ul>
        )}
      {!error && items.length > 0 && items.length < total && (
        <div className="mt-12 text-center"><button className="btn-ghost" disabled={loading} onClick={() => setPage((p) => p + 1)}>{loading ? "Loading" : `Load more (${items.length} of ${total.toLocaleString()})`}</button></div>
      )}
      {isLive && <p className="mt-10 text-xs text-subtle">Catalogue data from Open Library, with Google Books as a fallback.</p>}
    </div>
  );
}
