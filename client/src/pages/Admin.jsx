import { useEffect, useState } from "react";
import api, { errMsg } from "../lib/api.js";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    Promise.all([api.get("/admin/stats"), api.get("/admin/appointments"), api.get("/admin/messages")])
      .then(([s, a, m]) => {
        setStats(s.data);
        setAppointments(a.data.appointments);
        setMessages(m.data.messages);
      })
      .catch((e) => setError(errMsg(e)));

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    try {
      await api.patch(`/admin/appointments/${id}`, { status });
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  async function resolve(id) {
    try {
      await api.patch(`/admin/messages/${id}/resolve`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  const tiles = stats && [
    ["Patients", stats.patients],
    ["Appointments", stats.appointments],
    ["Awaiting confirmation", stats.pending],
    ["Open messages", stats.messages],
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-4xl font-bold">Admin</h1>

      {error && (
        <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</p>
      )}

      {tiles && (
        <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map(([label, value]) => (
            <div key={label} className="panel p-5">
              <dd className="font-display text-4xl font-bold">{value}</dd>
              <dt className="mt-1 text-sm text-ink-soft">{label}</dt>
            </div>
          ))}
        </dl>
      )}

      <h2 className="mt-12 text-2xl font-semibold">Appointments</h2>
      <div className="panel mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-ink-soft">
            <tr>
              <th className="p-3 font-medium">Patient</th>
              <th className="p-3 font-medium">Service</th>
              <th className="p-3 font-medium">When</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr><td colSpan={4} className="p-5 text-ink-soft">No appointments yet.</td></tr>
            )}
            {appointments.map((a) => (
              <tr key={a._id} className="border-b border-line last:border-0">
                <td className="p-3">
                  <p className="font-medium">{a.patient?.name ?? "Deleted user"}</p>
                  <p className="text-ink-soft">{a.patient?.email}</p>
                </td>
                <td className="p-3">{a.service?.title ?? "Removed"}</td>
                <td className="p-3 tabular-nums">{a.date} {a.timeSlot}</td>
                <td className="p-3">
                  <label className="sr-only" htmlFor={`st-${a._id}`}>Status for {a.patient?.name}</label>
                  <select
                    id={`st-${a._id}`}
                    className="field w-auto py-1.5 text-sm capitalize"
                    value={a.status}
                    onChange={(e) => setStatus(a._id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-2xl font-semibold">Messages</h2>
      <ul className="mt-4 space-y-3">
        {messages.length === 0 && <li className="text-ink-soft">No messages yet.</li>}
        {messages.map((m) => (
          <li key={m._id} className={`panel p-5 ${m.resolved ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{m.name} <span className="font-normal text-ink-soft">({m.email})</span></p>
                <p className="mt-2 whitespace-pre-wrap text-ink-soft">{m.message}</p>
              </div>
              {m.resolved ? (
                <span className="text-sm text-ink-soft">Resolved</span>
              ) : (
                <button className="btn btn-ghost" onClick={() => resolve(m._id)}>Mark resolved</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
