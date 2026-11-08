import { useState } from "react";
import type { Book } from "../data/books";
const PAL: [string, string][] = [["#783F46", "#F8F6F1"], ["#24231F", "#DDD5C8"], ["#DDD5C8", "#24231F"], ["#CFC5B7", "#783F46"], ["#77766F", "#F8F6F1"], ["#EAE5DC", "#783F46"]];
const shadow = "shadow-[0_1px_2px_rgba(36,35,31,.25),0_10px_24px_-12px_rgba(36,35,31,.45)]";
export default function Cover({ book, className = "" }: { book: Book; className?: string }) {
  const [broken, setBroken] = useState(false);
  const h = [...book.id].reduce((a, c) => a + c.charCodeAt(0), 0) % PAL.length;
  const bg = book.bg ?? PAL[h][0], fg = book.fg ?? PAL[h][1];
  return (
    <div className={`[container-type:inline-size] ${className}`}>
      {book.coverUrl && !broken ? (
        <img src={book.coverUrl} alt={`Cover of ${book.title}`} loading="lazy" onError={() => setBroken(true)} className={`aspect-[2/3] w-full bg-beige object-cover ${shadow}`} />
      ) : (
        <div className={`relative flex aspect-[2/3] w-full flex-col justify-between overflow-hidden p-[9cqw] ${shadow}`} style={{ background: bg, color: fg }}>
          <div className="border-b pb-[5cqw] font-sans text-[5cqw] font-medium tracking-wide" style={{ borderColor: "currentColor" }}>{book.author}</div>
          <div className="line-clamp-5 font-display text-[13cqw] font-semibold leading-[1.05]">{book.title}</div>
        </div>
      )}
    </div>
  );
}
