import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuthRole } from "../utils/auth";

const navClass = ({ isActive }) =>
  `inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold transition ${
    isActive
      ? "bg-forest text-white"
      : "text-stone-700 hover:bg-sand hover:text-forest"
  }`;

function CustomerChrome({ children, withFooter = true }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const role = getAuthRole();
  const isCustomer = role === "customer";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const close = () => setMenuOpen(false);

  const customerLinks = isCustomer ? (
    <>
      <NavLink to="/orders" className={navClass} onClick={close}>
        Orders
      </NavLink>
      <NavLink to="/notifications" className={navClass} onClick={close}>
        Alerts
      </NavLink>
      <NavLink to="/cart" className={navClass} onClick={close}>
        Cart
      </NavLink>
    </>
  ) : null;

  const authControls = token ? (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-ink px-4 text-sm font-extrabold text-white hover:bg-stone-700"
    >
      Logout
    </button>
  ) : (
    <>
      <NavLink to="/login" className={navClass} onClick={close}>
        Login
      </NavLink>
      <Link
        to="/register"
        onClick={close}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-clay px-4 text-sm font-extrabold text-white hover:bg-clay-dark"
      >
        Join
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-cream text-ink">
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-50 -translate-y-16 rounded-lg bg-white px-4 py-2 text-sm font-bold text-forest shadow focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-sand bg-cream/90 backdrop-blur">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10"
          aria-label="Primary"
        >
          <Link to="/home" className="font-display text-xl font-bold text-forest sm:text-2xl">
            Street Connect
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/vendors" end className={navClass}>
              Discover
            </NavLink>
            {customerLinks}
            {authControls}
          </div>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-stone-300 bg-white md:hidden"
            aria-expanded={menuOpen}
            aria-controls="customer-mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="text-lg font-bold">
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </nav>

        {menuOpen ? (
          <div id="customer-mobile-nav" className="border-t border-sand bg-cream px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              <NavLink to="/vendors" end className={navClass} onClick={close}>
                Discover
              </NavLink>
              {customerLinks}
              <div className="mt-2 flex flex-col gap-2">{authControls}</div>
            </div>
          </div>
        ) : null}
      </header>

      <div id="main-content">{children}</div>

      {withFooter ? (
        <footer className="mt-8 bg-forest-deep px-4 py-10 text-center text-cream">
          <p className="font-display text-2xl font-bold text-white">Street Connect</p>
          <p className="mt-2 text-sm text-sand">Discover local vendors near you.</p>
          <p className="mt-4 text-xs text-white/50">© 2026 Street Connect</p>
        </footer>
      ) : null}
    </div>
  );
}

export default CustomerChrome;
