const express=require("express");
const { getProducts, getProduct,insertProduct,getVendorProductsController,updateProductController } = require("../controllers/productController");
const verifyToken = require("../middleware/authMiddleware");
const router=express.Router();

router.get("/vendors/:id/products",getProducts);
router.get("/products/:id",getProduct);

router.post("/vendors/products", verifyToken, insertProduct);

router.get("/vendors/products", verifyToken, getVendorProductsController);

router.put("/vendors/products/:id", verifyToken, updateProductController);

module.exports=router;