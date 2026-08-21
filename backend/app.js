const express=require("express");
const app=express();

const router = require("./src/routes/authRoutes");
const errorMiddleware = require("./src/middleware/errorMiddleware");

app.use(express.json());
app.use("/api",router);
app.use(errorMiddleware);

app.listen(5000,()=>{
    console.log("server listneing on 5000");
})