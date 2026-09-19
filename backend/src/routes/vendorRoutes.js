const express=require("express");
const { getVendors, getVendor, getProfile ,UpdateVendor, updateAvailability, getLocation, updateLocation,getAllLocations} = require("../controllers/vendorController");
const verifyToken=require("../middleware/authMiddleware");
const roleMiddleware=require("../middleware/roleMiddleware");
const router=express.Router();


router.get("/vendors",getVendors);
router.get("/vendors/profile",verifyToken,roleMiddleware("vendor"),getProfile);
router.get("/vendors/locations", getAllLocations);
router.put("/vendors/profile",verifyToken,roleMiddleware("vendor"),UpdateVendor);
router.put("/vendors/availability", verifyToken,roleMiddleware("vendor"), updateAvailability);
router.get("/vendors/location", verifyToken,roleMiddleware("vendor"), getLocation);
router.put("/vendors/location", verifyToken,roleMiddleware("vendor"), updateLocation);
router.get("/vendors/:id",getVendor);


module.exports=router;