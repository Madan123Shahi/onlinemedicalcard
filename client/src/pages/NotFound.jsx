import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="text-5xl font-bold">Page not found</h1>
      <p className="mt-3 text-ink-soft">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="btn btn-primary mt-6">Go to home</Link>
    </div>
  );
}
