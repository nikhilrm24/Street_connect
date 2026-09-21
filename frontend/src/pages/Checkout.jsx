import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerChrome from "../components/CustomerChrome";

const CART_KEY = "street_connect_cart";

function Checkout() {
  const navigate = useNavigate();
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cart.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
          delivery_type: deliveryType,
          delivery_address: address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem(CART_KEY);
      navigate("/vendors");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    navigate("/orders");
  }

  return (
    <CustomerChrome>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit} className="page-enter space-y-5">
          <header>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-clay">
              Secure checkout
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold">Place your order</h1>
            <p className="mt-2 text-mute">
              Pickup or delivery from a local vendor. Payment is confirmed with your order.
            </p>
          </header>

          <fieldset className="rounded-3xl border border-sand bg-white p-5">
            <legend className="font-display text-xl font-bold">Delivery / Pickup</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                ["pickup", "Pickup", "Collect from the stall"],
                ["delivery", "Delivery", "Send it to your address"],
              ].map(([value, label, hint]) => (
                <label
                  key={value}
                  className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 ${
                    deliveryType === value ? "border-leaf bg-sand" : "border-stone-200"
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    checked={deliveryType === value}
                    onChange={(event) => setDeliveryType(event.target.value)}
                  />
                  <span>
                    <span className="block font-extrabold">{label}</span>
                    <span className="text-sm text-mute">{hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {deliveryType === "delivery" ? (
            <label className="block rounded-3xl border border-sand bg-white p-5 font-extrabold">
              Address
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
                rows="4"
                className="mt-2 w-full rounded-2xl border border-stone-300 p-3 font-normal"
                placeholder="Enter your delivery address"
              />
            </label>
          ) : null}

          <section className="rounded-3xl border border-sand bg-white p-5">
            <h2 className="font-display text-xl font-bold">Order summary</h2>
            <ul className="mt-3 divide-y divide-sand">
              {cart.map((item) => (
                <li key={item.product_id} className="flex justify-between py-3 text-sm">
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <strong>₹{Number(item.price) * item.quantity}</strong>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between font-display text-2xl font-bold">
              <span>Final total</span>
              <span>₹{total}</span>
            </div>
          </section>

          <section className="rounded-3xl border border-sand bg-cream p-5">
            <h2 className="font-display text-xl font-bold">Payment</h2>
            <p className="mt-2 text-sm text-mute">
              Your order is placed with the vendor using the existing Street Connect checkout.
            </p>
          </section>

          {error ? (
            <p className="rounded-2xl bg-red-100 p-3 font-bold text-red-800">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-16 rounded-2xl bg-clay text-xl font-extrabold text-white hover:bg-clay-dark disabled:opacity-50"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>
      </main>
    </CustomerChrome>
  );
}

export default Checkout;
