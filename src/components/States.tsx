import type { ReactNode } from "react";
export const GridSkeleton = ({ n = 8 }: { n?: number }) => (
  <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-busy="true" aria-label="Loading">
    {Array.from({ length: n }, (_, i) => <li key={i}><div className="aspect-[2/3] animate-pulse bg-beige" /><div className="mt-3 h-4 w-3/4 animate-pulse bg-beige" /><div className="mt-2 h-3 w-1/2 animate-pulse bg-beige" /></li>)}
  </ul>
);
export const ErrorState = ({ message, retry }: { message: string; retry?: () => void }) => (
  <div className="mt-12 max-w-md" role="alert"><h2 className="font-display text-2xl">Could not load this</h2><p className="mt-2 text-muted">{message}</p>{retry && <button className="btn-primary mt-6" onClick={retry}>Try again</button>}</div>
);
export const Empty = ({ title, children }: { title: string; children?: ReactNode }) => (
  <div className="mt-12 max-w-md"><h2 className="font-display text-2xl">{title}</h2><div className="mt-2 text-muted">{children}</div></div>
);
