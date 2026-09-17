import {GoogleMap,LoadScript,Marker} from '@react-google-maps/api';
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const containerStyle={
    width:"100%",
    height:"400px",
};


function Map({location,vendorLocations}){
    return(
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={11}>
                {vendorLocations.map((vendor)=>(
                    <Marker
                    key={vendor.vendor_id}
                    position={{
                        lat:Number(vendor.latitude),
                        lng:Number(vendor.longitude),
                    }}
                    />
                ))}

            </GoogleMap>
        </LoadScript>
    )
}
export default Map;