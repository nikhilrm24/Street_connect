import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Field, fieldClass } from "../components/ui";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", data);

      localStorage.setItem("token", response.data.token);

      setMessage("Login Successful");
      setMsgType("success");

      const role = response.data.user.role;

      if (role === "vendor") {
        navigate("/vendor/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
      setMsgType("error");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-sand bg-white shadow-xl lg:grid-cols-2">
        <div className="stall-pattern hidden flex-col justify-end p-8 text-white lg:flex">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-sand">
            Street Connect
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold">
            Welcome back to the neighborhood.
          </h1>
        </div>

        <form className="flex flex-col justify-center p-6 sm:p-10" onSubmit={handleSubmit}>
          <Link to="/home" className="font-display text-2xl font-bold text-forest">
            Street Connect
          </Link>
          <h2 className="mt-4 font-display text-3xl font-bold">Login</h2>
          <p className="mt-1 text-mute">Sign in to shop or run your stall.</p>

          <div className="mt-6 space-y-4">
            <Field label="Email">
              <input
                type="email"
                id="email"
                placeholder="enter your email"
                className={fieldClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="pass"
                  placeholder="enter your password"
                  className={`${fieldClass} pr-24`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <button className="mt-6 min-h-14 rounded-2xl bg-forest text-lg font-black text-white hover:bg-forest-deep">
            Login
          </button>
          <p
            className={
              msgType === "success" ? "mt-3 font-bold text-emerald-700" : "mt-3 font-bold text-red-700"
            }
            role={msgType === "error" ? "alert" : undefined}
          >
            {message}
          </p>
          <p className="mt-4 text-sm text-mute">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-extrabold text-forest hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
