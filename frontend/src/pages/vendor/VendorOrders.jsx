import { useEffect, useState } from "react";
import axios from "axios";
import VendorChrome from "../../components/VendorChrome";
import { EmptyState, ErrorState, LoadingState, StatusBadge } from "../../components/ui";

const ordersUrl = "http://localhost:5000/api/vendors/orders";

const statusActions = {
  pending: [
    { label: "Accept", status: "accepted", className: "bg-emerald-700 hover:bg-emerald-800" },
    { label: "Reject", status: "cancelled", className: "bg-red-600 hover:bg-red-700" },
  ],
  accepted: [
    { label: "Start Preparing", status: "preparing", className: "bg-sky-700 hover:bg-sky-800" },
  ],
  preparing: [
    { label: "Mark Ready", status: "ready", className: "bg-amber-600 hover:bg-amber-700" },
  ],
  ready: [
    { label: "Mark Delivered", status: "delivered", className: "bg-emerald-700 hover:bg-emerald-800" },
  ],
};

function formatCreatedAt(createdAt) {
  if (!createdAt) {
    return "Not available";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return date.toLocaleString();
}

function isDeliveryAddressApplicable(order) {
  const deliveryType = String(order.delivery_type || "").toLowerCase();
  return Boolean(order.delivery_address) && !["pickup", "pick-up", "self pickup"].includes(deliveryType);
}

function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(ordersUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.orders || []);
      } catch (requestError) {
        console.error(requestError);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    setUpdateError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${ordersUrl}/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) => {
          if (order.order_id !== orderId) {
            return order;
          }

          return {
            ...order,
            ...(response.data.order || {}),
            status,
          };
        })
      );
    } catch (requestError) {
      console.error(requestError);
      setUpdateError("Failed to update order status. Please try again.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <VendorChrome>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Orders</h1>
        <p className="mt-2 text-mute">See what customers want. Tap the next step.</p>

        {loading ? <div className="mt-6"><LoadingState label="Loading orders..." /></div> : null}
        {error ? <div className="mt-6"><ErrorState message={error} /></div> : null}
        {updateError ? (
          <p className="mt-6 rounded-2xl bg-red-100 p-4 font-bold text-red-800">{updateError}</p>
        ) : null}

        {!loading && !error && orders.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No orders yet" />
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="mt-6 space-y-5">
            {orders.map((order) => {
              const actions = statusActions[order.status] || [];
              const isUpdating = updatingOrderId === order.order_id;
              const items = Array.isArray(order.items) ? order.items : [];

              return (
                <article
                  key={order.order_id}
                  className="rounded-[1.75rem] border border-sand bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-3 border-b border-sand pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-clay">
                        {order.status === "pending" ? "New order" : "Order"}
                      </p>
                      <h2 className="font-display text-2xl font-bold">#{order.order_id}</h2>
                      <p className="mt-1 text-sm text-mute">{formatCreatedAt(order.created_at)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-bold text-mute">Customer</dt>
                      <dd className="mt-1 text-lg font-extrabold">{order.customer_name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-bold text-mute">Email</dt>
                      <dd className="mt-1 wrap-break-word text-lg">{order.customer_email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-bold text-mute">Total</dt>
                      <dd className="mt-1 text-lg font-black">₹{order.total_amount}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-bold text-mute">Pickup or delivery</dt>
                      <dd className="mt-1 text-lg capitalize">{order.delivery_type}</dd>
                    </div>
                    {isDeliveryAddressApplicable(order) && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-bold text-mute">Delivery address</dt>
                        <dd className="mt-1 text-lg">{order.delivery_address}</dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-5 rounded-2xl bg-cream p-4">
                    <h3 className="text-lg font-black">Items</h3>
                    <div className="mt-3 space-y-2">
                      {items.length === 0 ? (
                        <p className="text-sm text-mute">No items attached to this order.</p>
                      ) : (
                        items.map((item) => (
                          <div
                            key={item.order_item_id || `${order.order_id}-${item.product_id}`}
                            className="flex items-center justify-between gap-3 border-b border-sand pb-2 last:border-b-0 last:pb-0"
                          >
                            <div>
                              <p className="font-extrabold">{item.product_name}</p>
                              <p className="text-sm text-mute">
                                Qty: {item.quantity} × ₹{item.price}
                              </p>
                            </div>
                            <p className="font-black">
                              ₹{Number(item.quantity || 0) * Number(item.price || 0)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {actions.length > 0 && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {actions.map((action) => (
                        <button
                          key={action.status}
                          type="button"
                          onClick={() => handleStatusUpdate(order.order_id, action.status)}
                          disabled={isUpdating}
                          className={`min-h-16 rounded-2xl px-5 py-3 text-xl font-black text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${action.className}`}
                        >
                          {isUpdating ? "Updating..." : action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : null}
      </main>
    </VendorChrome>
  );
}

export default VendorOrders;
