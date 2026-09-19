const express=require("express");
const { getVendors, getVendor, getProfile ,UpdateVendor, updateAvailability, getLocation, updateLocation,getAllLocations} = require("../controllers/vendorController");
const verifyToken=require("../middleware/authMiddleware");
const router=express.Router();


router.get("/vendors",getVendors);
router.get("/vendors/profile",verifyToken,getProfile);
router.get("/vendors/locations", getAllLocations);
router.put("/vendors/profile",verifyToken,UpdateVendor);
router.put("/vendors/availability", verifyToken, updateAvailability);
router.get("/vendors/location", verifyToken, getLocation);
router.put("/vendors/location", verifyToken, updateLocation);
router.get("/vendors/:id",getVendor);


module.exports=router;