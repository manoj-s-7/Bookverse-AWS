import { Link, useParams } from "react-router-dom";
import { books } from "../data/books";
import { get } from "../services/bookService";
import { useAsync } from "../lib/hooks";
import { STATUSES, Status, useLibrary } from "../lib/library";
import { useCollections } from "../lib/collections";
import BookLink from "../components/BookLink";
import Cover from "../components/Cover";
import { ErrorState } from "../components/States";

export default function BookPage() {
  const { id = "" } = useParams();
  const { data: book, error, loading, retry } = useAsync((s) => get(id, s), [id]);
  const lib = useLibrary();
  const cols = useCollections();
  if (loading) return <div className="wrap py-12" aria-busy="true"><div className="grid gap-10 md:grid-cols-[320px_1fr] md:gap-20"><div className="mx-auto aspect-[2/3] w-56 animate-pulse bg-beige md:w-full" /><div className="space-y-4"><div className="h-12 w-3/4 animate-pulse bg-beige" /><div className="h-5 w-1/3 animate-pulse bg-beige" /><div className="h-32 animate-pulse bg-beige" /></div></div></div>;
  if (error || !book) return <div className="wrap py-12"><ErrorState message={error ?? "This book could not be found."} retry={retry} /><Link to="/explore" className="btn-ghost mt-4">Back to Explore</Link></div>;
  document.title = `${book.title} | BOOKVERSE`;
  const status = lib.shelf[book.id]?.status;
  const wish = cols.all.find((c) => c.id === "wishlist");
  const inWish = !!wish?.books.some((b) => b.id === book.id);
  const related = book.source === "mock" ? books.filter((b) => b.genre === book.genre && b.id !== book.id).slice(0, 4) : [];
  const facts = [["Publisher", book.publisher], ["Pages", book.pages], ["ISBN", book.isbn?.slice(0, 2).join(", ")], ["Rating", book.rating ? `${book.rating} (${book.ratingsCount ?? 0} ratings)` : undefined]].filter(([, v]) => v);
  return (
    <div className="wrap py-12">
      <div className="grid gap-10 md:grid-cols-[320px_1fr] md:gap-20">
        <Cover book={book} className="mx-auto w-56 md:w-full" />
        <div>
          <p className="text-sm text-muted">{book.genre}{book.year ? `, ${book.year}` : ""}</p>
          <h1 className="mt-2 font-display text-4xl font-medium leading-tight md:text-6xl">{book.title}</h1>
          <p className="mt-2 text-lg">{book.author}</p>
          <p className="mt-6 max-w-xl font-display text-xl leading-relaxed">{book.blurb || "No description is available for this edition."}</p>
          {facts.length > 0 && <dl className="mt-6 grid max-w-xl grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">{facts.map(([k, v]) => <div key={k as string} className="contents"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>)}</dl>}
          {book.subjects && <p className="mt-4 max-w-xl text-sm text-muted">{book.subjects.join(", ")}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {status ? (
              <>
                <label className="flex items-center gap-2 text-sm">Status<select value={status} onChange={(e) => lib.set(book, e.target.value as Status)} className="min-h-[44px] border border-taupe bg-ivory px-3">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
                <button className="btn-ghost" onClick={() => lib.remove(book.id)}>Remove from library</button>
              </>
            ) : <button className="btn-primary" onClick={() => lib.set(book, "Want to Read")}>Add to library</button>}
            <button className="btn-ghost" onClick={() => (inWish ? cols.removeBook("wishlist", book.id) : cols.add("wishlist", book))} aria-pressed={inWish}>{inWish ? "Remove from wishlist" : "Add to wishlist"}</button>
            <select aria-label="Add to a collection" value="" onChange={(e) => e.target.value && cols.add(e.target.value, book)} className="min-h-[44px] border border-taupe bg-ivory px-3 text-sm"><option value="">Add to collection</option>{cols.all.filter((c) => c.id !== "wishlist").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <Link to={`/authors${book.source === "mock" ? "/" +  book.author.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : `?q=${encodeURIComponent(book.author)}`}`} className="btn-ghost">Explore author</Link>
          </div>
        </div>
      </div>
      {related.length > 0 && <section className="mt-20"><h2 className="h-section">More in {book.genre}</h2><ul className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">{related.map((b) => <li key={b.id}><BookLink book={b} /></li>)}</ul></section>}
    </div>
  );
}
