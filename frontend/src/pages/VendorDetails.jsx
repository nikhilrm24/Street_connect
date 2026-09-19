import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

const resolveImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    if (imagePath.startsWith("/")) return `${API_BASE_URL}${imagePath}`;
    return imagePath;
};

function VendorDetails() {

    const { id } = useParams();
    const navigate=useNavigate();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {

        const fetchVendor = async () => {
            try {

                const response = await axios.get(
                    `http://localhost:5000/api/vendors/${id}`
                );

                setVendor(response.data.vendor);

                const productResponse = await axios.get(
                            `http://localhost:5000/api/vendors/${id}/products`
                   );

               setProducts(productResponse.data.products);

            } catch (error) {

                console.error(error);
                setError("Failed to load vendor");

            } finally {

                setLoading(false);

            }
        };

        fetchVendor();

    }, [id]);


    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }
return (
    <div className="max-w-5xl mx-auto p-6">

        
        {vendor.shop_image && (
            <img
                src={resolveImageUrl(vendor.shop_image)}
                alt={vendor.business_name}
                className="w-full h-64 object-cover rounded-lg mb-6"
            />
        )}

       
        <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h1 className="text-3xl font-bold mb-2">
                    {vendor.business_name}
                </h1>

                <span className={`rounded-full px-3 py-1 text-sm font-bold ${vendor.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {vendor.is_available ? "Open" : "Closed"}
                </span>
            </div>

            <p className="text-gray-600 mb-4">
                {vendor.category}
            </p>

            <div className="space-y-2">

                <p>
                    <strong>Phone:</strong> {vendor.phone}
                </p>

                <p>
                    <strong>Location:</strong> {vendor.location_info}
                </p>

                <p>
                    <strong>Delivery:</strong> {vendor.delivary_info}
                </p>

                <p>
                    <strong>Rating:</strong> ⭐ {vendor.rating}
                </p>

                <p className={`text-sm font-semibold ${vendor.is_available ? "text-green-700" : "text-red-700"}`}>
                    {vendor.is_available ? "This shop is currently accepting orders." : "This shop is currently closed and not accepting new orders."}
                </p>

            </div>

        </div>
        <div className="mt-8">

    <h2 className="text-2xl font-bold mb-4">
        Products
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {products.map((product) => (
            <div
                key={product.product_id}
                className="border rounded-lg p-4 shadow-sm"
                onClick={()=>{
                       navigate(`/products/${product.product_id}`);
                }}
            >
                <h3 className="text-lg font-semibold">
                    {product.product_name}
                </h3>

                <p className="text-gray-600">
                    {product.description}
                </p>

                <p className="font-bold mt-2">
                    ₹{product.price}
                </p>

                <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                </p>
            </div>
        ))}

    </div>

</div>

    </div>
);
}

export default VendorDetails;