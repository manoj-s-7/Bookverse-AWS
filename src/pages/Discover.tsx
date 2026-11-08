import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { authors, books, byAuthor, genres, slug } from "../data/books";
import BookLink from "../components/BookLink";
import Cover from "../components/Cover";

const bk = (id: string) => books.find((b) => b.id === id)!;

export default function Discover() {
  document.title = "BOOKVERSE | Every book opens a new world";
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const go = (e: FormEvent) => { e.preventDefault(); nav(`/explore?q=${encodeURIComponent(q)}`); };
  const featured = bk("frankenstein");
  const recent = books.slice(-5).reverse();
  return (
    <>
      {/* Hero */}
      <section className="wrap grid items-center gap-12 pb-16 pt-12 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div className="hero-rise">
          <h1 className="font-display text-5xl font-medium leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl">Every book opens a new world.</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">Find your next read by title or author, follow a genre back through time, and keep a shelf of everything you mean to read.</p>
          <form onSubmit={go} role="search" className="mt-8 flex max-w-lg border-b-2 border-ink focus-within:border-burgundy">
            <label htmlFor="hero-q" className="sr-only">Search by title or author</label>
            <input id="hero-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or author" className="min-h-[52px] w-full bg-transparent text-base outline-none placeholder:text-subtle" />
            <button className="flex w-12 items-center justify-center hover:text-burgundy" aria-label="Search"><Search size={20} /></button>
          </form>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            {genres.slice(0, 4).map((g) => <Link key={g} to={`/explore?genre=${g}`} className="underline-offset-4 hover:text-burgundy hover:underline">{g}</Link>)}
          </div>
        </div>
        <div className="relative mx-auto h-[360px] w-full max-w-[420px] sm:h-[460px]" aria-hidden="true">
          <Cover book={bk("pride-and-prejudice")} className="absolute left-0 top-10 w-[46%] -rotate-3" />
          <Cover book={bk("moby-dick")} className="absolute right-0 top-0 w-[46%] rotate-2" />
          <Cover book={bk("jane-eyre")} className="absolute bottom-0 left-[26%] w-[46%]" />
        </div>
      </section>

      {/* Featured */}
      <section className="bg-sand/60 py-16 md:py-24">
        <div className="wrap grid items-center gap-10 md:grid-cols-[320px_1fr] md:gap-20">
          <Link to={`/book/${featured.id}`} className="mx-auto block w-56 md:w-full" aria-label={featured.title}><Cover book={featured} /></Link>
          <div>
            <p className="text-sm text-burgundy">Featured this week</p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-tight md:text-5xl">{featured.title}</h2>
            <p className="mt-1 text-muted">{featured.author}, {featured.year}</p>
            <p className="mt-6 max-w-lg font-display text-xl leading-relaxed">{featured.blurb}</p>
            <Link to={`/book/${featured.id}`} className="btn-primary mt-8">View book</Link>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="wrap pt-20">
        <h2 className="h-section">Reading collections</h2>
        <div className="mt-10 grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <Link to="/explore?genre=Gothic" className="group block">
            <div className="flex gap-3 sm:gap-5">
              {["frankenstein", "dracula", "wuthering-heights"].map((id, i) => <Cover key={id} book={bk(id)} className={`w-1/3 transition-transform duration-300 group-hover:-translate-y-1 ${i === 1 ? "mt-8" : ""}`} />)}
            </div>
            <h3 className="mt-6 font-display text-2xl group-hover:text-burgundy">Dark rooms and long nights</h3>
            <p className="mt-1 max-w-md text-muted">Gothic novels where houses, laboratories and moors become characters.</p>
          </Link>
          <div className="flex flex-col divide-y divide-taupe border-y border-taupe">
            {[["Classics", "Novels that outlived their century and still read quickly."], ["Philosophy", "Short, practical books for slow evenings."], ["Nature", "Writing that sends you outdoors."]].map(([g, d]) => (
              <Link key={g} to={`/explore?genre=${g}`} className="group flex items-start justify-between gap-4 py-6">
                <div><h3 className="font-display text-2xl group-hover:text-burgundy">{g}</h3><p className="mt-1 text-muted">{d}</p></div>
                <span className="mt-2 shrink-0 text-sm text-muted">{books.filter((b) => b.genre === g).length} books</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="wrap pt-24">
        <h2 className="h-section">Explore by genre</h2>
        <ul className="mt-8 border-t border-ink">
          {genres.map((g) => (
            <li key={g} className="border-b border-taupe">
              <Link to={`/explore?genre=${g}`} className="group flex min-h-[64px] items-baseline justify-between py-3">
                <span className="font-display text-3xl transition-colors group-hover:text-burgundy md:text-5xl">{g}</span>
                <span className="text-sm text-muted">{books.filter((b) => b.genre === g).length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Popular shelf */}
      <section className="pt-24">
        <div className="wrap"><h2 className="h-section">Popular classics</h2><p className="mt-2 text-muted">Sample ordering for the mock catalogue. Live popularity data comes with the API phase.</p></div>
        <div className="wrap mt-8">
          <ul className="flex snap-x gap-5 overflow-x-auto pb-6 [scrollbar-width:thin]">
            {books.slice(0, 8).map((b) => <li key={b.id} className="w-40 shrink-0 snap-start sm:w-48"><BookLink book={b} /></li>)}
          </ul>
          <div className="h-px bg-ink" />
        </div>
      </section>

      {/* Recently added */}
      <section className="wrap grid gap-10 pt-24 md:grid-cols-[1fr_2fr]">
        <h2 className="h-section">Recently added</h2>
        <ul className="divide-y divide-taupe border-y border-taupe">
          {recent.map((b) => (
            <li key={b.id}>
              <Link to={`/book/${b.id}`} className="group flex items-center gap-5 py-4">
                <Cover book={b} className="w-14 shrink-0" />
                <div className="min-w-0"><div className="font-display text-xl group-hover:text-burgundy">{b.title}</div><div className="text-sm text-muted">{b.author} · {b.genre}</div></div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Authors */}
      <section className="wrap pt-24">
        <h2 className="h-section">Featured authors</h2>
        <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {authors.map((a) => (
            <Link key={a.name} to={`/authors/${slug(a.name)}`} className="group border-t border-ink pt-4">
              <h3 className="font-display text-2xl group-hover:text-burgundy">{a.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.note}</p>
              <p className="mt-3 text-sm">{byAuthor(a.name).length || 1} in catalogue</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
