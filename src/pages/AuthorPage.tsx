import { Link, useParams } from "react-router-dom";
import { get } from "../services/authorService";
import { search } from "../services/bookService";
import { useAsync } from "../lib/hooks";
import BookLink from "../components/BookLink";
import { ErrorState, GridSkeleton } from "../components/States";

export default function AuthorPage() {
  const { id = "" } = useParams();
  const a = useAsync((s) => get(id, s), [id]);
  const name = a.data?.name;
  const w = useAsync(async (s) => (name ? search({ author: name }, s) : { books: [], total: 0 }), [name]);
  if (a.error) return <div className="wrap py-12"><ErrorState message={a.error} retry={a.retry} /><Link to="/authors" className="btn-ghost mt-4">All authors</Link></div>;
  document.title = `${name ?? "Author"} | BOOKVERSE`;
  return (
    <div className="wrap py-12">
      {a.loading ? <div className="h-14 w-1/2 animate-pulse bg-beige" /> : (
        <>
          <h1 className="font-display text-4xl md:text-6xl">{name}</h1>
          {a.data?.born && <p className="mt-2 text-muted">Born {a.data.born}</p>}
          <p className="mt-6 max-w-xl font-display text-xl leading-relaxed">{a.data?.note || "No biography is available for this author."}</p>
          <h2 className="h-section mt-16">Published works</h2>
        </>
      )}
      {w.loading ? <GridSkeleton n={4} /> : w.error ? <ErrorState message={w.error} retry={w.retry} /> : w.data?.books.length ? <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">{w.data.books.map((b) => <li key={b.id}><BookLink book={b} /></li>)}</ul> : <p className="mt-6 text-muted">No works found in the catalogue.</p>}
    </div>
  );
}
