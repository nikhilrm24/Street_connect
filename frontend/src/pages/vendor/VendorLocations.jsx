import { useState } from "react";
import axios from "axios";
import VendorChrome from "../../components/VendorChrome";

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
    <VendorChrome>
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Shop Location</h1>
        <p className="mt-3 text-lg text-mute">
          Customers nearby can find your shop using your location.
        </p>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-sand bg-white shadow-sm">
          <div className="stall-pattern flex h-40 items-center justify-center text-white">
            <p className="px-6 text-center font-display text-2xl font-bold">Pin your stall</p>
          </div>
          <div className="p-6">
            <button
              onClick={handleGetLocation}
              disabled={loading}
              className="w-full min-h-16 rounded-2xl bg-clay text-xl font-black text-white hover:bg-clay-dark disabled:opacity-60"
            >
              {loading ? "Getting Location..." : "📍 Use My Current Location"}
            </button>

            {message ? (
              <p className="mt-4 text-center text-lg font-bold text-forest">{message}</p>
            ) : null}

            {location ? (
              <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-center font-extrabold text-emerald-900">
                Your shop location is saved. Nearby customers can find you.
              </p>
            ) : null}
          </div>
        </div>
      </main>
    </VendorChrome>
  );
}

export default VendorLocation;
