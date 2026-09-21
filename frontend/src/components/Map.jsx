import { useEffect, useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

function Map() {
  const [center, setCenter] = useState({
    lat: 12.9716,
    lng: 77.5946,
  });

  const [vendorLocations, setVendorLocations] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Location permission denied");
      }
    );
  }, []);

  useEffect(() => {
    const fetchVendorLocations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/vendors/locations"
        );

        setVendorLocations(response.data.locations);
      } catch (error) {
        console.error("Failed to load vendor locations", error);
      }
    };

    fetchVendorLocations();
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "min(420px, 55vh)",
        }}
        center={center}
        zoom={13}
      >
        {vendorLocations.map((location) => (
          <Marker
            key={location.location_id}
            position={{
              lat: Number(location.latitude),
              lng: Number(location.longitude),
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;