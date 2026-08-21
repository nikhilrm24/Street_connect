const express=require("express");
const app=express();

const {pool}=require("./src/db");

app.use(express.json());

app.get("/",async (req,res)=>{
    const result=await pool.query("select now()")
    res.json(result.rows);
})

app.listen(5000,()=>{
    console.log("server listneing on 5000");
})