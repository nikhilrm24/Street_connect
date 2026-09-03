const express=require("express");
const { getProducts, getProduct } = require("../controllers/productController");

const router=express.Router();

router.get("/vendors/:id/products",getProducts);
router.get("/products/:id",getProduct);

module.exports=router;