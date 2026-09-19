import { useEffect, useState } from "react";
import axios from "axios";
import NavbarVendor from "../../components/NavbarVendor";

const notificationsUrl = "http://localhost:5000/api/vendors/notifications";

function formatCreatedAt(createdAt) {
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
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
          headers: { Authorization: `Bearer ${token}` }
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
    <>
      <NavbarVendor />
      <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Notifications</h1>

          {loading && <p className="rounded-lg bg-white p-6 shadow-sm">Loading notifications...</p>}
          {error && <p className="rounded-lg bg-red-100 p-4 font-medium text-red-800">{error}</p>}
          {!loading && !error && notifications.length === 0 && (
            <p className="rounded-lg bg-white p-6 text-gray-700 shadow-sm">No notifications yet.</p>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <article key={notification.id} className="rounded-lg bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{notification.title}</h2>
                      <p className="mt-1 text-gray-700">{notification.message}</p>
                    </div>
                    <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold capitalize text-blue-800">
                      {notification.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">{formatCreatedAt(notification.created_at)}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default VendorNotifications;