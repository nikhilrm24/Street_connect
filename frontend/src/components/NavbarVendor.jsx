import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const LINKS = [
  { to: "/vendor/dashboard", label: "Home", icon: "🏠" },
  { to: "/vendor/products", label: "Products", icon: "📦" },
  { to: "/vendor/orders", label: "Orders", icon: "🛒" },
  { to: "/vendor/profile", label: "My Shop", icon: "👤" },
];

function NavbarVendor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/vendors/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUnreadCount(response.data.unread_count || 0);
      })
      .catch(() => {
        setUnreadCount(0);
      });
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  const linkClass =
    "flex min-h-14 items-center rounded-2xl px-4 text-lg font-extrabold text-ink hover:bg-sand";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-forest text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/vendor/dashboard"
            className="font-display text-xl font-bold"
            onClick={closeMenu}
          >
            Street Connect
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/vendor/notifications"
              className="relative inline-flex min-h-12 min-w-12 items-center justify-center rounded-2xl bg-forest-deep text-lg"
              aria-label="Notifications"
            >
              🔔
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-clay px-1.5 text-xs font-extrabold">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-2xl bg-forest-deep text-lg font-bold"
              aria-expanded={menuOpen}
              aria-controls="vendor-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div
            id="vendor-menu"
            className="border-t border-leaf bg-white px-4 py-3 text-ink"
          >
            <div className="mx-auto flex max-w-3xl flex-col gap-1">
              <Link to="/vendor/dashboard" className={linkClass} onClick={closeMenu}>
                Home
              </Link>
              <Link to="/vendor/products" className={linkClass} onClick={closeMenu}>
                Products
              </Link>
              <Link to="/vendor/products/add" className={linkClass} onClick={closeMenu}>
                Add Product
              </Link>
              <Link to="/vendor/profile" className={linkClass} onClick={closeMenu}>
                Profile
              </Link>
              <Link to="/vendor/location" className={linkClass} onClick={closeMenu}>
                Location
              </Link>
              <Link to="/vendor/orders" className={linkClass} onClick={closeMenu}>
                Orders
              </Link>
              <Link to="/vendor/notifications" className={linkClass} onClick={closeMenu}>
                Notifications
                {unreadCount > 0 ? (
                  <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-sm font-bold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex min-h-14 items-center justify-center rounded-2xl bg-ink text-lg font-extrabold text-white"
              >
                Logout
              </button>
            </div>
          </div>
        ) : null}
      </nav>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Vendor shortcuts"
      >
        <div className="mx-auto grid max-w-3xl grid-cols-4">
          {LINKS.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex min-h-16 flex-col items-center justify-center text-xs font-extrabold ${
                  active ? "text-forest" : "text-mute"
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default NavbarVendor;
