import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorState, LoadingState, StatusBadge } from "../components/ui";

function AdminDashboard() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState({ counts: {}, vendors: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vendorQuery, setVendorQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [deletingVendorId, setDeletingVendorId] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/overview", {
          headers: { Authorization: `Bearer ${token}` },
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

  const handleDeleteVendor = async (vendor) => {
    if (!window.confirm(`Delete ${vendor.business_name}? This will also delete its products and location.`)) {
      return;
    }

    try {
      setDeletingVendorId(vendor.vendor_id);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/vendors/${vendor.vendor_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOverview((current) => ({
        ...current,
        vendors: current.vendors.filter((item) => item.vendor_id !== vendor.vendor_id),
        counts: {
          ...current.counts,
          total_vendors: Math.max(0, Number(current.counts.total_vendors || 0) - 1),
        },
      }));
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.response?.data?.message || "Failed to delete vendor");
    } finally {
      setDeletingVendorId(null);
    }
  };

  const counts = overview.counts || {};
  const stats = [
    ["Users", counts.total_users],
    ["Vendors", counts.total_vendors],
    ["Products", counts.total_products],
    ["Orders", counts.total_orders],
  ];

  const filteredVendors = useMemo(() => {
    const q = vendorQuery.toLowerCase();
    return (overview.vendors || []).filter((vendor) =>
      `${vendor.business_name} ${vendor.category} ${vendor.email}`.toLowerCase().includes(q)
    );
  }, [overview.vendors, vendorQuery]);

  const filteredOrders = useMemo(() => {
    if (orderStatus === "all") return overview.orders || [];
    return (overview.orders || []).filter((order) => order.status === orderStatus);
  }, [overview.orders, orderStatus]);

  const statusCounts = useMemo(() => {
    const tally = {};
    (overview.orders || []).forEach((order) => {
      tally[order.status] = (tally[order.status] || 0) + 1;
    });
    return tally;
  }, [overview.orders]);

  const maxStatus = Math.max(1, ...Object.values(statusCounts));

  return (
    <main className="min-h-screen bg-stone-100 p-4 text-ink sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-forest px-5 py-6 text-white">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sand">Operations</p>
            <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sand">Monitor Street Connect activity.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-white px-4 py-2 font-extrabold text-forest"
          >
            Logout
          </button>
        </header>

        {loading ? <div className="mt-8"><LoadingState label="Loading dashboard..." /></div> : null}
        {error ? <div className="mt-8"><ErrorState message={error} /></div> : null}

        {!loading && !error ? (
          <>
            <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-sand bg-white p-5 shadow-sm">
                  <p className="text-sm font-bold text-mute">{label}</p>
                  <p className="mt-2 font-display text-3xl font-bold">{value || 0}</p>
                </div>
              ))}
            </section>

            {Object.keys(statusCounts).length > 0 ? (
              <section className="mt-8 rounded-3xl border border-sand bg-white p-5 shadow-sm">
                <h2 className="font-display text-xl font-bold">Recent order mix</h2>
                <p className="mt-1 text-sm text-mute">Based on the latest orders already loaded.</p>
                <div className="mt-4 space-y-3">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status}>
                      <div className="mb-1 flex justify-between text-sm font-bold capitalize">
                        <span>{status}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-sand">
                        <div
                          className="h-2 rounded-full bg-forest"
                          style={{ width: `${(count / maxStatus) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-8 rounded-3xl border border-sand bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold">Vendor management</h2>
                <input
                  value={vendorQuery}
                  onChange={(event) => setVendorQuery(event.target.value)}
                  placeholder="Filter vendors"
                  className="min-h-11 rounded-xl border border-stone-300 px-3"
                />
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-150 text-left text-sm">
                  <thead className="border-b border-sand text-mute">
                    <tr>
                      <th className="p-3">Shop</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.vendor_id} className="border-b border-sand/70">
                        <td className="p-3 font-extrabold">{vendor.business_name}</td>
                        <td className="p-3">{vendor.category}</td>
                        <td className="p-3">{vendor.email}</td>
                        <td className="p-3">
                          <StatusBadge open={Boolean(vendor.is_available)} />
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleDeleteVendor(vendor)}
                            disabled={deletingVendorId === vendor.vendor_id}
                            className="min-h-10 rounded-xl border border-red-300 px-3 font-extrabold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingVendorId === vendor.vendor_id ? "Deleting..." : "Delete stall"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-sand bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold">Order management</h2>
                <select
                  value={orderStatus}
                  onChange={(event) => setOrderStatus(event.target.value)}
                  className="min-h-11 rounded-xl border border-stone-300 px-3"
                >
                  <option value="all">All statuses</option>
                  {["pending", "accepted", "preparing", "ready", "delivered", "cancelled"].map(
                    (status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="mt-4 space-y-3">
                {filteredOrders.length === 0 ? (
                  <p className="text-mute">No orders yet.</p>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.order_id}
                      className="flex flex-wrap items-center justify-between gap-3 border-b border-sand pb-3"
                    >
                      <div>
                        <p className="font-extrabold">
                          Order #{order.order_id} · {order.vendor_name || "Unknown vendor"}
                        </p>
                        <p className="text-sm text-mute">
                          Customer: {order.customer_name || "Unknown"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold">₹{order.total_amount}</p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

export default AdminDashboard;
