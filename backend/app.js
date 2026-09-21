const express=require("express");
const { ensureProductImageColumn } = require("./src/db");
const app=express();
const cors=require("cors");
const path = require("path");
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
app.use(cors());
const authrouter = require("./src/routes/authRoutes");
const vendorrouter=require("./src/routes/vendorRoutes");
const categoryrouter=require("./src/routes/categoryRoute");
const productrouter=require("./src/routes/productRoute")
const errorMiddleware = require("./src/middleware/errorMiddleware");
const orderrouter = require("./src/routes/orderRoutes");
const adminrouter = require("./src/routes/adminRoutes");

app.use(express.json());
app.use("/api", authrouter);
app.use("/api", productrouter);
app.use("/api", orderrouter);
app.use("/api", adminrouter);
app.use("/api", vendorrouter);
app.use("/api", categoryrouter);

app.use(errorMiddleware);

ensureProductImageColumn()
  .then(() => {
    app.listen(5000,()=>{
      console.log("server listneing on 5000");
    });
  })
  .catch((error) => {
    console.error("Failed to prepare database", error);
    process.exit(1);
  });