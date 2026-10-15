import { useState } from "react";
import api, { errMsg } from "../lib/api.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "", text: "" });
    try {
      const { data } = await api.post("/contact", form);
      setStatus({ type: "ok", text: data.message });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "err", text: errMsg(err) });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-14">
      <h1 className="text-4xl font-bold">Contact us</h1>
      <p className="mt-3 text-ink-soft">
        Questions about a visit or your account? Send a message and we will reply by email.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="label">Your name</label>
          <input id="name" className="field" value={form.name} onChange={set("name")} required minLength={2} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" className="field" value={form.email} onChange={set("email")} required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="message" className="label">Message</label>
          <textarea id="message" rows={6} className="field" value={form.message} onChange={set("message")} required minLength={10} maxLength={2000} />
        </div>

        {status.text && (
          <p
            role={status.type === "err" ? "alert" : "status"}
            className={`rounded-lg border p-3 ${
              status.type === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-teal/30 bg-mint text-teal-deep"
            }`}
          >
            {status.text}
          </p>
        )}

        <button className="btn btn-primary px-6 py-3 text-base" disabled={sending}>
          {sending ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
