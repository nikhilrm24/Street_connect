import { useState } from "react";
import axios from "axios";

function AddProduct() {

    const [formData, setFormData] = useState({
        category_id: "",
        product_name: "",
        description: "",
        price: "",
        stock: ""
    });

    const [message, setMessage] = useState("");

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

            const response = await axios.post(
                "http://localhost:5000/api/vendors/products",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Product added successfully");

            console.log(response.data);

            setFormData({
                category_id: "",
                product_name: "",
                description: "",
                price: "",
                stock: ""
            });

        } catch (error) {

            console.error(error);
            setMessage("Failed to add product");

        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Add Product
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow rounded-lg p-6 space-y-4"
            >

                <input
                    type="number"
                    name="category_id"
                    placeholder="Category ID"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="text"
                    name="product_name"
                    placeholder="Product Name"
                    value={formData.product_name}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white rounded p-3"
                >
                    Add Product
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

export default AddProduct;