import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import VendorChrome from "../../components/VendorChrome";

function VendorLocation() {
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/vendors/location", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const savedLocation = response.data.location;
        const point = {
          lat: Number(savedLocation.latitude),
          lng: Number(savedLocation.longitude),
        };
        setLocation(savedLocation);
        setMapCenter(point);
        setSelectedLocation(point);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(error);
        }
      }
    };

    loadSavedLocation();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation || selectedLocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      setMapCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, [selectedLocation]);

  const saveLocation = async (point) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      "http://localhost:5000/api/vendors/location",
      { latitude: point.lat, longitude: point.lng },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setLocation(response.data.location);
  };

  const handleUseLiveLocation = () => {
    setLoading(true);
    setMessage("");

    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        try {
          setMapCenter(point);
          setSelectedLocation(point);
          await saveLocation(point);
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

  const handleSaveSelectedLocation = async () => {
    if (!selectedLocation) {
      setMessage("Click the map to choose your stall location");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      await saveLocation(selectedLocation);
      setMessage("Map location updated successfully");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update map location");
    } finally {
      setLoading(false);
    }
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
              onClick={handleUseLiveLocation}
              disabled={loading}
              className="w-full min-h-16 rounded-2xl bg-clay text-xl font-black text-white hover:bg-clay-dark disabled:opacity-60"
            >
              {loading ? "Updating Location..." : "📍 Use My Current Location"}
            </button>

            <div className="mt-6 border-t border-sand pt-6">
              <h2 className="font-display text-2xl font-bold">Set location on map</h2>
              <p className="mt-2 text-sm text-mute">
                Click the map to place your stall pin, then drag it to the exact spot.
              </p>
              <div className="mt-4 overflow-hidden rounded-3xl border border-sand">
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "min(420px, 55vh)" }}
                    center={mapCenter}
                    zoom={15}
                    onClick={(event) => {
                      if (event.latLng) {
                        setSelectedLocation({
                          lat: event.latLng.lat(),
                          lng: event.latLng.lng(),
                        });
                      }
                    }}
                  >
                    {selectedLocation ? (
                      <Marker
                        position={selectedLocation}
                        draggable
                        onDragEnd={(event) => {
                          if (event.latLng) {
                            setSelectedLocation({
                              lat: event.latLng.lat(),
                              lng: event.latLng.lng(),
                            });
                          }
                        }}
                      />
                    ) : null}
                  </GoogleMap>
                </LoadScript>
              </div>
              <button
                type="button"
                onClick={handleSaveSelectedLocation}
                disabled={loading || !selectedLocation}
                className="mt-4 w-full min-h-14 rounded-2xl border-2 border-forest font-black text-forest hover:bg-forest hover:text-white disabled:opacity-60"
              >
                {loading ? "Saving Map Location..." : "Save Map Location"}
              </button>
            </div>

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
