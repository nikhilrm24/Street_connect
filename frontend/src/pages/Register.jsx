import { useState } from "react";
import axios from "axios";

function Register(){

    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    
    function handleSubmit(e){
        e.preventDefault();
        const data = {
          name,
          email,
          password,
          role: "customer"
};
axios.post("http://localhost:5000/api/auth/register",data).then((response)=>{
    console.log(response);
        }).catch((e)=>{
        console.log(e.response);
        })

    }
  

    return(
        <div className="flex justify-center items-center my-30 ">
            
            <form action="" className="flex flex-col min-h-[500px] justify-center items-center bg-gray-300 w-full max-w-md rounded-xl" 
            onSubmit={handleSubmit}>
                <h1 className="text-4xl font-bold mb-3.5 text-center text-green-900">Register</h1>
                <label htmlFor="name"className="my-2 w-[250px] text-xl ">Name</label>
                <input type="text" placeholder="enter your name" id="name" className="border-2 p-2 rounded-xl w-[250px]" 
                value={name}
                onChange={(e)=>setName(e.target.value)}/>
                <label htmlFor="email" className="my-2 w-[250px] text-xl">Email</label>
                <input type="email" name="" id="email" placeholder="enter your email" className="border-2 p-2 rounded-xl w-[250px]"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
                <label htmlFor="pass" className="my-2 w-[250px] text-xl">Password</label>
                <input type="password" id="pass" placeholder="enter your password" className="border-2 p-2 rounded-xl w-[250px]"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}/>
                <button className="my-2 bg-green-800 p-2 rounded-2xl text-white mt-5 font-bold w-[100px]">Register</button>
            </form>
        </div>
    )
}


export default Register;