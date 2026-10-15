import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";
import { errMsg } from "../lib/api.js";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = isLogin
        ? await login(form.email, form.password)
        : await register({
            name: form.name,
            email: form.email,
            password: form.password,
            ...(form.phone ? { phone: form.phone } : {}),
          });
      const fallback = user.role === "admin" ? "/admin" : "/dashboard";
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <h1 className="text-4xl font-bold">{isLogin ? "Log in" : "Create your account"}</h1>

      <form onSubmit={submit} className="mt-8 space-y-5">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input id="name" className="field" value={form.name} onChange={set("name")} required minLength={2} autoComplete="name" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" className="field" value={form.email} onChange={set("email")} required autoComplete="email" />
        </div>
        {!isLogin && (
          <div>
            <label htmlFor="phone" className="label">Phone (optional)</label>
            <input id="phone" type="tel" className="field" value={form.phone} onChange={set("phone")} autoComplete="tel" />
          </div>
        )}
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input
            id="password"
            type="password"
            className="field"
            value={form.password}
            onChange={set("password")}
            required
            minLength={isLogin ? 1 : 8}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          {!isLogin && <p className="mt-1.5 text-sm text-ink-soft">At least 8 characters.</p>}
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
            {error}
          </p>
        )}

        <button className="btn btn-primary w-full py-3 text-base" disabled={busy}>
          {busy ? "Please wait…" : isLogin ? "Log in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-ink-soft">
        {isLogin ? "New here? " : "Already have an account? "}
        <Link to={isLogin ? "/register" : "/login"} state={location.state} className="font-semibold text-teal-deep underline">
          {isLogin ? "Create an account" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
