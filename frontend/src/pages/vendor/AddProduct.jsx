import { useEffect, useState } from "react";
import axios from "axios";
import VendorChrome from "../../components/VendorChrome";
import { Field, fieldClass } from "../../components/ui";

function AddProduct() {
  const [formData, setFormData] = useState({
    category_id: "",
    product_name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((response) => {
        setCategories(response.data.category || response.data.categories || []);
      })
      .catch(() => setCategories([]));
  }, []);

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
      const response = await axios.post(
        "http://localhost:5000/api/vendors/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Product added successfully");
      console.log(response.data);

      setFormData({
        category_id: "",
        product_name: "",
        description: "",
        price: "",
        stock: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("Failed to add product");
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

  return (
    <VendorChrome>
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Add Product</h1>
        <p className="mt-2 text-mute">Tell customers what you sell. Keep it simple.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-[2rem] border border-sand bg-white p-6 shadow-sm">
          <div className="stall-pattern flex h-40 items-center justify-center rounded-3xl text-white">
            <p className="px-6 text-center font-extrabold">
              Product photos are not stored yet. A clear name and price still help customers find you.
            </p>
          </div>

          <Field label="1. Product name">
            <input
              type="text"
              name="product_name"
              placeholder="Product Name"
              value={formData.product_name}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <Field label="2. Price">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <Field label="3. Category">
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
                placeholder="Category ID"
                value={formData.category_id}
                onChange={handleChange}
                className={fieldClass}
              />
            )}
          </Field>

          <Field label="4. Stock / availability">
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              placeholder="Description"
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
            Save
          </button>

          {message ? <p className="text-center font-bold text-forest">{message}</p> : null}
        </form>
      </main>
    </VendorChrome>
  );
}

export default AddProduct;
