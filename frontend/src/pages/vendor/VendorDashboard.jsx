import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VendorChrome from "../../components/VendorChrome";
import { ShopCover, ErrorState } from "../../components/ui";
import { API_BASE_URL } from "../../utils/media";

const ACTION_CARDS = [
  {
    title: "Products",
    hint: "See your items",
    icon: "📦",
    path: "/vendor/products",
  },
  {
    title: "Orders",
    hint: "New customer orders",
    icon: "🛒",
    path: "/vendor/orders",
  },
  {
    title: "My Shop",
    hint: "Name, photo, phone",
    icon: "👤",
    path: "/vendor/profile",
  },
  {
    title: "Location",
    hint: "Where your shop is",
    icon: "📍",
    path: "/vendor/location",
  },
  {
    title: "Notifications",
    hint: "Messages for you",
    icon: "🔔",
    path: "/vendor/notifications",
    key: "notifications",
  },
];

function VendorDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    today_orders: 0,
    completed_orders: 0,
    today_sales: 0,
    total_sales: 0,
  });
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);
  const [statusError, setStatusError] = useState("");

  const loadDashboard = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    setError("");

    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/vendors/sales-summary`, {
          headers,
        });
        setSummary(
          response.data.summary || {
            today_orders: 0,
            completed_orders: 0,
            today_sales: 0,
            total_sales: 0,
          }
        );
      } catch (requestError) {
        console.error("Failed to load sales summary", requestError);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/vendors/profile`, {
          headers,
        });
        setProfile(response.data.profile || null);
      } catch (requestError) {
        console.error(requestError);
        setError("Could not load shop details.");
      }
    };

    const fetchUnread = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/vendors/notifications`, {
          headers,
        });
        setUnreadCount(response.data.unread_count || 0);
      } catch {
        setUnreadCount(0);
      }
    };

    await Promise.all([fetchSummary(), fetchProfile(), fetchUnread()]);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleAvailabilityToggle = async () => {
    if (!profile) return;

    setToggling(true);
    setStatusError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/api/vendors/availability`,
        { is_available: !profile.is_available },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile((current) => ({
        ...current,
        is_available: response.data.vendor?.is_available ?? !current.is_available,
      }));
    } catch (toggleError) {
      console.error(toggleError);
      setStatusError("Could not update shop status. Try again.");
    } finally {
      setToggling(false);
    }
  };

  const shopOpen = Boolean(profile?.is_available);
  const shopName = profile?.business_name || "My shop";

  const stats = [
    { label: "Today's orders", value: summary.today_orders },
    { label: "Finished orders", value: summary.completed_orders },
    {
      label: "Today's sales",
      value: `₹${Number(summary.today_sales || 0)}`,
    },
    {
      label: "All sales",
      value: `₹${Number(summary.total_sales || 0)}`,
    },
  ];

  return (
    <VendorChrome>
      <main className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
        {error ? (
          <div className="mb-4">
            <ErrorState message={error} onRetry={loadDashboard} />
          </div>
        ) : null}

        <section className="overflow-hidden rounded-[2rem] border border-sand bg-white shadow-sm">
          {profile?.shop_image ? (
            <ShopCover src={profile.shop_image} name={shopName} className="h-44 w-full sm:h-56" />
          ) : (
            <button
              type="button"
              onClick={() => navigate("/vendor/profile")}
              className="flex h-44 w-full flex-col items-center justify-center bg-sand text-forest sm:h-56"
            >
              <span
                aria-hidden="true"
                className="flex h-20 w-20 items-center justify-center rounded-full bg-forest text-3xl font-black text-white"
              >
                SC
              </span>
              <span className="mt-3 text-base font-extrabold">Add a shop photo</span>
            </button>
          )}

          <div className="p-5 sm:p-6">
            <p className="text-sm font-bold text-mute">Hello</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">{shopName}</h1>
            {profile?.category ? (
              <p className="mt-1 text-base text-mute">{profile.category}</p>
            ) : null}

            {profile ? (
              <>
                <div
                  className={`mt-5 rounded-3xl px-4 py-4 text-center ${
                    shopOpen ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"
                  }`}
                >
                  <p className="text-2xl font-black">
                    {shopOpen ? "OPEN" : "CLOSED"}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {shopOpen
                      ? "Customers can order now."
                      : "Customers cannot order right now."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAvailabilityToggle}
                  disabled={toggling}
                  className={`mt-5 flex min-h-16 w-full items-center justify-center rounded-2xl text-xl font-black text-white shadow-sm disabled:opacity-60 ${
                    shopOpen ? "bg-emerald-700 hover:bg-emerald-800" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {toggling
                    ? "Please wait…"
                    : shopOpen
                      ? "OPEN — tap to close"
                      : "CLOSED — tap to open"}
                </button>
              </>
            ) : null}
            {statusError ? (
              <p className="mt-3 text-center text-sm font-medium text-red-700">{statusError}</p>
            ) : null}
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-sand bg-white px-4 py-5 shadow-sm">
              <p className="text-sm font-bold text-mute">{stat.label}</p>
              <p className="mt-2 text-2xl font-black sm:text-3xl">{stat.value}</p>
            </div>
          ))}
        </section>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/vendor/products/add")}
            className="flex min-h-16 items-center justify-center rounded-2xl bg-clay px-6 text-xl font-black text-white hover:bg-clay-dark"
          >
            + Add Product
          </button>
          <button
            type="button"
            onClick={() => navigate("/vendor/orders")}
            className="flex min-h-16 items-center justify-center rounded-2xl bg-forest px-6 text-xl font-black text-white hover:bg-forest-deep"
          >
            View Orders
          </button>
          <button
            type="button"
            onClick={() => navigate("/vendor/profile/edit")}
            className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 text-lg font-extrabold"
          >
            Edit Shop
          </button>
          <button
            type="button"
            onClick={() => navigate("/vendor/location")}
            className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 text-lg font-extrabold"
          >
            Update Location
          </button>
        </div>

        <h2 className="mt-8 text-lg font-black">Open a page</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {ACTION_CARDS.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => navigate(card.path)}
              className="relative flex min-h-36 flex-col items-center justify-center rounded-3xl border border-sand bg-white px-3 py-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:bg-sand"
            >
              {card.key === "notifications" && unreadCount > 0 ? (
                <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
              <span className="text-4xl" aria-hidden="true">
                {card.icon}
              </span>
              <span className="mt-3 text-lg font-black">{card.title}</span>
              <span className="mt-1 text-sm text-mute">{card.hint}</span>
            </button>
          ))}
        </div>
      </main>
    </VendorChrome>
  );
}

export default VendorDashboard;
