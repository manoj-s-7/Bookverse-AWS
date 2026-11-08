import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";

const nav = [["Discover", "/"], ["Explore", "/explore"], ["Authors", "/authors"], ["Collections", "/collections"], ["My Library", "/library"]] as const;
const linkCls = ({ isActive }: { isActive: boolean }) => `py-2 text-sm transition-colors hover:text-burgundy ${isActive ? "text-burgundy" : "text-ink"}`;

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-ivory focus:p-3">Skip to content</a>
      <header className="sticky top-0 z-30 border-b border-sand bg-ivory/95 backdrop-blur">
        <div className="wrap flex h-16 items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold tracking-[0.18em]">BOOKVERSE</Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {nav.map(([l, to]) => <NavLink key={to} to={to} end={to === "/"} className={linkCls}>{l}</NavLink>)}
          </nav>
          <div className="flex items-center">
            <Link to="/explore" className="flex h-11 w-11 items-center justify-center hover:text-burgundy" aria-label="Search books"><Search size={20} /></Link>
            <button className="flex h-11 w-11 items-center justify-center md:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu size={22} /></button>
          </div>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 bg-ivory md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="wrap flex h-16 items-center justify-between">
            <span className="font-display text-xl font-semibold tracking-[0.18em]">BOOKVERSE</span>
            <button className="flex h-11 w-11 items-center justify-center" onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button>
          </div>
          <nav className="wrap flex flex-col pt-6" aria-label="Mobile">
            {nav.map(([l, to]) => (
              <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `border-b border-sand py-4 font-display text-3xl ${isActive ? "text-burgundy" : ""}`}>{l}</NavLink>
            ))}
          </nav>
        </div>
      )}
      <main id="main"><Outlet /></main>
      <footer className="mt-24 border-t border-sand bg-beige">
        <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-xl font-semibold tracking-[0.18em]">BOOKVERSE</div>
            <p className="mt-3 max-w-xs font-display text-lg italic text-muted">Every book opens a new world.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
            {nav.map(([l, to]) => <Link key={to} to={to} className="hover:text-burgundy">{l}</Link>)}
          </nav>
          <p className="text-sm leading-relaxed text-muted">Your library is stored in this browser only. Sample titles are public-domain classics; live catalogue data from Open Library and Google Books arrives in a later phase.</p>
        </div>
      </footer>
    </>
  );
}
