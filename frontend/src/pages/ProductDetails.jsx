import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const CART_KEY = "street_connect_cart";

function ProductDetails() {

    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addedMessage, setAddedMessage] = useState("");

    useEffect(() => {

        const fetchProduct = async () => {
            try {

                const response = await axios.get(
                    `http://localhost:5000/api/products/${id}`
                );

                setProduct(response.data.product);

            } catch (error) {

                console.error(error);
                setError("Failed to load product");

            } finally {

                setLoading(false);

            }
        };

        fetchProduct();

    }, [id]);

    const handleAddToCart = () => {
        const currentCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        const existingItem = currentCart.find((item) => item.product_id === product.product_id);

        const updatedCart = existingItem
            ? currentCart.map((item) => item.product_id === product.product_id
                ? { ...item, quantity: item.quantity + 1 }
                : item)
            : [...currentCart, {
                product_id: product.product_id,
                product_name: product.product_name,
                description: product.description,
                price: Number(product.price),
                stock: Number(product.stock),
                vendor_id: product.vendor_id,
                quantity: 1
            }];

        localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
        setAddedMessage("Added to cart");
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">

            <div className="bg-white rounded-lg shadow p-6">

                <h1 className="text-3xl font-bold">
                    {product.product_name}
                </h1>

                <p className="text-gray-600 mt-3">
                    {product.description}
                </p>

                <p className="text-xl font-bold mt-4">
                    ₹{product.price}
                </p>

                <p className="text-gray-500 mt-2">
                    Stock: {product.stock}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={Number(product.stock) <= 0}
                        className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {Number(product.stock) <= 0 ? "Out of stock" : "Add to cart"}
                    </button>
                    <Link
                        to="/cart"
                        className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50"
                    >
                        View cart
                    </Link>
                </div>

                {addedMessage && (
                    <p className="mt-3 font-medium text-emerald-700">{addedMessage}</p>
                )}

            </div>

        </div>
    );
}

export default ProductDetails;