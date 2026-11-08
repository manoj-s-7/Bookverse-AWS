import { Link } from "react-router-dom";
export default function Soon({ title, notFound = false }: { title: string; notFound?: boolean }) {
  document.title = `${title} | BOOKVERSE`;
  return (
    <div className="wrap py-24">
      <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-md text-muted">This address does not match any page.</p>
      <Link to="/" className="btn-primary mt-8">Back to Discover</Link>
    </div>
  );
}
