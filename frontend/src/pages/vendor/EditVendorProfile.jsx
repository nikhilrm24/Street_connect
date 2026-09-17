import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditVendorProfile() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        business_name: "",
        category: "",
        phone: "",
        location_info: "",
        delivary_info: "",
        shop_image: ""
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/vendors/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const profile = response.data.profile;

                setFormData({
                    business_name: profile.business_name || "",
                    category: profile.category || "",
                    phone: profile.phone || "",
                    location_info: profile.location_info || "",
                    delivary_info: profile.delivary_info || "",
                    shop_image: profile.shop_image || ""
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
            [name]: value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                "http://localhost:5000/api/vendors/profile",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

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
        return <h2>Loading...</h2>;
    }


    return (
        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Edit Shop Profile
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow rounded-lg p-6 space-y-4"
            >

                <input
                    type="text"
                    name="business_name"
                    placeholder="Business Name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="text"
                    name="location_info"
                    placeholder="Location"
                    value={formData.location_info}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="text"
                    name="delivary_info"
                    placeholder="Delivery Information"
                    value={formData.delivary_info}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="text"
                    name="shop_image"
                    placeholder="Shop Image URL"
                    value={formData.shop_image}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white rounded p-3"
                >
                    Update Profile
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

export default EditVendorProfile;