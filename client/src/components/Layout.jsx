import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";

const navLink = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? "bg-mint text-teal-deep" : "text-ink hover:bg-white"
  }`;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="OnlineMedicalCard home">
      <span className="grid h-8 w-11 place-items-center rounded-md bg-ink" aria-hidden="true">
        <span className="h-1.5 w-6 rounded-full omc-holo" />
      </span>
      <span className="font-display text-lg font-bold">OnlineMedicalCard</span>
    </Link>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const links = (
    <>
      <NavLink to="/services" className={navLink} onClick={close}>Services</NavLink>
      <NavLink to="/contact" className={navLink} onClick={close}>Contact</NavLink>
      {user && <NavLink to="/dashboard" className={navLink} onClick={close}>My visits</NavLink>}
      {user?.role === "admin" && <NavLink to="/admin" className={navLink} onClick={close}>Admin</NavLink>}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <header className="border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {links}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <span className="text-sm text-ink-soft">Hi, {user.name.split(" ")[0]}</span>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Log in</Link>
                <Link to="/book" className="btn btn-primary">Book a visit</Link>
              </>
            )}
          </div>

          <button
            className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {open && (
          <div id="mobile-nav" className="border-t border-line px-5 pb-4 pt-2 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links}
              {user ? (
                <button
                  className="btn btn-ghost mt-2"
                  onClick={() => {
                    logout();
                    close();
                    navigate("/");
                  }}
                >
                  Log out
                </button>
              ) : (
                <div className="mt-2 flex gap-2">
                  <Link to="/login" className="btn btn-ghost flex-1" onClick={close}>Log in</Link>
                  <Link to="/book" className="btn btn-primary flex-1" onClick={close}>Book a visit</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 text-sm text-ink-soft md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm">
              Video visits with licensed doctors. This is a demo project: no real medical cards are
              issued and no real appointments are made.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/services" className="hover:text-ink">Services</Link>
            <Link to="/book" className="hover:text-ink">Book a visit</Link>
            <Link to="/contact" className="hover:text-ink">Contact</Link>
          </div>
          <p>© {new Date().getFullYear()} OnlineMedicalCard</p>
        </div>
      </footer>
    </div>
  );
}
