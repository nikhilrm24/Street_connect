import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerChrome from "../components/CustomerChrome";
import { ShopCover, StatusBadge } from "../components/ui";
import { getAuthRole } from "../utils/auth";

const FALLBACK_CATEGORIES = [
  { name: "Food", hint: "Street meals & snacks" },
  { name: "Tea", hint: "Chai & refreshments" },
  { name: "Grocery", hint: "Daily essentials" },
  { name: "Bakery", hint: "Bread & sweets" },
  { name: "Chicken", hint: "Fresh & cooked" },
  { name: "Juice", hint: "Fresh juices" },
];

const JOURNEY_STEPS = [
  { step: "1", title: "Discover", detail: "Browse nearby stalls and shops." },
  { step: "2", title: "Visit a shop", detail: "See what they sell and if they are open." },
  { step: "3", title: "Pick items", detail: "Add products to your cart." },
  { step: "4", title: "Checkout", detail: "Place your order in a few taps." },
  { step: "5", title: "Track", detail: "Follow status until it is ready." },
];

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const token = localStorage.getItem("token");
  const isCustomer = getAuthRole() === "customer";

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/vendors")
      .then((response) => setVendors(response.data.vendors || []))
      .catch(() => setVendors([]));

    axios
      .get("http://localhost:5000/api/categories")
      .then((response) => {
        const rows = response.data.category || response.data.categories || [];
        if (!rows.length) return;
        setCategories(
          rows.map((row) => ({
            name: row.category_name || row.name || row.category || "Shop",
            hint: "Local stalls nearby",
          }))
        );
      })
      .catch(() => {});
  }, []);

  const nearby = vendors.slice(0, 6);

  const goDiscover = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    navigate(params.toString() ? `/vendors?${params}` : "/vendors");
  };

  return (
    <CustomerChrome>
      <main>
        <section className="relative overflow-hidden market-grid">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-10 lg:py-20">
            <div className="page-enter">
              <p className="inline-flex rounded-full border border-forest/20 bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-forest">
                Neighborhood marketplace
              </p>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
                Discover local vendors near you.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
                Street Connect helps roadside shops and street stalls find nearby
                customers — and helps you shop from the people around you.
              </p>

              <form onSubmit={goDiscover} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="home-search">
                  Search vendors
                </label>
                <input
                  id="home-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search a stall, snack, or shop…"
                  className="min-h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-leaf"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-forest px-6 text-base font-extrabold text-white shadow-sm transition hover:bg-forest-deep"
                >
                  Find vendors
                </button>
              </form>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/vendors"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-clay px-6 font-extrabold text-white hover:bg-clay-dark"
                >
                  Explore nearby shops
                </Link>
                {!token ? (
                  <Link
                    to="/register"
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 font-extrabold text-ink hover:border-leaf"
                  >
                    Create an account
                  </Link>
                ) : isCustomer ? (
                  <Link
                    to="/orders"
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 font-extrabold text-ink hover:border-leaf"
                  >
                    View my orders
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="relative page-enter">
              <div className="overflow-hidden rounded-[2rem] border border-sand bg-forest shadow-xl">
                <div className="stall-pattern flex h-72 items-end p-6 sm:h-96">
                  <div className="w-full rounded-3xl bg-cream/95 p-5 shadow-lg">
                    <p className="text-sm font-extrabold uppercase tracking-wide text-clay">
                      Today on the street
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-ink">
                      Fresh stalls. Familiar faces.
                    </p>
                    <p className="mt-2 text-sm text-mute">
                      Open vendors, real shops, and orders from around the corner.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-10" aria-labelledby="categories-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="categories-heading" className="font-display text-3xl font-bold">
                Browse categories
              </h2>
              <p className="mt-2 text-mute">Start with the kind of stall you are craving.</p>
            </div>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  to={`/vendors?category=${encodeURIComponent(category.name)}`}
                  className="flex min-h-28 flex-col justify-center rounded-3xl border border-sand bg-white px-4 py-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-leaf hover:shadow-md"
                >
                  <span className="font-display text-lg font-bold capitalize">{category.name}</span>
                  <span className="mt-1 text-sm text-mute">{category.hint}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white/70 py-12" aria-labelledby="nearby-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="nearby-heading" className="font-display text-3xl font-bold">
                  Nearby vendors
                </h2>
                <p className="mt-2 text-mute">Real shops from Street Connect — not a catalogue of far-away stores.</p>
              </div>
              <Link to="/vendors" className="font-extrabold text-forest hover:text-leaf">
                See all
              </Link>
            </div>

            {nearby.length === 0 ? (
              <p className="mt-8 rounded-3xl border border-sand bg-cream p-8 text-center text-mute">
                Vendors will appear here as they join Street Connect.
              </p>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {nearby.map((vendor) => (
                  <Link
                    key={vendor.vendor_id}
                    to={`/vendors/${vendor.vendor_id}`}
                    className="group overflow-hidden rounded-3xl border border-sand bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <ShopCover src={vendor.shop_image} name={vendor.business_name} className="h-44 w-full" />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-xl font-bold">{vendor.business_name}</h3>
                        <StatusBadge open={Boolean(vendor.is_available)} />
                      </div>
                      <p className="mt-1 text-sm font-bold text-leaf">{vendor.category}</p>
                      <p className="mt-2 text-sm text-mute">📍 {vendor.location_info || "Local stall"}</p>
                      {vendor.rating != null ? (
                        <p className="mt-2 text-sm font-semibold">⭐ {vendor.rating}</p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-10" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="text-center font-display text-3xl font-bold">
            How Street Connect works
          </h2>
          <ol className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {JOURNEY_STEPS.map((item) => (
              <li key={item.step} className="rounded-3xl border border-sand bg-white p-5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-extrabold text-white">
                  {item.step}
                </span>
                <p className="mt-3 font-display text-lg font-bold">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-mute">{item.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-forest px-4 py-14 text-cream sm:px-6 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Built for the people who sell on the street.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sand">
              Every order helps a nearby vendor stay visible, stay busy, and stay part of
              the neighborhood. Shop local. Keep it close.
            </p>
            <Link
              to="/vendors"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-clay px-8 font-extrabold text-white hover:bg-clay-dark"
            >
              Start discovering
            </Link>
          </div>
        </section>
      </main>
    </CustomerChrome>
  );
}

export default Home;
