import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
            await axios.post("http://localhost:5000/api/orders", {
                items: cart.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
                delivery_type: deliveryType,
                delivery_address: address
            }, { headers: { Authorization: `Bearer ${token}` } });

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
        <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                <p className="mt-2 text-gray-600">Total: ₹{total}</p>

                <fieldset className="mt-8">
                    <legend className="text-lg font-bold text-gray-900">Fulfilment</legend>
                    <div className="mt-3 flex gap-4">
                        <label className="flex items-center gap-2"><input type="radio" value="pickup" checked={deliveryType === "pickup"} onChange={(event) => setDeliveryType(event.target.value)} /> Pickup</label>
                        <label className="flex items-center gap-2"><input type="radio" value="delivery" checked={deliveryType === "delivery"} onChange={(event) => setDeliveryType(event.target.value)} /> Delivery</label>
                    </div>
                </fieldset>

                {deliveryType === "delivery" && (
                    <label className="mt-6 block font-medium text-gray-800">Delivery address
                        <textarea value={address} onChange={(event) => setAddress(event.target.value)} required rows="4" className="mt-2 w-full rounded-lg border border-gray-300 p-3" placeholder="Enter your delivery address" />
                    </label>
                )}

                {error && <p className="mt-5 rounded-lg bg-red-100 p-3 text-red-800">{error}</p>}
                <button type="submit" disabled={submitting} className="mt-8 w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50">
                    {submitting ? "Placing order..." : "Place order"}
                </button>
            </form>
        </main>
    );
}

export default Checkout;