import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import VendorChrome from "../../components/VendorChrome";
import { Field, fieldClass, LoadingState } from "../../components/ui";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category_id: "",
    product_name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((response) => {
        setCategories(response.data.category || response.data.categories || []);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        const product = response.data.product;
        setFormData({
          category_id: product.category_id,
          product_name: product.product_name,
          description: product.description,
          price: product.price,
          stock: product.stock,
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
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/vendors/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Product updated successfully");
      setTimeout(() => {
        navigate("/vendor/products");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update product");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/vendors/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/vendor/products");
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete product");
    }
  };

  const categoryIdKey = categories[0]
    ? Object.keys(categories[0]).find((key) => key.toLowerCase().includes("id"))
    : "category_id";
  const categoryNameKey = categories[0]
    ? Object.keys(categories[0]).find((key) =>
        ["name", "category_name", "category"].includes(key)
      )
    : "name";

  if (loading) {
    return (
      <VendorChrome>
        <main className="mx-auto max-w-2xl px-4 py-6">
          <LoadingState label="Loading..." />
        </main>
      </VendorChrome>
    );
  }

  return (
    <VendorChrome>
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Edit Product</h1>
        <p className="mt-2 text-mute">Change the details, then save.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-[2rem] border border-sand bg-white p-6 shadow-sm">
          <div className="stall-pattern flex h-36 items-center justify-center rounded-3xl font-display text-4xl font-bold text-white">
            {String(formData.product_name || "P").slice(0, 1).toUpperCase()}
          </div>

          <Field label="Product name">
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <Field label="Price">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <Field label="Category">
            {categories.length > 0 ? (
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={fieldClass}
              >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category[categoryIdKey]} value={category[categoryIdKey]}>
                    {category[categoryNameKey]}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={fieldClass}
              />
            )}
          </Field>

          <Field label="Stock / availability">
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={fieldClass}
              rows="3"
            />
          </Field>

          <button
            type="submit"
            className="w-full min-h-14 rounded-2xl bg-clay text-lg font-black text-white hover:bg-clay-dark"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-full min-h-12 rounded-2xl border border-red-300 font-extrabold text-red-700"
          >
            Delete
          </button>

          {message ? <p className="text-center font-bold">{message}</p> : null}
        </form>
      </main>
    </VendorChrome>
  );
}

export default EditProduct;
