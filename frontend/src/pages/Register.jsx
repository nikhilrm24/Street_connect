import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  // Common user fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  // Vendor fields
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [locationInfo, setLocationInfo] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [shopImage, setShopImage] = useState(null);

  // UI state
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG and PNG images are allowed");
      setShopImage(null);
      return;
    }

    setError("");
    setShopImage(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      // Common fields
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);

      // Vendor fields
      if (role === "vendor") {
        formData.append("business_name", businessName);
        formData.append("category", category);
        formData.append("phone", phone);
        formData.append("location_info", locationInfo);
        formData.append("delivary_info", deliveryInfo);

        if (shopImage) {
          formData.append("shop_image", shopImage);
        }
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      setMessage(
        response.data.message || "Registration successful!"
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setRole("customer");

      setBusinessName("");
      setCategory("");
      setPhone("");
      setLocationInfo("");
      setDeliveryInfo("");
      setShopImage(null);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
          "Registration failed"
        );
      } else {
        setError("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Join Street Connect
        </p>

        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block font-medium mb-1">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block font-medium mb-1">
              Account Type
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {/* Vendor Fields */}
          {role === "vendor" && (
            <div className="border-t pt-5 mt-5 space-y-5">

              <h2 className="text-xl font-bold">
                Shop Details
              </h2>

              {/* Business Name */}
              <div>
                <label className="block font-medium mb-1">
                  Business Name
                </label>

                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your shop name"
                  required
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-medium mb-1">
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Example: Fruits, Tea, Flowers"
                  required
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-medium mb-1">
                  Phone
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  required
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-medium mb-1">
                  Shop Location
                </label>

                <input
                  type="text"
                  value={locationInfo}
                  onChange={(e) => setLocationInfo(e.target.value)}
                  placeholder="Example: Yelahanka, Bangalore"
                  required
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* Delivery */}
              <div>
                <label className="block font-medium mb-1">
                  Delivery Information
                </label>

                <input
                  type="text"
                  value={deliveryInfo}
                  onChange={(e) => setDeliveryInfo(e.target.value)}
                  placeholder="Example: Home delivery available"
                  required
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* Shop Image */}
              <div>
                <label className="block font-medium mb-1">
                  Shop Image
                </label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  onChange={handleImageChange}
                  className="w-full border rounded-lg p-3"
                />

                {shopImage && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Selected: {shopImage.name}
                    </p>

                    <img
                      src={URL.createObjectURL(shopImage)}
                      alt="Shop preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-600 text-center">
              {error}
            </p>
          )}

          {/* Success */}
          {message && (
            <p className="text-green-600 text-center">
              {message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg p-3 font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        {/* Login */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-black hover:underline"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;