const express=require("express");
const { getProducts } = require("../controllers/productController");
const router=express.Router();

router.get("/vendors/:id/products",getProducts);

module.exports=router;