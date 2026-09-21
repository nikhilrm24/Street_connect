import { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

function Map({ location, vendorLocations = [] }) {
  const [center, setCenter] = useState(location || {
    lat: 12.9716,
    lng: 77.5946,
  });
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!location) {
          setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          });
        }
      },
      () => {
        console.log("Location permission denied");
      }
    );
  }, [location]);

  const validLocations = vendorLocations.filter((vendorLocation) => {
    const latitude = Number(vendorLocation.latitude);
    const longitude = Number(vendorLocation.longitude);
    return Number.isFinite(latitude) && Number.isFinite(longitude);
  });

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
        {location ? (
          <Marker
            position={location}
            label={{ text: "You", color: "#ffffff", fontWeight: "700" }}
          />
        ) : null}
        {validLocations.map((vendorLocation) => (
          <Marker
            key={vendorLocation.location_id || vendorLocation.vendor_id}
            position={{
              lat: Number(vendorLocation.latitude),
              lng: Number(vendorLocation.longitude),
            }}
            label={{
              text: String(vendorLocation.business_name || "Stall").slice(0, 10),
              color: "#ffffff",
              fontWeight: "700",
            }}
            onClick={() => setSelectedVendor(vendorLocation)}
          />
        ))}
        {selectedVendor ? (
          <InfoWindow
            position={{
              lat: Number(selectedVendor.latitude),
              lng: Number(selectedVendor.longitude),
            }}
            onCloseClick={() => setSelectedVendor(null)}
          >
            <div className="min-w-32">
              <strong className="text-base">
                {selectedVendor.business_name || "Unnamed stall"}
              </strong>
              {selectedVendor.category ? (
                <div className="mt-1 text-sm">{selectedVendor.category}</div>
              ) : null}
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;