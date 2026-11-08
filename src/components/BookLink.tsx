import { Link } from "react-router-dom";
import type { Book } from "../data/books";
import Cover from "./Cover";
export default function BookLink({ book }: { book: Book }) {
  return (
    <Link to={`/book/${book.id}`} className="group block" aria-label={`${book.title} by ${book.author}`}>
      <Cover book={book} className="transition-transform duration-300 group-hover:-translate-y-1" />
      <div className="mt-3">
        <div className="font-display text-base leading-snug group-hover:text-burgundy">{book.title}</div>
        <div className="text-sm text-muted">{book.author}{book.year ? `, ${book.year}` : ""}</div>
      </div>
    </Link>
  );
}
