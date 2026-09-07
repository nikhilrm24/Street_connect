const express=require("express");
const { getVendors, getVendor, getProfile ,UpdateVendor, getLocation, updateLocation} = require("../controllers/vendorController");
const verifyToken=require("../middleware/authMiddleware");
const router=express.Router();


router.get("/vendors",getVendors);
router.get("/vendors/profile",verifyToken,getProfile);
router.get("/vendors/:id",getVendor);
router.put("/vendors/profile",verifyToken,UpdateVendor);

router.get("/vendors/location", verifyToken,getLocation);

router.put("/vendors/location",verifyToken,updateLocation);
module.exports=router;