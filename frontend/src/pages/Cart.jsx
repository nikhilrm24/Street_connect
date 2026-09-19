import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        saveCart(cart.map((cartItem) => cartItem.product_id === productId
            ? { ...cartItem, quantity: nextQuantity }
            : cartItem));
    };

    const removeItem = (productId) => {
        saveCart(cart.filter((item) => item.product_id !== productId));
    };

    const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    return (
        <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Your cart</h1>
                        <p className="mt-1 text-gray-600">Review your local shop items before checkout.</p>
                    </div>
                    <Link to="/vendors" className="font-semibold text-emerald-700 hover:text-emerald-800">
                        Continue shopping
                    </Link>
                </div>

                {cart.length === 0 ? (
                    <section className="rounded-xl bg-white p-8 text-center shadow-sm">
                        <p className="text-lg text-gray-700">Your cart is empty.</p>
                        <Link to="/vendors" className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">
                            Browse vendors
                        </Link>
                    </section>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                        <section className="space-y-3">
                            {cart.map((item) => (
                                <article key={item.product_id} className="rounded-xl bg-white p-5 shadow-sm">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">{item.product_name}</h2>
                                            <p className="mt-1 text-gray-600">₹{item.price} each</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="h-9 w-9 rounded border border-gray-300 text-lg" aria-label={`Decrease ${item.product_name} quantity`}>-</button>
                                            <span className="min-w-6 text-center font-semibold">{item.quantity}</span>
                                            <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="h-9 w-9 rounded border border-gray-300 text-lg disabled:opacity-40" aria-label={`Increase ${item.product_name} quantity`}>+</button>
                                            <button type="button" onClick={() => removeItem(item.product_id)} className="ml-2 font-semibold text-red-600 hover:text-red-700">Remove</button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </section>

                        <aside className="h-fit rounded-xl bg-white p-5 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900">Summary</h2>
                            <div className="mt-4 flex justify-between border-b border-gray-200 pb-4 text-gray-700">
                                <span>Items</span>
                                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                            </div>
                            <div className="mt-4 flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                            <button type="button" onClick={() => navigate("/checkout")} className="mt-5 w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800">
                                Continue to checkout
                            </button>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}

export default Cart;