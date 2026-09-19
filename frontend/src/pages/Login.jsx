import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login(){
    const navigate=useNavigate();
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [message,setMessage]=useState("");
    const[msgType,setMsgType]=useState("");

   async function handleSubmit(e) {
  e.preventDefault();

  const data = {
    email,
    password,
  };

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      data
    );

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

  } catch (e) {
    setMessage(e.response?.data?.message || "Login failed");
    setMsgType("error");
  }
}
    return(
        <div className="flex justify-center items-center my-30 ">
            
            <form  className="flex flex-col min-h-125 justify-center items-center bg-gray-300 w-full max-w-md rounded-xl" 
            onSubmit={handleSubmit}>
                <h1 className="text-4xl font-bold mb-3.5 text-center text-green-900">Login</h1>
                
                <label htmlFor="email" className="my-2 w-62.5 text-xl">Email</label>
                <input type="email" name="" id="email" placeholder="enter your email" className="border-2 p-2 rounded-xl w-62.5"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
                <label htmlFor="pass" className="my-2 w-62.5 text-xl">Password</label>
                <input type="password" id="pass" placeholder="enter your password" className="border-2 p-2 rounded-xl w-62.5"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}/>
                <button className="my-2 bg-green-800 p-2 rounded-2xl text-white mt-5 font-bold w-25">Login</button>
                 <p className={msgType==="success"?"text-green-600 font-bold":"text-red-600 "}>{message}</p>
                 <p className="mt-4 text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="font-semibold text-green-800 hover:underline">
                    Register
                  </Link>
                 </p>
            </form>
           
        </div>
    )

}
export default Login;