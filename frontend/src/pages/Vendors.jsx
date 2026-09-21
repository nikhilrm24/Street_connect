import { useState, useEffect } from "react";
import axios from "axios";
import Map from "../components/Map";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerChrome from "../components/CustomerChrome";
import { ShopCover, StatusBadge, EmptyState } from "../components/ui";

function Vendors() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "");
  const [vendors, setVendors] = useState([]);
  const [location, setLocation] = useState(null);
  const [vendorLocations, setVendorLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/vendors")
      .then((response) => {
        setVendors(response.data.vendors || []);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/vendors/locations")
      .then((response) => {
        setVendorLocations(response.data.locations);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(userLocation);
        setLocation(userLocation);
      },
      () => {
        console.log("error");
      }
    );
  }

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.business_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = categoryFilter
      ? String(vendor.category || "")
          .toLowerCase()
          .includes(categoryFilter.toLowerCase())
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <CustomerChrome>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <section className="page-enter text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-clay">
            Find a stall
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Vendors around you
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-mute">
            Discover local vendors around your location and shop from nearby businesses.
          </p>
        </section>

        <section className="mx-auto mt-8 max-w-2xl">
          <button
            className="w-full min-h-14 rounded-2xl bg-forest px-6 py-3 text-lg font-extrabold text-white shadow-sm transition hover:bg-forest-deep"
            onClick={handleLocation}
          >
            📍 Use my location
          </button>

          <div className="mt-4">
            <label htmlFor="vendor-search" className="sr-only">
              Search vendors
            </label>
            <input
              id="vendor-search"
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-h-12 rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-leaf"
            />
          </div>

          {categoryFilter ? (
            <button
              type="button"
              className="mt-3 rounded-full bg-sand px-3 py-1 text-sm font-bold text-forest"
              onClick={() => setCategoryFilter("")}
            >
              Category: {categoryFilter} ✕
            </button>
          ) : null}

          {location && (
            <div className="mt-5 overflow-hidden rounded-3xl border border-sand shadow-sm">
              <Map location={location} vendorLocations={vendorLocations} />
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-3xl font-bold">Nearby vendors</h2>

          {loading ? (
            <p className="mt-6 rounded-3xl bg-white p-8 text-center font-bold text-forest">
              Loading vendors…
            </p>
          ) : filteredVendors.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No vendors match that search"
                detail="Try another name, or browse everyone nearby."
              />
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVendors.map((vendor) => (
                <article
                  key={vendor.vendor_id}
                  className="overflow-hidden rounded-3xl border border-sand bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <ShopCover
                    src={vendor.shop_image}
                    name={vendor.business_name}
                    className="h-48 w-full"
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl font-bold text-ink">
                        {vendor.business_name}
                      </h3>
                      <StatusBadge open={Boolean(vendor.is_available)} />
                    </div>
                    <p className="mt-2 text-sm font-extrabold text-leaf">{vendor.category}</p>
                    <p className="mt-3 text-sm text-mute">📍 {vendor.location_info}</p>
                    {vendor.rating != null ? (
                      <p className="mt-2 text-sm font-semibold">⭐ {vendor.rating}</p>
                    ) : null}
                    <p
                      className={`mt-3 text-sm font-bold ${
                        vendor.is_available ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {vendor.is_available ? "Accepting orders" : "Not accepting orders"}
                    </p>
                    <button
                      className="mt-5 w-full min-h-12 rounded-2xl bg-forest px-4 py-2 font-extrabold text-white transition hover:bg-forest-deep"
                      onClick={() => navigate(`/vendors/${vendor.vendor_id}`)}
                    >
                      View shop
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </CustomerChrome>
  );
}

export default Vendors;
