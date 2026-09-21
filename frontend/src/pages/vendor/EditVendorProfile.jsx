import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VendorChrome from "../../components/VendorChrome";
import { Field, fieldClass, LoadingState, ShopCover } from "../../components/ui";

function EditVendorProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    business_name: "",
    category: "",
    phone: "",
    location_info: "",
    delivary_info: "",
    shop_image: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/vendors/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data.profile;

        setFormData({
          business_name: profile.business_name || "",
          category: profile.category || "",
          phone: profile.phone || "",
          location_info: profile.location_info || "",
          delivary_info: profile.delivary_info || "",
          shop_image: profile.shop_image || "",
        });
      } catch (error) {
        console.error(error);
        setMessage("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
      await axios.put("http://localhost:5000/api/vendors/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Profile updated successfully");
      setTimeout(() => {
        navigate("/vendor/profile");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile");
    }
  };

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
        <h1 className="font-display text-3xl font-bold">Edit Shop</h1>
        <p className="mt-2 text-mute">Update how customers see your stall.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-[2rem] border border-sand bg-white p-6 shadow-sm">
          <ShopCover src={formData.shop_image} name={formData.business_name} className="h-48 w-full rounded-3xl" />

          <Field label="Shop name">
            <input
              type="text"
              name="business_name"
              placeholder="Business Name"
              value={formData.business_name}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <Field label="Category">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <Field label="Phone">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <Field label="Location">
            <input
              type="text"
              name="location_info"
              placeholder="Location"
              value={formData.location_info}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <Field label="Delivery information">
            <input
              type="text"
              name="delivary_info"
              placeholder="Delivery Information"
              value={formData.delivary_info}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <Field label="Shop image" hint="Paste a photo link if you already have one.">
            <input
              type="text"
              name="shop_image"
              placeholder="Shop Image URL"
              value={formData.shop_image}
              onChange={handleChange}
              className={fieldClass}
            />
          </Field>

          <button type="submit" className="w-full min-h-14 rounded-2xl bg-clay text-lg font-black text-white">
            Save Changes
          </button>

          {message ? <p className="text-center font-bold">{message}</p> : null}
        </form>
      </main>
    </VendorChrome>
  );
}

export default EditVendorProfile;
