import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CustomerChrome from "../components/CustomerChrome";
import { ShopCover, StatusBadge, LoadingState, ErrorState, EmptyState } from "../components/ui";
import { initials } from "../utils/media";

function VendorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/vendors/${id}`);
        setVendor(response.data.vendor);

        const productResponse = await axios.get(
          `http://localhost:5000/api/vendors/${id}/products`
        );
        setProducts(productResponse.data.products);
      } catch (requestError) {
        console.error(requestError);
        setError("Failed to load vendor");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  return (
    <CustomerChrome>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {loading ? <LoadingState label="Opening this shop…" /> : null}
        {error ? <ErrorState message={error} /> : null}

        {!loading && !error && vendor ? (
          <div className="page-enter">
            <div className="overflow-hidden rounded-[2rem] border border-sand bg-white shadow-sm">
              <ShopCover
                src={vendor.shop_image}
                name={vendor.business_name}
                className="h-56 w-full sm:h-72"
              />
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-wide text-clay">
                      {vendor.category}
                    </p>
                    <h1 className="mt-1 font-display text-4xl font-bold">
                      {vendor.business_name}
                    </h1>
                  </div>
                  <StatusBadge open={Boolean(vendor.is_available)} />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <p className="rounded-2xl bg-cream px-4 py-3 text-sm">
                    <strong>Phone</strong>
                    <span className="mt-1 block text-base">{vendor.phone || "Not listed"}</span>
                  </p>
                  <p className="rounded-2xl bg-cream px-4 py-3 text-sm">
                    <strong>Location</strong>
                    <span className="mt-1 block text-base">{vendor.location_info}</span>
                  </p>
                  <p className="rounded-2xl bg-cream px-4 py-3 text-sm">
                    <strong>Delivery</strong>
                    <span className="mt-1 block text-base">{vendor.delivary_info}</span>
                  </p>
                  <p className="rounded-2xl bg-cream px-4 py-3 text-sm">
                    <strong>Rating</strong>
                    <span className="mt-1 block text-base">⭐ {vendor.rating}</span>
                  </p>
                </div>

                <p
                  className={`mt-5 font-bold ${
                    vendor.is_available ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {vendor.is_available
                    ? "This shop is currently accepting orders."
                    : "This shop is currently closed and not accepting new orders."}
                </p>
              </div>
            </div>

            <h2 className="mt-10 font-display text-3xl font-bold">Products</h2>
            {products.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No products yet" detail="This stall has not listed items." />
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                {products.map((product) => (
                  <button
                    key={product.product_id}
                    type="button"
                    className="overflow-hidden rounded-3xl border border-sand bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    onClick={() => navigate(`/products/${product.product_id}`)}
                  >
                    <div className="stall-pattern flex h-36 items-center justify-center text-white">
                      <span className="font-display text-3xl font-bold">
                        {initials(product.product_name)}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg font-bold">{product.product_name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-mute">{product.description}</p>
                      <p className="mt-3 text-lg font-extrabold text-forest">₹{product.price}</p>
                      <p className="text-sm text-mute">
                        {Number(product.stock) > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </main>
    </CustomerChrome>
  );
}

export default VendorDetails;
