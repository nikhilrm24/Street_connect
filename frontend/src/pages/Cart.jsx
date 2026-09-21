import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerChrome from "../components/CustomerChrome";
import { EmptyState } from "../components/ui";
import { initials } from "../utils/media";

const CART_KEY = "street_connect_cart";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  };

  const updateQuantity = (productId, quantity) => {
    const item = cart.find((cartItem) => cartItem.product_id === productId);
    const nextQuantity = Math.min(Math.max(quantity, 1), Number(item?.stock || quantity));
    saveCart(
      cart.map((cartItem) =>
        cartItem.product_id === productId
          ? { ...cartItem, quantity: nextQuantity }
          : cartItem
      )
    );
  };

  const removeItem = (productId) => {
    saveCart(cart.filter((item) => item.product_id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CustomerChrome>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl font-bold">Your cart</h1>
            <p className="mt-1 text-mute">Review your local shop items before checkout.</p>
          </div>
          <Link to="/vendors" className="font-extrabold text-forest hover:text-leaf">
            Continue shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            detail="Find a nearby stall and add something good."
            action={
              <Link
                to="/vendors"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-forest px-5 font-extrabold text-white"
              >
                Browse vendors
              </Link>
            }
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <section className="space-y-3">
              {cart.map((item) => (
                <article
                  key={item.product_id}
                  className="flex flex-col gap-4 rounded-3xl border border-sand bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="stall-pattern flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white">
                    {initials(item.product_name)}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-xl font-bold">{item.product_name}</h2>
                    <p className="mt-1 text-mute">₹{item.price} each</p>
                    <p className="mt-1 text-sm font-bold text-forest">
                      ₹{Number(item.price) * item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="h-11 w-11 rounded-xl border border-stone-300 text-lg font-bold"
                      aria-label={`Decrease ${item.product_name} quantity`}
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center font-extrabold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="h-11 w-11 rounded-xl border border-stone-300 text-lg font-bold disabled:opacity-40"
                      aria-label={`Increase ${item.product_name} quantity`}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product_id)}
                      className="ml-1 font-extrabold text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-3xl border border-sand bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold">Summary</h2>
              <div className="mt-4 flex justify-between border-b border-sand pb-4 text-mute">
                <span>Items</span>
                <span className="font-bold text-ink">{itemCount}</span>
              </div>
              <div className="mt-4 flex justify-between text-xl font-extrabold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full min-h-14 rounded-2xl bg-clay text-lg font-extrabold text-white hover:bg-clay-dark"
              >
                Continue to checkout
              </button>
            </aside>
          </div>
        )}
      </main>
    </CustomerChrome>
  );
}

export default Cart;
