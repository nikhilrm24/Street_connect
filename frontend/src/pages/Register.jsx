import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Field, fieldClass } from "../components/ui";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customer");

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [locationInfo, setLocationInfo] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [shopImage, setShopImage] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

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

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);

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

      const response = await axios.post("http://localhost:5000/api/auth/register", formData);

      setMessage(response.data.message || "Registration successful!");

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
    } catch (requestError) {
      console.error(requestError);

      if (requestError.response) {
        setError(requestError.response.data.message || "Registration failed");
      } else {
        setError("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-8">
      <div className="mx-auto w-full max-w-lg overflow-hidden rounded-[2rem] border border-sand bg-white shadow-xl">
        <div className="stall-pattern px-6 py-8 text-white">
          <Link to="/home" className="font-display text-2xl font-bold">
            Street Connect
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold">Create Account</h1>
          <p className="mt-1 text-sand">Join as a shopper or open your stall.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-cream p-1">
            {[
              ["customer", "Customer"],
              ["vendor", "Vendor"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`min-h-12 rounded-xl font-extrabold ${
                  role === value ? "bg-forest text-white" : "text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Field label="Name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className={fieldClass}
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className={fieldClass}
            />
          </Field>

          <Field label="Password">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className={`${fieldClass} pr-24`}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-sm font-extrabold text-forest"
                onClick={() => setShowPassword((open) => !open)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </Field>

          {role === "vendor" && (
            <div className="space-y-5 border-t border-sand pt-5">
              <h2 className="font-display text-xl font-bold">Shop Details</h2>

              <Field label="Shop photo">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  onChange={handleImageChange}
                  className={fieldClass}
                />
                {shopImage && (
                  <div className="mt-3">
                    <p className="mb-2 text-sm text-mute">Selected: {shopImage.name}</p>
                    <img
                      src={URL.createObjectURL(shopImage)}
                      alt="Shop preview"
                      className="h-48 w-full rounded-2xl object-cover"
                    />
                  </div>
                )}
              </Field>

              <Field label="Business Name">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your shop name"
                  required
                  className={fieldClass}
                />
              </Field>

              <Field label="Category">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Example: Fruits, Tea, Flowers"
                  required
                  className={fieldClass}
                />
              </Field>

              <Field label="Phone">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  required
                  className={fieldClass}
                />
              </Field>

              <Field label="Shop Location">
                <input
                  type="text"
                  value={locationInfo}
                  onChange={(e) => setLocationInfo(e.target.value)}
                  placeholder="Example: Yelahanka, Bangalore"
                  required
                  className={fieldClass}
                />
              </Field>

              <Field label="Delivery Information">
                <input
                  type="text"
                  value={deliveryInfo}
                  onChange={(e) => setDeliveryInfo(e.target.value)}
                  placeholder="Example: Home delivery available"
                  required
                  className={fieldClass}
                />
              </Field>
            </div>
          )}

          {error && <p className="text-center font-bold text-red-700">{error}</p>}
          {message && <p className="text-center font-bold text-emerald-700">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-14 rounded-2xl bg-clay text-lg font-black text-white hover:bg-clay-dark disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="px-6 pb-8 text-center text-mute">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-extrabold text-forest hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
