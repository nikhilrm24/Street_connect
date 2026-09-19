import { useEffect, useState } from "react";
import axios from "axios";
import NavbarVendor from "../../components/NavbarVendor";

const ordersUrl = "http://localhost:5000/api/vendors/orders";

const statusActions = {
  pending: [
    { label: "Accept", status: "accepted", className: "bg-green-600 hover:bg-green-700" },
    { label: "Reject", status: "cancelled", className: "bg-red-600 hover:bg-red-700" },
  ],
  accepted: [
    { label: "Start Preparing", status: "preparing", className: "bg-blue-600 hover:bg-blue-700" },
  ],
  preparing: [
    { label: "Mark Ready", status: "ready", className: "bg-amber-600 hover:bg-amber-700" },
  ],
  ready: [
    { label: "Mark Delivered", status: "delivered", className: "bg-green-600 hover:bg-green-700" },
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

  if (loading) {
    return (
      <>
        <NavbarVendor />
        <main className="min-h-screen bg-gray-100 p-6">
          <div className="mx-auto max-w-4xl">
            <p className="text-lg font-medium text-gray-700">Loading orders...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarVendor />
        <main className="min-h-screen bg-gray-100 p-6">
          <div className="mx-auto max-w-4xl">
            <p className="rounded-lg bg-red-100 p-4 text-lg font-medium text-red-800">{error}</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavbarVendor />
      <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Vendor Orders</h1>
            <p className="mt-2 text-gray-600">Review and update your customer orders.</p>
          </div>

          {updateError && (
            <p className="mb-6 rounded-lg bg-red-100 p-4 font-medium text-red-800">{updateError}</p>
          )}

          {orders.length === 0 ? (
            <p className="rounded-lg bg-white p-6 text-lg text-gray-700 shadow-sm">No orders yet</p>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const actions = statusActions[order.status] || [];
                const isUpdating = updatingOrderId === order.order_id;

                return (
                  <article key={order.order_id} className="rounded-lg bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Order #{order.order_id}</h2>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatCreatedAt(order.created_at)}
                        </p>
                      </div>
                      <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold capitalize text-gray-800">
                        {order.status}
                      </span>
                    </div>

                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Customer</dt>
                        <dd className="mt-1 text-lg text-gray-900">{order.customer_name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 wrap-break-word text-lg text-gray-900">{order.customer_email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Total amount</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">₹{order.total_amount}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Delivery type</dt>
                        <dd className="mt-1 text-lg capitalize text-gray-900">{order.delivery_type}</dd>
                      </div>
                      {isDeliveryAddressApplicable(order) && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Delivery address</dt>
                          <dd className="mt-1 text-lg text-gray-900">{order.delivery_address}</dd>
                        </div>
                      )}
                    </dl>

                    <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h3 className="text-lg font-semibold text-gray-900">Order items</h3>
                      <div className="mt-3 space-y-2">
                        {(Array.isArray(order.items) ? order.items : []).length === 0 ? (
                          <p className="text-sm text-gray-500">No items attached to this order.</p>
                        ) : (
                          (Array.isArray(order.items) ? order.items : []).map((item) => (
                            <div
                              key={item.order_item_id || `${order.order_id}-${item.product_id}`}
                              className="flex items-center justify-between gap-3 border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
                            >
                              <div>
                                <p className="font-medium text-gray-900">{item.product_name}</p>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity} × ₹{item.price}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900">₹{Number(item.quantity || 0) * Number(item.price || 0)}</p>
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
                            className={`min-h-14 rounded-lg px-5 py-3 text-lg font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${action.className}`}
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
          )}
        </div>
      </main>
    </>
  );
}

export default VendorOrders;
