const express=require("express");
const { getVendors, getVendor, getProfile ,UpdateVendor} = require("../controllers/vendorController");
const verifyToken=require("../middleware/authMiddleware");
const router=express.Router();


router.get("/vendors",getVendors);
router.get("/vendors/profile",verifyToken,getProfile);
router.get("/vendors/:id",getVendor);
router.put("/vendors/profile",verifyToken,UpdateVendor);


module.exports=router;