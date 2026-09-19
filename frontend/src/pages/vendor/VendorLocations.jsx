import { useState } from "react";
import axios from "axios";

function VendorLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGetLocation = () => {
    setLoading(true);
    setMessage("");

    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const token = localStorage.getItem("token");

          const response = await axios.put(
            "http://localhost:5000/api/vendors/location",
            {
              latitude,
              longitude,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setLocation(response.data.location);
          setMessage("Location updated successfully");
        } catch (error) {
          console.error(error);
          setMessage("Failed to update location");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setMessage("Unable to get your location");
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Shop Location
      </h1>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 mb-6">
          Use your current location to set your shop location.
        </p>

        <button
          onClick={handleGetLocation}
          disabled={loading}
          className="w-full bg-black text-white rounded p-3"
        >
          {loading ? "Getting Location..." : "📍 Use My Current Location"}
        </button>

        {message && (
          <p className="text-center mt-4">
            {message}
          </p>
        )}
      </div>

      {location && (
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <h2 className="font-bold">
            Current Shop Location
          </h2>

          <p className="mt-2">
            Latitude: {location.latitude}
          </p>

          <p>
            Longitude: {location.longitude}
          </p>
        </div>
      )}
    </div>
  );
}

export default VendorLocation;