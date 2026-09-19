import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CustomerNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/orders/notifications", {
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
        <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="mx-auto max-w-3xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                        <p className="mt-2 text-gray-600">Updates about your Street Connect orders.</p>
                    </div>
                    <Link to="/orders" className="font-semibold text-emerald-700 hover:text-emerald-800">My orders</Link>
                </div>

                {loading && <p className="mt-6 rounded-xl bg-white p-6 shadow-sm">Loading notifications...</p>}
                {error && <p className="mt-6 rounded-xl bg-red-100 p-4 text-red-800">{error}</p>}
                {!loading && !error && notifications.length === 0 && <p className="mt-6 rounded-xl bg-white p-6 shadow-sm">No notifications yet.</p>}

                <div className="mt-6 space-y-3">
                    {notifications.map((notification) => (
                        <article key={notification.id} className="rounded-xl bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{notification.title}</h2>
                                    <p className="mt-1 text-gray-700">{notification.message}</p>
                                </div>
                                <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold capitalize text-emerald-800">{notification.status}</span>
                            </div>
                            <p className="mt-3 text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default CustomerNotifications;