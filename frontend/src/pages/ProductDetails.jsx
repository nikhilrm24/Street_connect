import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import CustomerChrome from "../components/CustomerChrome";
import { LoadingState, ErrorState } from "../components/ui";
import { initials, resolveImageUrl } from "../utils/media";

const CART_KEY = "street_connect_cart";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedMessage, setAddedMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data.product);
      } catch (requestError) {
        console.error(requestError);
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
    const addBy = Math.min(Math.max(quantity, 1), Number(product.stock) || 1);

    const updatedCart = existingItem
      ? currentCart.map((item) =>
          item.product_id === product.product_id
            ? {
                ...item,
                quantity: Math.min(item.quantity + addBy, Number(product.stock) || item.quantity),
              }
            : item
        )
      : [
          ...currentCart,
          {
            product_id: product.product_id,
            product_name: product.product_name,
            description: product.description,
            price: Number(product.price),
            stock: Number(product.stock),
            vendor_id: product.vendor_id,
            quantity: addBy,
          },
        ];

    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    setAddedMessage("Added to cart");
  };

  const outOfStock = product ? Number(product.stock) <= 0 : true;

  return (
    <CustomerChrome>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {loading ? <LoadingState label="Loading product…" /> : null}
        {error ? <ErrorState message={error} /> : null}

        {!loading && !error && product ? (
          <div className="page-enter grid gap-8 overflow-hidden rounded-[2rem] border border-sand bg-white shadow-sm lg:grid-cols-2">
            {product.image_url ? (
              <img src={resolveImageUrl(product.image_url)} alt={product.product_name} className="min-h-72 w-full object-cover" />
            ) : (
              <div className="stall-pattern flex min-h-72 items-center justify-center p-8 text-white">
                <p className="font-display text-6xl font-bold">{initials(product.product_name)}</p>
              </div>
            )}

            <div className="p-6 sm:p-8">
              <Link to={`/vendors/${product.vendor_id}`} className="text-sm font-extrabold text-leaf">
                View vendor shop
              </Link>
              <h1 className="mt-2 font-display text-4xl font-bold">{product.product_name}</h1>
              <p className="mt-3 leading-relaxed text-mute">{product.description}</p>
              <p className="mt-5 font-display text-4xl font-bold text-forest">₹{product.price}</p>
              <p className="mt-2 text-sm font-bold text-mute">
                {outOfStock ? "Out of stock" : `${product.stock} available`}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm font-extrabold">Quantity</span>
                <button
                  type="button"
                  className="h-12 w-12 rounded-2xl border border-stone-300 text-xl font-bold"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-8 text-center text-lg font-extrabold">{quantity}</span>
                <button
                  type="button"
                  className="h-12 w-12 rounded-2xl border border-stone-300 text-xl font-bold disabled:opacity-40"
                  onClick={() =>
                    setQuantity((value) => Math.min(Number(product.stock) || 1, value + 1))
                  }
                  disabled={quantity >= Number(product.stock)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="min-h-14 flex-1 rounded-2xl bg-clay px-5 text-lg font-extrabold text-white hover:bg-clay-dark disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {outOfStock ? "Out of stock" : "Add to cart"}
                </button>
                <Link
                  to="/cart"
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 px-5 font-extrabold text-ink hover:bg-cream"
                >
                  View cart
                </Link>
              </div>

              {addedMessage ? (
                <p className="mt-4 font-bold text-emerald-700">{addedMessage}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </main>
    </CustomerChrome>
  );
}

export default ProductDetails;
