import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { search } from "../services/authorService";
import { useAsync, useDebounced } from "../lib/hooks";
import { Empty, ErrorState } from "../components/States";

export default function Authors() {
  document.title = "Authors | BOOKVERSE";
  const [q, setQ] = useState(new URLSearchParams(location.search).get("q") ?? "");
  const dq = useDebounced(q);
  const { data, error, loading, retry } = useAsync((s) => search(dq, s), [dq]);
  return (
    <div className="wrap py-12">
      <h1 className="font-display text-4xl md:text-5xl">Authors</h1>
      <div role="search" className="mt-8 flex border-b-2 border-ink focus-within:border-burgundy"><Search size={20} className="my-auto mr-3 text-muted" aria-hidden="true" /><label htmlFor="aq" className="sr-only">Search authors</label><input id="aq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search authors by name" className="min-h-[52px] w-full bg-transparent outline-none placeholder:text-subtle" /></div>
      {error ? <ErrorState message={error} retry={retry} /> : loading ? <p className="mt-10 text-muted" aria-busy="true">Searching authors</p> : !data?.length ? <Empty title="No authors found">Try a different spelling.</Empty> : (
        <ul className="mt-8 grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((a) => (
            <li key={a.id} className="border-t border-taupe"><Link to={`/authors/${a.id}`} className="group block py-5"><h2 className="font-display text-2xl group-hover:text-burgundy">{a.name}</h2><p className="mt-1 text-sm text-muted">{[a.born && `Born ${a.born}`, a.works ? `${a.works} works` : "", a.topWork && `Known for ${a.topWork}`].filter(Boolean).join(". ")}</p>{a.note && <p className="mt-2 text-sm text-muted">{a.note}</p>}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
