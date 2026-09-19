import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const statuses = ["pending", "accepted", "preparing", "ready", "delivered"];

function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
}

function CustomerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/orders/customer", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data.orders || []);
            } catch (requestError) {
                console.error(requestError);
                setError("Failed to load your orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900">My orders</h1>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-gray-600">Track your local orders from purchase to fulfilment.</p>
                    <Link to="/notifications" className="font-semibold text-emerald-700 hover:text-emerald-800">Notifications</Link>
                </div>

                {loading && <p className="mt-6 rounded-xl bg-white p-6 shadow-sm">Loading orders...</p>}
                {error && <p className="mt-6 rounded-xl bg-red-100 p-4 text-red-800">{error}</p>}
                {!loading && !error && orders.length === 0 && <p className="mt-6 rounded-xl bg-white p-6 shadow-sm">You have not placed any orders yet.</p>}

                <div className="mt-6 space-y-5">
                    {orders.map((order) => {
                        const isCancelled = order.status === "cancelled";
                        const currentIndex = statuses.indexOf(order.status);

                        return (
                            <article key={order.order_id} className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Order #{order.order_id}</h2>
                                        <p className="mt-1 text-gray-600">{order.vendor_name || "Local vendor"}</p>
                                    </div>
                                    <span className={`w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${isCancelled ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                    <p><span className="block text-sm text-gray-500">Total</span><strong>₹{order.total_amount}</strong></p>
                                    <p><span className="block text-sm text-gray-500">Fulfilment</span><strong className="capitalize">{order.delivery_type}</strong></p>
                                    <p><span className="block text-sm text-gray-500">Placed</span><strong>{formatDate(order.created_at)}</strong></p>
                                </div>

                                {order.delivery_address && <p className="mt-4 text-gray-700"><span className="font-semibold">Address:</span> {order.delivery_address}</p>}

                                {!isCancelled ? (
                                    <div className="mt-6 grid grid-cols-5 gap-1">
                                        {statuses.map((status, index) => (
                                            <div key={status} className="text-center">
                                                <div className={`mx-auto h-3 w-3 rounded-full ${index <= currentIndex ? "bg-emerald-600" : "bg-gray-300"}`} />
                                                <p className={`mt-2 text-xs capitalize ${index <= currentIndex ? "font-semibold text-emerald-700" : "text-gray-500"}`}>{status}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800">This order was cancelled.</p>
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

export default CustomerOrders;