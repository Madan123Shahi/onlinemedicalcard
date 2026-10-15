import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api, { errMsg, inr, todayISO } from "../lib/api.js";

export default function Book() {
  const [params] = useSearchParams();
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [timeSlot, setTimeSlot] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("/services")
      .then((r) => {
        setServices(r.data.services);
        const wanted = r.data.services.find((s) => s.slug === params.get("service"));
        setServiceId((wanted || r.data.services[0])?._id || "");
      })
      .catch((e) => setError(errMsg(e)));
  }, [params]);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setSlotsLoading(true);
    setTimeSlot("");
    api
      .get("/appointments/availability", { params: { date } })
      .then((r) => {
        if (cancelled) return;
        const now = new Date();
        // Hide slots that have already passed today
        setSlots(r.data.slots.filter((s) => new Date(`${date}T${s}:00`) > now));
      })
      .catch((e) => !cancelled && setError(errMsg(e)))
      .finally(() => !cancelled && setSlotsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [date]);

  const selected = services.find((s) => s._id === serviceId);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!timeSlot) return setError("Choose a time slot to continue.");
    setSubmitting(true);
    try {
      const { data } = await api.post("/appointments", { serviceId, date, timeSlot, reason });
      setBooked(data.appointment);
    } catch (err) {
      setError(
        err?.response?.status === 409
          ? "Someone just booked that slot. Pick another time."
          : errMsg(err)
      );
      // refresh availability after a conflict
      api.get("/appointments/availability", { params: { date } }).then((r) => setSlots(r.data.slots));
      setTimeSlot("");
    } finally {
      setSubmitting(false);
    }
  }

  if (booked) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <div className="panel p-8" role="status">
          <h1 className="text-3xl font-bold">Visit requested</h1>
          <p className="mt-3 text-ink-soft">
            {selected?.title} on <strong>{booked.date}</strong> at <strong>{booked.timeSlot}</strong>.
            Status: {booked.status}. We will confirm it shortly.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/dashboard" className="btn btn-primary">View my visits</Link>
            <Link to="/" className="btn btn-ghost">Back to home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="text-4xl font-bold">Book a visit</h1>

      <form onSubmit={submit} className="mt-8 space-y-7" noValidate>
        <div>
          <label htmlFor="service" className="label">Service</label>
          <select id="service" className="field" value={serviceId} onChange={(e) => setServiceId(e.target.value)} required>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title} ({inr(s.priceInr)})
              </option>
            ))}
          </select>
          {selected && <p className="mt-2 text-sm text-ink-soft">{selected.summary}</p>}
        </div>

        <div>
          <label htmlFor="date" className="label">Date</label>
          <input
            id="date"
            type="date"
            className="field sm:max-w-xs"
            min={todayISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <fieldset>
          <legend className="label">Time</legend>
          {slotsLoading ? (
            <p className="text-ink-soft">Checking open slots…</p>
          ) : slots.length === 0 ? (
            <p className="text-ink-soft">No slots left on this date. Pick another day.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((s) => (
                <label
                  key={s}
                  className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm font-medium has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-teal ${
                    timeSlot === s ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="slot"
                    value={s}
                    checked={timeSlot === s}
                    onChange={() => setTimeSlot(s)}
                    className="sr-only"
                  />
                  {s}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div>
          <label htmlFor="reason" className="label">What would you like to discuss? (optional)</label>
          <textarea
            id="reason"
            rows={4}
            maxLength={1000}
            className="field"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="A short summary of your condition or questions for the doctor"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
            {error}
          </p>
        )}

        <button className="btn btn-primary px-6 py-3 text-base" disabled={submitting || !serviceId}>
          {submitting ? "Booking…" : "Book this visit"}
        </button>
      </form>
    </div>
  );
}
