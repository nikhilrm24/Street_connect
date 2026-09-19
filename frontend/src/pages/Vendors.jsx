import { useState ,useEffect} from "react";
import axios from "axios";
import Map from "../components/Map";
import { useNavigate } from "react-router-dom";
function Vendors() {
    const navigate=useNavigate();
    const [search, setSearch] = useState("");
    const [vendors,setVendors]=useState([]);
    const [location,setLocation]=useState(null);
    const [vendorLocations,setVendorLocations]=useState([]);

   useEffect(()=>{
    axios.get("http://localhost:5000/api/vendors").then((response)=>{
        console.log(response.data);
        setVendors(response.data.vendors);
    })
    .catch((error)=>{
        console.log(error);
    })
   },[]);

   const filteredVendors = vendors.filter((vendor) =>
    vendor.business_name.toLowerCase().includes(search.toLowerCase())
);

useEffect(()=>{
    axios.get("http://localhost:5000/api/vendors/locations")
    .then((response)=>{
        console.log(response.data);
        setVendorLocations(response.data.locations);
    })
     .catch((error) => {
            console.log(error);
        });
},[])

function handleLocation(){
    navigator.geolocation.getCurrentPosition((position)=>{
        const userLocation={
            lat:position.coords.latitude,
            lng:position.coords.longitude,
        };
        console.log(userLocation);
        setLocation(userLocation);
    },(error)=>{
        console.log("error");
    })
}

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">

            
            <header className="border-b border-gray-200 bg-white">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
                    <h1 className="text-2xl font-bold tracking-tight text-emerald-700">
                        Street Connect
                    </h1>

                    <p className="text-sm font-medium text-gray-600">
                        Find Local Vendors
                    </p>
                </nav>
            </header>


            
            <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">

                
                <section className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Find Vendors Near You
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-gray-600">
                        Discover local vendors around your location and shop
                        from nearby businesses.
                    </p>
                </section>


               
                <section className="mx-auto mt-8 max-w-2xl">

                    <button
                        className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                     onClick={handleLocation}>
                        📍 Use My Location
                    </button>

                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
                        />
                    </div>
                    {location&&<Map location={location}
                    vendorLocations={vendorLocations}/>}

                </section>


               
                <section className="mt-10">

                    <h3 className="mb-6 text-2xl font-bold">
                        Nearby Vendors
                    </h3>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {filteredVendors.map((vendor) => (
                            <div
                                key={vendor.vendor_id}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                            >

                                <div className="flex items-center justify-between gap-3">
                                    <h4 className="text-xl font-bold text-gray-900">
                                        {vendor.business_name}
                                    </h4>

                                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${vendor.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {vendor.is_available ? "Open" : "Closed"}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm font-medium text-emerald-700">
                                    {vendor.category}
                                </p>

                                <p className="mt-3 text-sm text-gray-600">
                                    📍 {vendor.location_info}
                                </p>

                                <p className={`mt-3 text-sm font-medium ${vendor.is_available ? "text-green-700" : "text-red-700"}`}>
                                    {vendor.is_available ? "Accepting orders" : "Not accepting orders"}
                                </p>

                                <button
                                    className="mt-5 w-full rounded-lg border border-emerald-600 px-4 py-2 font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
                                    onClick={()=>navigate(`/vendors/${vendor.vendor_id}`)}
                                >
                                    View Details
                                </button>

                            </div>
                        ))}

                    </div>

                </section>

            </main>


            <footer className="mt-12 bg-gray-900 px-6 py-8 text-center text-white">
                <h2 className="text-xl font-bold text-emerald-400">
                    Street Connect
                </h2>

                <p className="mt-2 text-sm text-gray-300">
                    Shop Local. Support Local.
                </p>

                <p className="mt-4 text-xs text-gray-500">
                    © 2026 Street Connect
                </p>
            </footer>

        </div>
    );
}

export default Vendors;