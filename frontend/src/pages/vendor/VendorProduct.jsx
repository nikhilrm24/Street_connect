import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VendorChrome from "../../components/VendorChrome";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui";
import { initials } from "../../utils/media";

function VendorProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/vendors/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(products.filter((product) => product.product_id !== productId));
    } catch (requestError) {
      console.error(requestError);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/vendors/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data.products);
      } catch (requestError) {
        console.error(requestError);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <VendorChrome>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-3xl font-bold">My Products</h1>
          <button
            type="button"
            onClick={() => navigate("/vendor/products/add")}
            className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-clay px-6 text-lg font-black text-white hover:bg-clay-dark"
          >
            + Add Product
          </button>
        </div>

        {loading ? <div className="mt-6"><LoadingState label="Loading products..." /></div> : null}
        {error ? <div className="mt-6"><ErrorState message={error} /></div> : null}

        {!loading && !error && products.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No products yet" detail="Add your first item so customers can order." />
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.product_id}
                className="overflow-hidden rounded-3xl border border-sand bg-white shadow-sm"
              >
                <div className="stall-pattern flex h-40 items-center justify-center text-white">
                  <span className="font-display text-4xl font-bold">
                    {initials(product.product_name)}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-display text-2xl font-bold">{product.product_name}</h2>
                  <p className="mt-2 text-mute">{product.description}</p>
                  <p className="mt-3 text-2xl font-black text-forest">₹{product.price}</p>
                  <p className="mt-1 font-bold text-mute">Stock: {product.stock}</p>
                  <p
                    className={`mt-2 text-sm font-extrabold ${
                      Number(product.stock) > 0 ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {Number(product.stock) > 0 ? "Available" : "Unavailable"}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/vendor/products/edit/${product.product_id}`)}
                      className="min-h-12 rounded-2xl bg-forest font-extrabold text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.product_id)}
                      className="min-h-12 rounded-2xl border border-red-300 font-extrabold text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </main>
    </VendorChrome>
  );
}

export default VendorProducts;
