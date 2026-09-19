import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function NavbarVendor() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://localhost:5000/api/vendors/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((response) => {
      setUnreadCount(response.data.unread_count || 0);
    }).catch(() => {
      setUnreadCount(0);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          to="/vendor/dashboard"
          className="text-xl font-bold"
        >
          Street Connect
        </Link>

        <div className="flex items-center gap-6">

          <Link
            to="/vendor/dashboard"
            className="hover:text-gray-300"
          >
            Dashboard
          </Link>

          <Link
            to="/vendor/products"
            className="hover:text-gray-300"
          >
            Products
          </Link>

          <Link
            to="/vendor/products/add"
            className="hover:text-gray-300"
          >
            Add Product
          </Link>

          <Link
            to="/vendor/profile"
            className="hover:text-gray-300"
          >
            Profile
          </Link>

          <Link
            to="/vendor/location"
            className="hover:text-gray-300"
          >
            Location
          </Link>

          {/* Orders */}
          <Link
            to="/vendor/orders"
            className="hover:text-gray-300"
          >
            Orders
          </Link>

          <Link
            to="/vendor/notifications"
            className="relative hover:text-gray-300"
          >
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

export default NavbarVendor;