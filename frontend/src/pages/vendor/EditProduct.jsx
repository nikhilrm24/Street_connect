import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        category_id: "",
        product_name: "",
        description: "",
        price: "",
        stock: ""
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const response = await axios.get(
                    `http://localhost:5000/api/products/${id}`
                );

                const product = response.data.product;

                setFormData({
                    category_id: product.category_id,
                    product_name: product.product_name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock
                });

            } catch (error) {

                console.error(error);
                setMessage("Failed to load product");

            } finally {

                setLoading(false);

            }
        };

        fetchProduct();

    }, [id]);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/vendors/products/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Product updated successfully");

            setTimeout(() => {
                navigate("/vendor/products");
            }, 1000);

        } catch (error) {

            console.error(error);
            setMessage("Failed to update product");

        }
    };


    if (loading) {
        return <h2>Loading...</h2>;
    }


    return (
        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Edit Product
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow rounded-lg p-6 space-y-4"
            >

                <input
                    type="number"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white rounded p-3"
                >
                    Update Product
                </button>

                {message && (
                    <p className="text-center">
                        {message}
                    </p>
                )}

            </form>

        </div>
    );
}

export default EditProduct;