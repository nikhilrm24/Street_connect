const express=require("express");
const app=express();

const authrouter = require("./src/routes/authRoutes");
const vendorrouter=require("./src/routes/vendorRoutes");
const categoryrouter=require("./src/routes/categoryRoute");
const productrouter=require("./src/routes/productRoute")
const errorMiddleware = require("./src/middleware/errorMiddleware");

app.use(express.json());
app.use("/api",authrouter);
app.use("/api",vendorrouter);
app.use("/api",categoryrouter)
app.use("/api",productrouter)
app.use(errorMiddleware);

app.listen(5000,()=>{
    console.log("server listneing on 5000");
})