import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
    const navigate = useNavigate();
    const [overview, setOverview] = useState({ counts: {}, vendors: [], orders: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/admin/overview", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOverview(response.data);
            } catch (requestError) {
                console.error(requestError);
                setError("Failed to load admin dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const counts = overview.counts || {};
    const stats = [
        ["Users", counts.total_users],
        ["Vendors", counts.total_vendors],
        ["Products", counts.total_products],
        ["Orders", counts.total_orders]
    ];

    return (
        <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="mx-auto max-w-6xl">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="mt-2 text-gray-600">Monitor Street Connect activity.</p>
                    </div>
                    <button type="button" onClick={logout} className="rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-700">Logout</button>
                </header>

                {loading && <p className="mt-8 rounded-xl bg-white p-6 shadow-sm">Loading dashboard...</p>}
                {error && <p className="mt-8 rounded-xl bg-red-100 p-4 text-red-800">{error}</p>}

                {!loading && !error && (
                    <>
                        <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                            {stats.map(([label, value]) => (
                                <div key={label} className="rounded-xl bg-white p-5 shadow-sm">
                                    <p className="text-sm text-gray-500">{label}</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">{value || 0}</p>
                                </div>
                            ))}
                        </section>

                        <section className="mt-8 rounded-xl bg-white p-5 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900">Vendors</h2>
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full min-w-150 text-left text-sm">
                                    <thead className="border-b border-gray-200 text-gray-500"><tr><th className="p-3">Shop</th><th className="p-3">Category</th><th className="p-3">Email</th><th className="p-3">Status</th></tr></thead>
                                    <tbody>{overview.vendors.map((vendor) => <tr key={vendor.vendor_id} className="border-b border-gray-100"><td className="p-3 font-semibold">{vendor.business_name}</td><td className="p-3">{vendor.category}</td><td className="p-3">{vendor.email}</td><td className="p-3 capitalize">{vendor.is_available ? "Open" : "Closed"}</td></tr>)}</tbody>
                                </table>
                            </div>
                        </section>

                        <section className="mt-8 rounded-xl bg-white p-5 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900">Recent orders</h2>
                            <div className="mt-4 space-y-3">{overview.orders.length === 0 ? <p className="text-gray-600">No orders yet.</p> : overview.orders.map((order) => <div key={order.order_id} className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3"><div><p className="font-semibold">Order #{order.order_id} · {order.vendor_name || "Unknown vendor"}</p><p className="text-sm text-gray-500">Customer: {order.customer_name || "Unknown"}</p></div><div className="text-right"><p className="font-semibold">₹{order.total_amount}</p><p className="text-sm capitalize text-gray-500">{order.status}</p></div></div>)}</div>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}

export default AdminDashboard;