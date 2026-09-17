import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProductDetails() {

    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            </div>

        </div>
    );
}

export default ProductDetails;