import { useEffect, useState } from "react";
import axios from "axios";

function VendorProfile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

                setProfile(response.data.profile);

            } catch (error) {

                console.error(error);
                setError("Failed to load profile");

            } finally {

                setLoading(false);

            }
        };

        fetchProfile();

    }, []);


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
                    src={profile.shop_image}
                    alt={profile.business_name}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                />
            )}

            <div className="bg-white shadow rounded-lg p-6">

                <h2 className="text-2xl font-bold">
                    {profile.business_name}
                </h2>

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

            </div>

        </div>
    );
}

export default VendorProfile;