import { useEffect, useState } from "react";
export function useDebounced<T>(v: T, ms = 350) {
  const [d, setD] = useState(v);
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return d;
}
export function useAsync<T>(fn: (s: AbortSignal) => Promise<T>, deps: unknown[]) {
  const [st, setSt] = useState<{ data?: T; error?: string; loading: boolean }>({ loading: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    const c = new AbortController();
    setSt((s) => ({ ...s, loading: true, error: undefined }));
    fn(c.signal).then((data) => setSt({ data, loading: false }), (e) => { if (!c.signal.aborted) setSt({ loading: false, error: e instanceof Error ? e.message : "Something went wrong." }); });
    return () => c.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, n]);
  return { ...st, retry: () => setN((x) => x + 1) };
}
