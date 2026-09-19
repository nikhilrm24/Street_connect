import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const resolveImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    if (imagePath.startsWith("/")) return `${API_BASE_URL}${imagePath}`;
    return imagePath;
};

function VendorProfile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toggling, setToggling] = useState(false);

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

            setProfile(response.data.profile);
        } catch (fetchError) {
            console.error(fetchError);
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleAvailabilityToggle = async () => {
        if (!profile) return;

        setToggling(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:5000/api/vendors/availability",
                { is_available: !profile.is_available },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProfile((current) => ({
                ...current,
                is_available: response.data.vendor?.is_available ?? !current.is_available
            }));
        } catch (toggleError) {
            console.error(toggleError);
            setError("Failed to update shop status");
        } finally {
            setToggling(false);
        }
    };

    if (loading) {
        return <h2>Loading profile...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                My Shop
            </h1>

            {profile.shop_image && (
                <img
                    src={resolveImageUrl(profile.shop_image)}
                    alt={profile.business_name}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                />
            )}

            <div className="bg-white shadow rounded-lg p-6">

                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold">
                        {profile.business_name}
                    </h2>

                    <button
                        type="button"
                        onClick={handleAvailabilityToggle}
                        disabled={toggling}
                        className={`rounded-full px-4 py-2 text-sm font-bold text-white ${profile.is_available ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                    >
                        {toggling ? "Updating..." : profile.is_available ? "🟢 Shop Open" : "🔴 Shop Closed"}
                    </button>
                </div>

                <p className="text-gray-600 mt-2">
                    Category: {profile.category}
                </p>

                <p className="mt-3">
                    Phone: {profile.phone}
                </p>

                <p className="mt-2">
                    Location: {profile.location_info}
                </p>

                <p className="mt-2">
                    Delivery: {profile.delivary_info}
                </p>

                <p className="mt-2">
                    Rating: ⭐ {profile.rating}
                </p>

                <p className={`mt-4 text-sm font-semibold ${profile.is_available ? "text-green-700" : "text-red-700"}`}>
                    {profile.is_available ? "Currently accepting orders" : "Currently closed to new orders"}
                </p>

            </div>

        </div>
    );
}

export default VendorProfile;