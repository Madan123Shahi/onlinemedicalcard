import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg, inr } from "../lib/api.js";

export default function Services() {
  const [services, setServices] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/services")
      .then((r) => setServices(r.data.services))
      .catch((e) => setError(errMsg(e)));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-4xl font-bold">Services and prices</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        One flat price per visit. No subscription and no hidden fees.
      </p>

      {error && (
        <p role="alert" className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </p>
      )}
      {!services && !error && <p className="mt-8 text-ink-soft">Loading services…</p>}
      {services?.length === 0 && (
        <p className="mt-8 text-ink-soft">
          No services are listed yet. An admin can add them, or run <code>npm run seed</code> in the server folder.
        </p>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {services?.map((s) => (
          <article key={s._id} className="panel flex flex-col p-6">
            <h2 className="text-2xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-ink-soft">{s.summary}</p>
            {s.details && <p className="mt-3 text-sm text-ink-soft">{s.details}</p>}
            <div className="mt-auto pt-6">
              <p className="font-display text-3xl font-bold">{inr(s.priceInr)}</p>
              <p className="text-sm text-ink-soft">{s.durationMin} minutes</p>
              <Link to={`/book?service=${s.slug}`} className="btn btn-primary mt-4 w-full">
                Book {s.title.toLowerCase()}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
