import { useSyncExternalStore } from "react";
// Tiny localStorage-backed store factory (no external state library needed at this size).
export function createStore<T>(key: string, initial: T) {
  const ls = new Set<() => void>();
  const read = (): string => { try { return localStorage.getItem(key) ?? JSON.stringify(initial); } catch { return JSON.stringify(initial); } };
  const subscribe = (cb: () => void) => { ls.add(cb); return () => { ls.delete(cb); }; };
  const write = (v: T) => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage unavailable */ } ls.forEach((l) => l()); };
  return { write, use: (): T => JSON.parse(useSyncExternalStore(subscribe, read)) as T };
}
