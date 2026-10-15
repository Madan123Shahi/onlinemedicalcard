import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg, inr } from "../lib/api.js";
import { useAuth } from "../lib/auth.jsx";

const badge = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-mint text-teal-deep",
  completed: "bg-slate-200 text-slate-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api
      .get("/appointments/mine")
      .then((r) => setItems(r.data.appointments))
      .catch((e) => setError(errMsg(e)));

  useEffect(() => {
    load();
  }, []);

  async function cancel(id) {
    if (!window.confirm("Cancel this visit? The slot will be released.")) return;
    try {
      await api.patch(`/appointments/${id}/cancel`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">My visits</h1>
          <p className="mt-1 text-ink-soft">Signed in as {user.email}</p>
        </div>
        <Link to="/book" className="btn btn-primary">Book a visit</Link>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</p>
      )}
      {!items && !error && <p className="mt-8 text-ink-soft">Loading your visits…</p>}
      {items?.length === 0 && (
        <div className="panel mt-8 p-8 text-center">
          <p className="text-lg font-semibold">You have no visits yet.</p>
          <p className="mt-1 text-ink-soft">Pick a service and a time to get started.</p>
          <Link to="/book" className="btn btn-primary mt-5">Book your first visit</Link>
        </div>
      )}

      <ul className="mt-8 space-y-4">
        {items?.map((a) => (
          <li key={a._id} className="panel flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-lg font-semibold">{a.service?.title ?? "Service removed"}</p>
              <p className="text-ink-soft">
                {a.date} at {a.timeSlot}
                {a.service && ` · ${inr(a.service.priceInr)}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${badge[a.status]}`}>
                {a.status}
              </span>
              {["pending", "confirmed"].includes(a.status) && (
                <button className="btn btn-danger" onClick={() => cancel(a._id)}>
                  Cancel visit
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
