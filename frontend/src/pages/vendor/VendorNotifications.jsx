import { useEffect, useState } from "react";
import axios from "axios";
import VendorChrome from "../../components/VendorChrome";
import { EmptyState, ErrorState, LoadingState, StatusBadge } from "../../components/ui";

const notificationsUrl = "http://localhost:5000/api/vendors/notifications";

function formatCreatedAt(createdAt) {
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
}

function kindFor(notification) {
  if (notification.type === "new_order" || notification.status === "pending") return "New order";
  const text = `${notification.title || ""} ${notification.message || ""}`.toLowerCase();
  if (text.includes("payment")) return "Payment";
  return "System";
}

function VendorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(notificationsUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications || []);
      } catch (requestError) {
        console.error(requestError);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <VendorChrome>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Notifications</h1>
        <p className="mt-2 text-mute">New orders, payments, and shop messages.</p>

        {loading ? <div className="mt-6"><LoadingState label="Loading notifications..." /></div> : null}
        {error ? <div className="mt-6"><ErrorState message={error} /></div> : null}
        {!loading && !error && notifications.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No notifications yet." />
          </div>
        ) : null}

        {!loading && !error && notifications.length > 0 ? (
          <div className="mt-6 space-y-3">
            {notifications.map((notification) => {
              const kind = kindFor(notification);
              const accent =
                kind === "New order"
                  ? "border-l-clay"
                  : kind === "Payment"
                    ? "border-l-amber-500"
                    : "border-l-forest";

              return (
                <article
                  key={notification.id}
                  className={`rounded-3xl border border-sand border-l-4 bg-white p-5 shadow-sm ${accent} ${
                    notification.read === false ? "ring-2 ring-leaf/20" : ""
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-mute">{kind}</p>
                      <h2 className="mt-1 font-display text-xl font-bold">{notification.title}</h2>
                      <p className="mt-1 text-stone-700">{notification.message}</p>
                    </div>
                    <StatusBadge status={notification.status} />
                  </div>
                  <p className="mt-3 text-sm text-mute">{formatCreatedAt(notification.created_at)}</p>
                </article>
              );
            })}
          </div>
        ) : null}
      </main>
    </VendorChrome>
  );
}

export default VendorNotifications;
