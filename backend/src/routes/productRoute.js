const express=require("express");
const { getProducts, getProduct,insertProduct,getVendorProductsController,updateProductController, deleteProductController } = require("../controllers/productController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { route } = require("./vendorRoutes");
const router=express.Router();

router.get("/vendors/products", verifyToken, getVendorProductsController);

router.get("/vendors/:id/products", getProducts);

router.get("/products/:id", getProduct);

router.post("/vendors/products", verifyToken, upload.single("product_image"), insertProduct);

router.put("/vendors/products/:id", verifyToken, updateProductController);

router.delete("/vendors/products/:id", verifyToken, deleteProductController);
module.exports=router;