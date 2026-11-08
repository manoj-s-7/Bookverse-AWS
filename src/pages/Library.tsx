import { useState } from "react";
import { Link } from "react-router-dom";
import { STATUSES, Status, useLibrary } from "../lib/library";
import Cover from "../components/Cover";

export default function Library() {
  document.title = "My Library | BOOKVERSE";
  const { shelf, set, remove } = useLibrary();
  const [q, setQ] = useState("");
  const all = Object.values(shelf);
  const items = all.filter(({ book: b }) => `${b.title} ${b.author}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="wrap py-12">
      <h1 className="font-display text-4xl md:text-5xl">My Library</h1>
      {all.length === 0 ? (
        <div className="mt-10 max-w-md"><h2 className="font-display text-2xl">Your shelf is empty</h2><p className="mt-2 text-muted">Open any book and choose Add to library. It is saved in this browser.</p><Link to="/explore" className="btn-primary mt-6">Explore books</Link></div>
      ) : (
        <>
          <label htmlFor="lq" className="sr-only">Search your library</label>
          <input id="lq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your library" className="mt-8 min-h-[52px] w-full max-w-md border-b-2 border-ink bg-transparent outline-none placeholder:text-subtle focus:border-burgundy" />
          {STATUSES.map((s) => {
            const group = items.filter((i) => i.status === s);
            if (!group.length) return null;
            return (
              <section key={s} className="mt-12">
                <h2 className="border-b border-ink pb-2 font-display text-2xl">{s} <span className="text-base text-muted">{group.length}</span></h2>
                <ul className="divide-y divide-taupe">
                  {group.map(({ book: b }) => (
                    <li key={b.id} className="flex flex-wrap items-center gap-4 py-4">
                      <Link to={`/book/${b.id}`} className="flex min-w-0 flex-1 items-center gap-4 hover:text-burgundy"><Cover book={b} className="w-12 shrink-0" /><span><span className="block font-display text-lg">{b.title}</span><span className="text-sm text-muted">{b.author}</span></span></Link>
                      <select aria-label={`Status for ${b.title}`} value={s} onChange={(e) => set(b, e.target.value as Status)} className="min-h-[44px] border border-taupe bg-ivory px-2 text-sm">{STATUSES.map((x) => <option key={x}>{x}</option>)}</select>
                      <button className="min-h-[44px] px-2 text-sm text-muted hover:text-burgundy" onClick={() => remove(b.id)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          {items.length === 0 && <p className="mt-10 text-muted">Nothing in your library matches that search.</p>}
        </>
      )}
    </div>
  );
}
