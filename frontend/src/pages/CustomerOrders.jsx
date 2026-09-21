import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CustomerChrome from "../components/CustomerChrome";
import { LoadingState, ErrorState, EmptyState, StatusBadge } from "../components/ui";

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
          headers: { Authorization: `Bearer ${token}` },
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
    <CustomerChrome>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl font-bold">My orders</h1>
            <p className="mt-2 text-mute">Track your local orders from purchase to fulfilment.</p>
          </div>
          <Link to="/notifications" className="font-extrabold text-forest">
            Notifications
          </Link>
        </div>

        {loading ? <div className="mt-6"><LoadingState label="Loading orders..." /></div> : null}
        {error ? <div className="mt-6"><ErrorState message={error} /></div> : null}
        {!loading && !error && orders.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="You have not placed any orders yet." />
          </div>
        ) : null}

        <div className="mt-6 space-y-5">
          {orders.map((order) => {
            const isCancelled = order.status === "cancelled";
            const currentIndex = statuses.indexOf(order.status);

            return (
              <article
                key={order.order_id}
                className="rounded-3xl border border-sand bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-3 border-b border-sand pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold">Order #{order.order_id}</h2>
                    <p className="mt-1 text-mute">{order.vendor_name || "Local vendor"}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <p>
                    <span className="block text-sm text-mute">Total</span>
                    <strong>₹{order.total_amount}</strong>
                  </p>
                  <p>
                    <span className="block text-sm text-mute">Fulfilment</span>
                    <strong className="capitalize">{order.delivery_type}</strong>
                  </p>
                  <p>
                    <span className="block text-sm text-mute">Date</span>
                    <strong>{formatDate(order.created_at)}</strong>
                  </p>
                </div>

                {order.delivery_address ? (
                  <p className="mt-4 text-stone-700">
                    <span className="font-extrabold">Address:</span> {order.delivery_address}
                  </p>
                ) : null}

                {!isCancelled ? (
                  <div className="mt-6 grid grid-cols-5 gap-1">
                    {statuses.map((status, index) => (
                      <div key={status} className="text-center">
                        <div
                          className={`mx-auto h-3 w-3 rounded-full ${
                            index <= currentIndex ? "bg-forest" : "bg-stone-300"
                          }`}
                        />
                        <p
                          className={`mt-2 text-[11px] capitalize sm:text-xs ${
                            index <= currentIndex ? "font-extrabold text-forest" : "text-mute"
                          }`}
                        >
                          {status}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-800">
                    This order was cancelled.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </main>
    </CustomerChrome>
  );
}

export default CustomerOrders;
