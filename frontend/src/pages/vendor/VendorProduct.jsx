import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function VendorProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

     const handleDelete = async (productId) => {

    try {

        const token = localStorage.getItem("token");

        await axios.delete(
            `http://localhost:5000/api/vendors/products/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setProducts(
            products.filter(
                (product) => product.product_id !== productId
            )
        );

    } catch (error) {

        console.error(error);

    }
};


    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/vendors/products",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setProducts(response.data.products);

            } catch (error) {

                console.error(error);
                setError("Failed to load products");

            } finally {

                setLoading(false);

            }
        };

        fetchProducts();

    }, []);

    if (loading) {
        return <h2>Loading products...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                My Products
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

               {products.map((product) => (
    <div
        key={product.product_id}
        className="bg-white rounded-lg shadow p-5"
    >

        <h2 className="text-xl font-semibold">
            {product.product_name}
        </h2>

        <p className="text-gray-600 mt-2">
            {product.description}
        </p>

        <p className="font-bold mt-3">
            ₹{product.price}
        </p>

        <p className="text-gray-500 mt-1">
            Stock: {product.stock}
        </p>

        <button
            onClick={() =>
                navigate(`/vendor/products/edit/${product.product_id}`)
            }
            className="mt-4 border px-4 py-2 rounded"
        >
            Edit
        </button>
                    <button
                onClick={() => handleDelete(product.product_id)}
                className="mt-2 border px-4 py-2 rounded"
            >
                Delete
            </button>

    </div>
))}

            </div>
                   

        </div>
    );
}

export default VendorProducts;