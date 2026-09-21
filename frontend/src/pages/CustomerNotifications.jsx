import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CustomerChrome from "../components/CustomerChrome";
import { LoadingState, ErrorState, EmptyState, StatusBadge } from "../components/ui";

function notificationKind(notification) {
  const title = String(notification.title || "").toLowerCase();
  const message = String(notification.message || "").toLowerCase();
  if (title.includes("payment") || message.includes("payment")) return "Payment";
  if (notification.order_id || title.includes("order") || message.includes("order")) return "Order";
  return "System";
}

function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/orders/notifications", {
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
    <CustomerChrome>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl font-bold">Notifications</h1>
            <p className="mt-2 text-mute">Updates about your Street Connect orders.</p>
          </div>
          <Link to="/orders" className="font-extrabold text-forest">
            My orders
          </Link>
        </div>

        {loading ? <div className="mt-6"><LoadingState label="Loading notifications..." /></div> : null}
        {error ? <div className="mt-6"><ErrorState message={error} /></div> : null}
        {!loading && !error && notifications.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No notifications yet." />
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          {notifications.map((notification, index) => {
            const kind = notificationKind(notification);
            const unread = notification.read === false || notification.read === undefined;
            const kindClass =
              kind === "Order"
                ? "border-l-4 border-l-forest"
                : kind === "Payment"
                  ? "border-l-4 border-l-clay"
                  : "border-l-4 border-l-stone-400";

            return (
              <article
                key={notification.id}
                className={`rounded-3xl border border-sand bg-white p-5 shadow-sm ${kindClass} ${
                  unread && index < 3 ? "ring-2 ring-leaf/20" : ""
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
                <p className="mt-3 text-sm text-mute">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </article>
            );
          })}
        </div>
      </main>
    </CustomerChrome>
  );
}

export default CustomerNotifications;
