import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getBook } from "../data/books";
import { useCollections } from "../lib/collections";
import Cover from "../components/Cover";

const curated = [
  { name: "Dark rooms and long nights", note: "Gothic novels where houses and moors become characters.", ids: ["frankenstein", "dracula", "wuthering-heights", "dorian-gray"] },
  { name: "Short books for slow evenings", note: "Reflective reading you can finish in a few sittings.", ids: ["meditations", "walden", "alice"] },
  { name: "Voyages", note: "Journeys by sea and by mind.", ids: ["the-odyssey", "moby-dick", "great-expectations"] }
];

export default function Collections() {
  document.title = "Collections | BOOKVERSE";
  const c = useCollections();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const create = (e: FormEvent) => { e.preventDefault(); c.create(name); setName(""); };
  return (
    <div className="wrap py-12">
      <h1 className="font-display text-4xl md:text-5xl">Collections</h1>
      <section className="mt-12">
        <h2 className="h-section">Your lists</h2>
        <form onSubmit={create} className="mt-6 flex max-w-md border-b-2 border-ink focus-within:border-burgundy"><label htmlFor="cn" className="sr-only">New list name</label><input id="cn" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name a new reading list" className="min-h-[48px] w-full bg-transparent outline-none placeholder:text-subtle" /><button className="px-3 text-sm font-medium hover:text-burgundy">Create list</button></form>
        <div className="mt-8 space-y-10">
          {c.all.map((col) => (
            <div key={col.id}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink pb-2">
                {editing === col.id ? (
                  <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); c.rename(col.id, draft); setEditing(null); }}><label className="sr-only" htmlFor="rn">List name</label><input id="rn" autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} className="min-h-[40px] border border-taupe bg-ivory px-2" /><button className="btn-primary min-h-[40px]">Save</button></form>
                ) : <h3 className="font-display text-2xl">{col.name} <span className="text-base text-muted">{col.books.length}</span></h3>}
                {col.id !== "wishlist" && editing !== col.id && <div className="flex gap-1 text-sm"><button className="min-h-[40px] px-2 hover:text-burgundy" onClick={() => { setEditing(col.id); setDraft(col.name); }}>Rename</button><button className="min-h-[40px] px-2 hover:text-burgundy" onClick={() => c.del(col.id)}>Delete</button></div>}
              </div>
              {col.books.length === 0 ? <p className="mt-3 text-sm text-muted">Empty. Open a book and use Add to {col.id === "wishlist" ? "wishlist" : "collection"}.</p> : (
                <ul className="mt-4 divide-y divide-taupe">{col.books.map((b) => (
                  <li key={b.id} className="flex items-center gap-4 py-3"><Link to={`/book/${b.id}`} className="flex min-w-0 flex-1 items-center gap-4 hover:text-burgundy"><Cover book={b} className="w-10 shrink-0" /><span><span className="block font-display text-lg">{b.title}</span><span className="text-sm text-muted">{b.author}</span></span></Link><button className="min-h-[44px] px-2 text-sm text-muted hover:text-burgundy" onClick={() => c.removeBook(col.id, b.id)}>Remove</button></li>
                ))}</ul>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="mt-20">
        <h2 className="h-section">Curated by BOOKVERSE</h2>
        <div className="mt-8 grid gap-12 md:grid-cols-3">
          {curated.map((k) => (
            <div key={k.name} className="border-t border-ink pt-5">
              <div className="flex gap-2">{k.ids.slice(0, 3).map((id) => { const b = getBook(id)!; return <Link key={id} to={`/book/${id}`} className="w-1/3" aria-label={b.title}><Cover book={b} /></Link>; })}</div>
              <h3 className="mt-5 font-display text-2xl">{k.name}</h3><p className="mt-1 text-sm text-muted">{k.note}</p>
              <p className="mt-2 text-sm">{k.ids.map((id) => getBook(id)!.title).join(", ")}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
