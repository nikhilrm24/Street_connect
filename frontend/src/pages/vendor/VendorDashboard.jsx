import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarVendor from "../../components/NavbarVendor";

function VendorDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    today_orders: 0,
    completed_orders: 0,
    today_sales: 0,
    total_sales: 0
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/vendors/sales-summary", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSummary(response.data.summary || {
          today_orders: 0,
          completed_orders: 0,
          today_sales: 0,
          total_sales: 0
        });
      } catch (error) {
        console.error("Failed to load sales summary", error);
      }
    };

    fetchSummary();
  }, []);

  const cards = [
    {
      title: "Products",
      description: "Add, edit and manage your shop products.",
      action: "Manage Products",
      path: "/vendor/products",
    },
    {
      title: "Add Product",
      description: "Add a new product to your shop.",
      action: "Add Product",
      path: "/vendor/products/add",
    },
    {
      title: "Shop Profile",
      description: "Manage your shop information and image.",
      action: "View Profile",
      path: "/vendor/profile",
    },
    {
      title: "Shop Location",
      description: "Update your shop's current location.",
      action: "Manage Location",
      path: "/vendor/location",
    },
    {
      title: "Orders",
      description: "View and manage customer orders.",
      action: "Manage Orders",
      path: "/vendor/orders",
    },
  ];

  const stats = [
    { label: "Today's Orders", value: summary.today_orders },
    { label: "Completed Orders", value: summary.completed_orders },
    { label: "Today's Sales", value: `₹${Number(summary.today_sales || 0)}` },
    { label: "Total Sales", value: `₹${Number(summary.total_sales || 0)}` }
  ];

  return (
    <>
      <NavbarVendor />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Vendor Dashboard
            </h1>

            <p className="text-gray-600 mt-2">
              Manage your shop, products and location.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl shadow-sm p-6 border"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {card.title}
                </h2>

                <p className="text-gray-600 mt-2 mb-6">
                  {card.description}
                </p>

                {card.path ? (
                  <button
                    onClick={() => navigate(card.path)}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    {card.action}
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
                  >
                    {card.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorDashboard;